// src/routes/payment/buy-book.ts
import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import Stripe from "stripe";
import { prisma } from "../../db/index.js";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const requestBodySchema = z.object({
  projectId: z.string(),
  returnUrl: z.string()
});

export const buyBookRoute = createRoute({
  method: "post",
  path: "payment/buy-book",
  tags: ["Stripe"],
  request: {
    body: {
      content: {
        "application/json": { schema: requestBodySchema },
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

export const buyBookHandler = async (c: Context) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "User not authenticated" }, 401);

  const body = requestBodySchema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: "Invalid request", details: body.error.issues }, 400);

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, include: { subscriptions: true } });
    if (!dbUser) return c.json({ error: "User not found" }, 404);

    const project = await prisma.project.findUnique({ where: { id: body.data.projectId } });
    if (!project) return c.json({ error: "Project not found" }, 404);

    // Determine discount
    const isSubscribed = dbUser.subscriptions.some(sub => sub.status === "ACTIVE" && sub.currentPeriodEnd > new Date());
    const priceCents = isSubscribed ? Math.round(3000 * 0.8) : 3000;

    // Ensure Stripe customer ID
    let stripeCustomerId = dbUser.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        name: dbUser.name || undefined,
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({ where: { id: dbUser.id }, data: { stripeCustomerId } });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: priceCents,
            product_data: {
              name: project.title || "Ebook",
              description: "Your personalized storybook",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}&project_id=${body.data.projectId}`,
      cancel_url: `https://localhost:3000/dashboard/payment/cancel?project_id=${body.data.projectId}`,
      // ADD THIS METADATA
      metadata: {
        projectId: body.data.projectId,
        userId: user.id, // Also useful for the webhook to identify the user
      },
    });

    return c.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe buy-book error:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
};