"use strict";

import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import { prisma } from "../db/index.js";
import fs from "node:fs";
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
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              images: {
                type: "array",
                items: { type: "string", format: "binary" }, // files
              },
            },
            required: ["images"],
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
    const files = await c.req.formData();
    const images = files.getAll("images") as File[];

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
        currentPeriodEnd: { gt: new Date() },
      },
    });

    // Check if the user is subscribed and has quota available
    const isSubscribedAndHasQuota = subscription && subscription.digitalBooksUsed < subscription.digitalBookQuota;
    
    // Determine if this is a preview generation
    const isPreview = !isSubscribedAndHasQuota;

    // If subscribed but quota is used up, return an error immediately
    if (subscription && !isSubscribedAndHasQuota) {
      return c.json({ error: "Subscription quota exceeded. Please upgrade your plan." }, 403);
    }
    
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

    // --- Use PDFPageGenerator with uploaded frontend images ---
    const pdfPageGenerator = new PDFPageGenerator(
      storyTemplate,
      !isPreview,
      project.id,
      images
    );

    const { layout, pages } = await pdfPageGenerator.generatePages();

    // --- Generate PDF ---
    const pdfGenerator = new EnhancedPDFGenerator();
    const result = await pdfGenerator.generatePDF(layout, pages, {
      outputFormat: "print",
      generatePreviews: false,
      uploadToStorage: false,
    });

    // --- Clean up local image files if any ---
    pages.forEach((page) => {
      if (page.imagePath) {
        try { fs.unlinkSync(page.imagePath); } catch {}
      }
    });

    // --- Upload PDF to Supabase ---
    const pdfFileName = `projects/${project.id}/storybook.pdf`;
    const { error: pdfUploadError } = await supabase.storage
      .from("storybook-pdfs")
      .upload(pdfFileName, result.pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });
    if (pdfUploadError) return c.json({ error: "Failed to store PDF" }, 500);

    const { data: pdfSignedData, error: pdfSignedError } =
      await supabase.storage
        .from("storybook-pdfs")
        .createSignedUrl(pdfFileName, 60 * 60);
    if (pdfSignedError)
      return c.json({ error: "Failed to generate download link" }, 500);

    // --- Fetch signed URLs for all images in case some already existed ---
    const uploadedImages = await prisma.uploadedImage.findMany({
      where: { projectId: project.id },
      select: { imageUrl: true },
    });

    const imageUrls: string[] = [];
    for (const img of uploadedImages) {
      const { data, error } = await supabase.storage
        .from("storybook-images")
        .createSignedUrl(img.imageUrl, 60 * 60);
      if (!error && data?.signedUrl) imageUrls.push(data.signedUrl);
    }

    // Update project metadata
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
            isPreview: isPreview,
          },
        },
        updatedAt: new Date(),
      },
    });

    // Increment quota only if a full book was generated
    if (!isPreview) {
      await prisma.project.update({
        where: {id: project.id},
        data: {
          status: "COMPLETED"
        }
      })
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          digitalBooksUsed: {
            increment: 1,
          },
        },
      });
    }

    return c.json({
      pdfBase64: result.pdfBuffer.toString("base64"),
      pdfSignedUrl: pdfSignedData.signedUrl,
      imageUrls,
      pageCount: result.metadata.pageCount,
      fileSize: result.metadata.fileSize,
      projectId: project.id,
      isPreview: isPreview,
    });
  } catch (error) {
    console.error("Storybook generation failed:", error);
    return c.json(
      {
        error: "Failed to generate storybook",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
};