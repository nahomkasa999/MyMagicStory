import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import Stripe from "stripe";
import { prisma } from "../../db/index.js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import {
  EnhancedPDFGenerator,
  layoutJsonSchema,
} from "../../services/pdf/index.js";
import * as fs from "fs";
import fetch from "node-fetch";
import { PDFPageGenerator } from "../../services/pdf/generatePdfPages.js";

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
  console.log("I am verified");
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
    // 1. Verify Stripe payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid")
      return c.json({ success: false, message: "Payment not completed" }, 400);

    // 2. Fetch project and user
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        user: true,
        template: true,
        generatedPages: true,
        id: true,
        title: true,
        status: true,
      },
      //include: { user: true, template: true },
    });
    if (!project) return c.json({ error: "Project not found" }, 404);
    const storyTemplateID: string = project.template.id;
    const storyTemplate = await prisma.storyTemplate.findUnique({
      where: { id: storyTemplateID },
      select: { layoutJson: true, title: true },
    });
    if (!storyTemplate) return c.json({ error: "Template not found" }, 404);

    // 3. Check if PDF already exists
    const pdfFileName = `projects/${project.id}/storybook.pdf`;
    const { data: existingUrl, error: existingError } = await supabase.storage
      .from("storybook-pdfs")
      .createSignedUrl(pdfFileName, 60 * 60);

    if (!existingUrl) {
      return; //handle it to send some message to frontend
    }
    if (existingError) {
      return; //send the error message to the frontend
    }

    const response = await fetch(existingUrl.signedUrl);
    if (!response.ok) throw new Error("Failed to download existing PDF");
    const arrayBuffer = await response.arrayBuffer();
    const existingPdfBuffer = Buffer.from(arrayBuffer);
    const pdfPageGenerator = new PDFPageGenerator(
      storyTemplate,
      true,
      project.id
    );
    const { layout, pages } = await pdfPageGenerator.generatePages(4);

    const pdfGenerator = new EnhancedPDFGenerator();
    const result = await pdfGenerator.generatePDF(layout, pages, {
      append: true,
      existingPdfBuffer: existingPdfBuffer,
      outputFormat: "print",
      generatePreviews: false,
      uploadToStorage: false,
    });

    const FinalpdfFileName = `projects/${project.id}/finalstorybook.pdf`;
    const { error: pdfUploadError } = await supabase.storage
      .from("storybook-finals")
      .upload(FinalpdfFileName, result.pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (pdfUploadError) return c.json({ error: "Failed to store PDF" }, 500);

    const { data: pdfSignedData, error: pdfSignedError } =
      await supabase.storage
        .from("storybook-finals")
        .createSignedUrl(FinalpdfFileName, 60 * 60);

    if (pdfSignedError)
      return c.json({ error: "Failed to generate download link" }, 500);

    return c.json({
      success: true,
      projectId: project.id,
      downloadUrl: pdfSignedData.signedUrl,
    });
  } catch (error: any) {
    console.error("Verify & generate error:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
};
