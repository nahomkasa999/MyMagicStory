import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import Stripe from "stripe";
import { prisma } from "../../db/index.js";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const requestBodySchema = z.object({
  type: z.enum(["subscription"]),
});

export const checkoutRoute = createRoute({
  method: "post",
  path: "/payment/checkout",
  tags: ["Stripe"],
  request: {
    body: {
      content: {  
        "application/json": {
          schema: requestBodySchema,
        },
      },
    },
  },
  responses: {
    200: { description: "Checkout session created" },
    400: { description: "Invalid request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
});

export const checkoutHandler = async (c: Context) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "User not authenticated" }, 401);

  const body = requestBodySchema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: "Invalid request", details: body.error.issues }, 400);

  try {
    // Ensure user has a Stripe customer ID
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    let stripeCustomerId =  dbUser?.stripeCustomerId;;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: stripeCustomerId,
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID!,
          quantity: 1,
        },
      ],
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?canceled=true`,
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
    });

    return c.json({ url: session.url });
  } catch (error: any) {
    // console.error("Stripe checkout error:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
};
