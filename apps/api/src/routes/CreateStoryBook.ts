import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import { writeFile } from "fs/promises";
import * as fs from "node:fs";
import { prisma } from "../db/index.js";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import { EnhancedPDFGenerator } from "../services/pdf/index.js";
import { PDFPageGenerator } from "../services/pdf/generatePdfPages.js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const createPostRoute = createRoute({
  method: "post",
  path: "/post-data/:id",
  tags: ["Data"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              imageUrls: { type: "array", items: { type: "string", format: "uri" } },
            },
            required: ["imageUrls"],
          },
        },
      },
    },
  },
  responses: { 200: { description: "PDF generated" } },
});

export const createPostHandler = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Template ID is required" }, 400);
  const user = c.get("user");
  if (!user) return c.json({ error: "User not authenticated" }, 401);

  try {
    const { imageUrls }: { imageUrls: string[] } = await c.req.json();
    if (!imageUrls || !imageUrls.length)
      return c.json({ error: "No images provided" }, 400);

    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "ACTIVE", currentPeriodEnd: { gt: new Date() } },
    });

    const storyTemplate = await prisma.storyTemplate.findUnique({
      where: { id },
      select: { layoutJson: true, title: true },
    });
    if (!storyTemplate) return c.json({ error: "Template not found" }, 404);

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        templateId: id,
        title: `${storyTemplate.title} - ${new Date().toLocaleDateString()}`,
        status: "DRAFT",
      },
    });

    // --- Use PDFPageGenerator ---
    const pdfPageGenerator = new PDFPageGenerator(storyTemplate, !!subscription, imageUrls);
    const { layout, pages } = await pdfPageGenerator.generatePages();

    // --- Generate PDF ---
    const pdfGenerator = new EnhancedPDFGenerator();
    const result = await pdfGenerator.generatePDF(layout, pages, {
      outputFormat: "print",
      generatePreviews: false,
      uploadToStorage: false,
    });

    // --- Clean up temporary images ---
    pages.forEach((page, idx) => {
      if (page.imagePath) {
        try { fs.unlinkSync(page.imagePath); } catch {}
      }
    });

    // --- Upload to Supabase ---
    const pdfFileName = `projects/${project.id}/storybook.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("storybook-pdfs")
      .upload(pdfFileName, result.pdfBuffer, { contentType: "application/pdf", upsert: true });
    if (uploadError) return c.json({ error: "Failed to store PDF" }, 500);

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("storybook-pdfs")
      .createSignedUrl(pdfFileName, 60 * 60);
    if (signedUrlError) return c.json({ error: "Failed to generate download link" }, 500);

    await prisma.project.update({
      where: { id: project.id },
      data: {
        generatedPages: {
          pdfMetadata: {
            pdfPath: pdfFileName,
            pageCount: result.metadata.pageCount,
            fileSize: result.metadata.fileSize,
            dimensions: result.metadata.dimensions,
            generatedAt: new Date().toISOString(),
            isPreview: !subscription,
          },
        },
        updatedAt: new Date(),
      },
    });

    return c.json({
      pdfBase64: result.pdfBuffer.toString("base64"),
      pdfSignedUrl: signedUrlData.signedUrl,
      pageCount: result.metadata.pageCount,
      fileSize: result.metadata.fileSize,
      projectId: project.id,
      isPreview: !subscription,
    });
  } catch (error) {
    console.error("Storybook generation failed:", error);
    return c.json(
      { error: "Failed to generate storybook", message: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
};
