import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import { writeFile } from "fs/promises";
import Replicate from "replicate";
import * as fs from "node:fs";
import { z } from "zod";
import { prisma } from "../db/index.js";
import fetch from "node-fetch";
import pMap from "p-map";
import {
  EnhancedPDFGenerator,
  PreviewGenerator,
  layoutJsonSchema,
} from "../services/pdf/index.js";
import type { PageRenderData } from "../services/pdf/index.js";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// Legacy schema for backward compatibility
const legacyTextPageSchema = z.object({
  type: z.literal("text"),
  content: z.string(),
  linkToPrevious: z.boolean(),
});
const legacyImagePageSchema = z.object({
  type: z.literal("image"),
  content: z.string().optional(),
  linkToPrevious: z.boolean(),
});
const legacyLayoutJsonSchema = z.object({
  title: z.string(),
  pages: z.array(z.union([legacyTextPageSchema, legacyImagePageSchema])),
});

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
              imageUrls: {
                type: "array",
                items: { type: "string", format: "uri" },
              },
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
      where: {
        userId: user.id,
        status: "ACTIVE",
        currentPeriodEnd: { gt: new Date() },
      },
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

    let layout;
    try {
      layout = layoutJsonSchema.parse(storyTemplate.layoutJson);
    } catch {
      const legacyLayout = legacyLayoutJsonSchema.parse(
        storyTemplate.layoutJson
      );
      layout = {
        title: legacyLayout.title,
        subtitle: undefined,
        pages: legacyLayout.pages.map((page) =>
          page.type === "text"
            ? {
                type: "text" as const,
                content: page.content,
                linkToPrevious: page.linkToPrevious,
                style: {
                  fontSize: 18,
                  fontFamily: "Helvetica",
                  color: "#000000",
                  alignment: "center" as const,
                  margin: { top: 50, bottom: 50, left: 50, right: 50 },
                },
              }
            : {
                type: "image" as const,
                content: page.content,
                linkToPrevious: page.linkToPrevious,
                style: {
                  fit: "cover" as const,
                  position: { x: 0, y: 0 },
                  size: {},
                },
              }
        ),
        settings: {
          pageSize: { width: 595.28, height: 841.89 },
          bleed: 9,
          colorProfile: "CMYK" as const,
          resolution: 300,
        },
      };
    }

    let pagesToRender = layout.pages;
    const isSubscribed = !!subscription;
    if (!isSubscribed) pagesToRender = pagesToRender.slice(0, 3);

    const allPagesForPdf: PageRenderData[] = [];
    const imagePages = pagesToRender
      .map((page, idx) => ({ page, idx }))
      .filter((p) => p.page.type === "image" && p.page.content);

    const imageResults = await pMap(
      imagePages,
      async ({ page, idx }, i) => {
        try {
          const input = {
            prompt: page.content,
            style_reference_images: imageUrls,
            output_format: "png",
            aspect_ratio: "3:4",
          };
          // const output = await replicate.run("ideogram-ai/ideogram-v3-turbo", { input });
          const output = "stirng";
          const imageUrl = Array.isArray(output) ? output[0] : output;
          const res = await fetch(imageUrl);
          const imgBuffer = Buffer.from(await res.arrayBuffer());
          const filename = `photo_gen_${idx}.png`;
          await writeFile(filename, imgBuffer);

          return { imagePath: filename, style: page.style, idx };
        } catch (error) {
          // console.error(`Failed to generate image for page ${idx}:`, error);
          console.error("Failed to generate image for ");
          return {
            text: "Image generation failed",
            style: {
              fontSize: 18,
              fontFamily: "Helvetica",
              color: "#666666",
              alignment: "center" as const,
              margin: { top: 50, bottom: 50, left: 50, right: 50 },
            },
            idx,
          };
        }
      },
      { concurrency: 5 }
    );

    let imageCounter = 0;
    for (const page of pagesToRender) {
      if (page.type === "text")
        allPagesForPdf.push({ text: page.content, style: page.style });
      else if (page.type === "image") {
        allPagesForPdf.push(imageResults[imageCounter]);
        imageCounter++;
      }
    }

    const pdfGenerator = new EnhancedPDFGenerator();
    const result = await pdfGenerator.generatePDF(
      { ...layout, pages: pagesToRender },
      allPagesForPdf,
      { outputFormat: "print", generatePreviews: false, uploadToStorage: false }
    );

    for (let i = 0; i < imageCounter; i++) {
      try {
        fs.unlinkSync(`photo_gen_${i}.png`);
      } catch (error) {
        // console.warn(`Failed to clean up temporary file photo_gen_${i}.png:`, error);
        console.log("Failed to clean up");
      }
    }

    await prisma.project.update({
      where: { id: project.id },
      data: {
        status: "COMPLETED",
        generatedPages: {
          pdfMetadata: {
            pageCount: result.metadata.pageCount,
            fileSize: result.metadata.fileSize,
            dimensions: result.metadata.dimensions,
            generatedAt: new Date().toISOString(),
            isPreview: !isSubscribed,
          },
        },
        updatedAt: new Date(),
      },
    });
    return c.json({
      pdfBase64: result.pdfBuffer.toString("base64"),
      pageCount: result.metadata.pageCount,
      fileSize: result.metadata.fileSize,
      projectId: project.id,
      isPreview: !isSubscribed,
    });
  } catch (error) {
    console.error("Storybook generation failed:", error);
    if (error instanceof z.ZodError) {
      return c.json(
        { error: "Invalid template layout format", details: error.issues },
        400
      );
    }
    return c.json(
      {
        error: "Failed to generate storybook",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
};
