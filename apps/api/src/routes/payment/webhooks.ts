// src/routes/stripe-webhook.ts
import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import Stripe from "stripe";
import { prisma } from "../../db/index.js";
// Import the new fulfillment function
import { handleOneTimePurchaseFulfillment } from "./Onetimepaymenthandler.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});


export const stripeWebhookRoute = createRoute({
  method: "post",
  path: "/stripe/webhook",
  tags: ["Stripe"],
  responses: {
    200: { description: "Webhook received" },
    400: { description: "Invalid request" },
    500: { description: "Internal server error" },
  },
});

export const stripeWebhookHandler = async (c: Context) => {
  console.log("Got Stripe webhook event.");
  const payload = await c.req.text();
  const sig = c.req.header("stripe-signature");
  if (!sig) {
    console.error("Missing Stripe signature in webhook.");
    return c.text("Missing signature", 400);
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return c.text(`Webhook Error: ${err.message}`, 400);
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const stripeId = subscription.id;
        const stripeCustomerId = subscription.customer as string;
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

        let subStatus: "ACTIVE" | "CANCELLED" | "PAST_DUE" | "EXPIRED";

        switch (subscription.status) {
          case "active":
          case "trialing":
            subStatus = "ACTIVE";
            break;
          case "past_due":
            subStatus = "PAST_DUE";
            break;
          case "canceled":
            subStatus = "CANCELLED";
            break;
          case "incomplete_expired":
          case "expired":
            subStatus = "EXPIRED";
            break;
          default:
            subStatus = "ACTIVE"; // Default to active for unhandled statuses
        }

        const dbUser = await prisma.user.findFirst({ where: { stripeCustomerId } });
        if (!dbUser) {
          console.warn(`Webhook: No user found for Stripe customer ${stripeCustomerId}`);
          break;
        }

        await prisma.subscription.upsert({
          where: { stripeId },
          create: {
            userId: dbUser.id,
            stripeId,
            status: subStatus,
            currentPeriodEnd,
            digitalBooksUsed: 0,
            digitalBookQuota: 10, // Default quota
          },
          update: {
            status: subStatus,
            currentPeriodEnd,
            // Reset used count if subscription becomes active again
            digitalBooksUsed: (subStatus === "ACTIVE" || subscription.status === "trialing") ? 0 : undefined,
          },
        });

        console.log(`Webhook: Subscription ${stripeId} for user ${dbUser.id} updated to ${subStatus}`);
        break;
      }

      // NEW: Handle one-time purchase completion
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Webhook: Checkout session ${session.id} completed.`);

        // Ensure it's a payment session and has our custom metadata
        if (session.mode === 'payment' && session.metadata?.projectId) {
            const projectId = session.metadata.projectId;
            const stripeCustomerId = session.customer as string;

            if (!stripeCustomerId) {
                console.error(`Webhook: No Stripe customer ID found in session ${session.id}`);
                break;
            }

            const dbUser = await prisma.user.findFirst({ where: { stripeCustomerId } });
            if (!dbUser) {
                console.warn(`Webhook: No user found for Stripe customer ${stripeCustomerId} during one-time purchase fulfillment.`);
                break;
            }

            try {
                // Call the one-time fulfillment logic
                await handleOneTimePurchaseFulfillment(projectId, dbUser.id);
                console.log(`Webhook: One-time purchase fulfillment successful for project ${projectId}.`);
            } catch (fulfillmentError: any) {
                console.error(`Webhook: Error during one-time purchase fulfillment for project ${projectId}: ${fulfillmentError.message}`);
                // Depending on the error, you might want to log more details or trigger alerts
            }
        }
        break;
      }

      default:
        console.log(`Webhook: Unhandled Stripe event type: ${event.type}`);
    }

    return c.text("Webhook received", 200);
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
};