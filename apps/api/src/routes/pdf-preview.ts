import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import { z } from "zod";
import { prisma } from "../db/index.js";
import { PreviewGenerator, layoutJsonSchema } from "../services/pdf/index.js";

// Request schema for preview generation
const previewRequestSchema = z.object({
  storybookId: z.string().uuid(),
  options: z.object({
    quality: z.number().min(10).max(100).default(80),
    width: z.number().min(200).max(2000).default(800),
    generateBlurred: z.boolean().default(true),
  }).default(() => ({
    quality: 80,
    width: 800,
    generateBlurred: true,
  })),
});

// Response schema
const previewResponseSchema = z.object({
  success: z.boolean(),
  previews: z.object({
    clear: z.array(z.string().url()),
    blurred: z.array(z.string().url()).optional(),
  }),
  metadata: z.object({
    pageCount: z.number(),
    generatedAt: z.string().datetime(),
  }),
});

const previewErrorSchema = z.object({
  error: z.string(),
  details: z.any().optional(),
});

export const previewRoute = createRoute({
  method: "post",
  path: "/generate-previews",
  tags: ["PDF"],
  summary: "Generate WebP previews for a storybook",
  description: "Generate high-quality WebP previews and optional blurred variants for web display",
  request: {
    body: {
      content: {
        "application/json": {
          schema: previewRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Success response",
      content: {
        "application/json": {
          schema: z.union([previewResponseSchema, previewErrorSchema]),
        },
      },
    },
  },
});

export const previewHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { storybookId, options } = previewRequestSchema.parse(body);

    // Fetch project from database
    const project = await prisma.project.findUnique({
      where: { id: storybookId },
      include: {
        template: {
          select: { layoutJson: true },
        },
      },
    });

    if (!project) {
      return c.json({ error: "Project not found" }, 200);
    }

    // Parse layout
    const layout = layoutJsonSchema.parse(project.template.layoutJson);

    // Prepare page data for preview generation
    const pages = layout.pages.map(page => ({
      text: page.type === "text" ? page.content : undefined,
      imagePath: page.type === "image" ? undefined : undefined, // TODO: Get actual image paths
    }));

    // Generate previews
    const previewGenerator = new PreviewGenerator();
    const canvasPreviews = await previewGenerator.generateCanvasPreviews(pages, {
      width: options.width,
      height: Math.round(options.width * 1.25), // Approximate book page ratio
      backgroundColor: "#ffffff",
    });

    // Upload previews to storage and get URLs
    const previewUrls: string[] = [];
    const blurredUrls: string[] = [];

    for (let i = 0; i < canvasPreviews.length; i++) {
      // Upload clear preview
      const clearUrl = await uploadPreviewToStorage(
        canvasPreviews[i],
        `${storybookId}/page-${i + 1}.webp`,
        'clear'
      );
      previewUrls.push(clearUrl);

      // Generate and upload blurred preview if requested
      if (options.generateBlurred) {
        const blurredVariants = await previewGenerator.generateBlurredVariants(
          [canvasPreviews[i]],
          { blur: 10, quality: 60, width: 200 }
        );
        
        const blurredUrl = await uploadPreviewToStorage(
          blurredVariants[0],
          `${storybookId}/page-${i + 1}-blur.webp`,
          'blurred'
        );
        blurredUrls.push(blurredUrl);
      }
    }

    // Update project with preview URLs (store in generatedPages JSON for now)
    await prisma.project.update({
      where: { id: storybookId },
      data: {
        generatedPages: {
          previewUrls: previewUrls,
          blurredPreviewUrls: options.generateBlurred ? blurredUrls : undefined,
          generatedAt: new Date().toISOString(),
        },
        updatedAt: new Date(),
      },
    });

    return c.json({
      success: true,
      previews: {
        clear: previewUrls,
        blurred: options.generateBlurred ? blurredUrls : undefined,
      },
      metadata: {
        pageCount: pages.length,
        generatedAt: new Date().toISOString(),
      },
    }, 200);

  } catch (error) {
    console.error("Preview generation failed:", error);

    if (error instanceof z.ZodError) {
      return c.json({
        error: "Invalid request format",
        details: error.issues,
      }, 200);
    }

    return c.json({
      error: "Failed to generate previews",
      message: error instanceof Error ? error.message : "Unknown error",
    }, 200);
  }
};

/**
 * Upload preview image to storage (placeholder implementation)
 */
async function uploadPreviewToStorage(
  imageBuffer: Buffer,
  path: string,
  type: 'clear' | 'blurred'
): Promise<string> {
  // TODO: Implement actual upload to Supabase storage
  // For now, return a placeholder URL
  return `https://placeholder.com/previews/${type}/${path}`;
}

// Route for getting existing previews
export const getPreviewsRoute = createRoute({
  method: "get",
  path: "/previews/:storybookId",
  tags: ["PDF"],
  summary: "Get existing previews for a storybook",
  request: {
    params: z.object({
      storybookId: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: "Success response",
      content: {
        "application/json": {
          schema: z.union([
            z.object({
              success: z.boolean(),
              previews: z.object({
                clear: z.array(z.string().url()),
                blurred: z.array(z.string().url()).optional(),
              }),
              metadata: z.object({
                pageCount: z.number(),
                lastGenerated: z.string().datetime().optional(),
              }),
            }),
            previewErrorSchema
          ]),
        },
      },
    },
  },
});

export const getPreviewsHandler = async (c: Context) => {
  try {
    const { storybookId } = c.req.param();

    const project = await prisma.project.findUnique({
      where: { id: storybookId },
      select: {
        generatedPages: true,
        updatedAt: true,
      },
    });

    if (!project || !project.generatedPages) {
      return c.json({ error: "Previews not found" }, 200);
    }

    const generatedData = project.generatedPages as any;
    const previewUrls = generatedData.previewUrls;
    const blurredUrls = generatedData.blurredPreviewUrls;

    if (!previewUrls) {
      return c.json({ error: "Previews not found" }, 200);
    }

    return c.json({
      success: true,
      previews: {
        clear: previewUrls,
        blurred: blurredUrls || undefined,
      },
      metadata: {
        pageCount: previewUrls.length,
        lastGenerated: generatedData.generatedAt || project.updatedAt.toISOString(),
      },
    }, 200);

  } catch (error) {
    console.error("Failed to get previews:", error);
    return c.json({
      error: "Failed to retrieve previews",
      message: error instanceof Error ? error.message : "Unknown error",
    }, 200);
  }
};