// src/routes/payment/verify-and-generate.ts
import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import Stripe from "stripe";
import { prisma } from "../../db/index.js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
// Import the new fulfillment function
import { handleOneTimePurchaseFulfillment } from "./Onetimepaymenthandler.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const requestBodySchema = z.object({
  sessionId: z.string(),
  projectId: z.string(),
});

export const verifyAndGenerateRoute = createRoute({
  method: "post",
  path: "/payment/verifyandgenerate",
  tags: ["Stripe", "PDF"],
  request: {
    body: {
      content: {
        "application/json": { schema: requestBodySchema },
      },
    },
  },
  responses: {
    200: { description: "Payment verified and PDF generated" },
    400: { description: "Invalid request" },
    401: { description: "Unauthorized" },
    404: { description: "Project not found" },
    500: { description: "Internal server error" },
  },
});

export const verifyAndGenerateHandler = async (c: Context) => {
  console.log("Verify and Generate: Client-side initiated verification.");
  const user = c.get("user");
  if (!user) return c.json({ error: "User not authenticated" }, 401);

  const body = requestBodySchema.safeParse(await c.req.json());
  if (!body.success)
    return c.json(
      { error: "Invalid request", details: body.error.issues },
      400
    );

  const { sessionId, projectId } = body.data;

  try {
    // 1. Verify Stripe payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      return c.json({ success: false, message: "Payment not completed" }, 400);
    }

    // 2. Try to retrieve the final PDF directly first
    const finalPdfFileName = `projects/${projectId}/finalstorybook.pdf`;
    const { data: finalPdfSignedData, error: finalPdfSignedError } = await supabase.storage
      .from("storybook-finals")
      .createSignedUrl(finalPdfFileName, 60 * 60);

    if (!finalPdfSignedError && finalPdfSignedData?.signedUrl) {
      console.log(`Verify and Generate: Final PDF already exists for project ${projectId}. Returning existing URL.`);
      return c.json({
        success: true,
        projectId: projectId,
        downloadUrl: finalPdfSignedData.signedUrl,
      });
    }
    // If we reach here, the final PDF doesn't exist yet (or an error occurred getting its URL)
    console.log(`Verify and Generate: Final PDF not found for project ${projectId}. Triggering fulfillment.`);

    // 3. Trigger fulfillment (this will generate and store the PDF if it doesn't exist)
    const downloadUrl = await handleOneTimePurchaseFulfillment(projectId, user.id);

    return c.json({
      success: true,
      projectId: projectId,
      downloadUrl: downloadUrl,
    });

  } catch (error: any) {
    console.error("Verify & generate error:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
};