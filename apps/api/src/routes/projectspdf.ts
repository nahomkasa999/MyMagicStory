// src/routes/project/pdf.ts
import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import { prisma } from "../db/index.js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const paramsSchema = z.object({
  projectId: z.string(),
});

export const getProjectPdfRoute = createRoute({
  method: "get",
  path: "/project/:projectId/pdf",
  tags: ["Project"],
  request: {
    params: paramsSchema,
  },
  responses: {
    200: { description: "Returns the signed URL for a project's PDF." },
    401: { description: "User not authenticated." },
    404: { description: "Project or PDF not found." },
    500: { description: "Internal server error." },
  },
});

export const getProjectPdfHandler = async (c: Context) => {
    console.log("hey")
  const { projectId } = paramsSchema.parse({
    projectId: c.req.param("projectId"),
  });
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "User not authenticated" }, 401);
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: user.id },
      select: {
        status: true,
        generatedPages: true,
      },
    });

    if (!project) {
      return c.json({ error: "Project not found or unauthorized access" }, 404);
    }

    if (!["DRAFT", "COMPLETED", "PURCHASED"].includes(project.status)) {
      return c.json({ error: "PDF not available for viewing yet" }, 404);
    }

    const generatedPages = project.generatedPages as any;
    const finalPdfPath = generatedPages?.pdfMetadata?.pdfPath;

    if (!finalPdfPath) {
      return c.json({ error: "PDF path not found in project metadata" }, 404);
    }

    let bucket = "";
    if (project.status === "DRAFT") {
      bucket = "storybook-pdfs";
    } else {
      bucket = "storybook-finals";
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from(bucket)
        .createSignedUrl(finalPdfPath, 60 * 60);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Failed to generate signed URL:", signedUrlError?.message);
      return c.json({ error: "Failed to generate PDF link" }, 500);
    }

    return c.json({
      success: true,
      downloadUrl: signedUrlData.signedUrl,
      isPreview: project.status === "DRAFT",
    });
  } catch (error: any) {
    console.error("Failed to get project PDF:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
