// src/routes/payment/one-time-fulfillment.ts
import { prisma } from "../../db/index.js";
import { createClient } from "@supabase/supabase-js";
import { EnhancedPDFGenerator } from "../../services/pdf/index.js";
import { PDFPageGenerator } from "../../services/pdf/generatePdfPages.js";
import fetch from "node-fetch"; // You might need to install node-fetch if not already present
import * as fs from "fs"; // Used for fs.unlinkSync in PDFPageGenerator, ensure it's available

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Handles the fulfillment of a one-time purchase: appends to the PDF,
 * generates the final version, stores it, and updates project status.
 * @param projectId The ID of the project to fulfill.
 * @returns A signed URL for the final PDF.
 */
export async function handleOneTimePurchaseFulfillment(projectId: string, userId: string): Promise<string> {
  console.log(`Starting fulfillment for projectId: ${projectId} by userId: ${userId}`);

  // 1. Fetch project and user/template data
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
  });

  if (!project) {
    throw new Error("Project not found during fulfillment.");
  }
  if (project.user.id !== userId) {
      throw new Error("Unauthorized access to project fulfillment.");
  }

  const storyTemplateID: string = project.template.id;
  const storyTemplate = await prisma.storyTemplate.findUnique({
    where: { id: storyTemplateID },
    select: { layoutJson: true, title: true },
  });
  if (!storyTemplate) {
    throw new Error("Story template not found during fulfillment.");
  }

  // 2. Check if the final PDF already exists to prevent re-generation
  const finalPdfFileName = `projects/${project.id}/finalstorybook.pdf`;
  const { data: existingFinalPdfData, error: existingFinalPdfError } = await supabase.storage
    .from("storybook-finals")
    .createSignedUrl(finalPdfFileName, 60 * 60);

  if (!existingFinalPdfError && existingFinalPdfData?.signedUrl) {
    console.log(`Final PDF already exists for project ${projectId}. Returning existing URL.`);
    // If it already exists, just return the signed URL
    return existingFinalPdfData.signedUrl;
  }

  // 3. Download the existing preview PDF
  // You need to parse the generatedPages JSON to get the pdfPath
  const generatedPagesMetadata = project.generatedPages as any; // Cast to 'any' for easier access
  const previewPdfPath = generatedPagesMetadata?.pdfMetadata?.pdfPath;

  if (!previewPdfPath) {
    throw new Error("Preview PDF path not found for project.");
  }

  const { data: previewSignedData, error: previewSignedError } = await supabase.storage
    .from("storybook-pdfs") // This is where previews are stored
    .createSignedUrl(previewPdfPath, 60 * 60);

  if (previewSignedError || !previewSignedData?.signedUrl) {
    throw new Error(`Failed to get signed URL for preview PDF: ${previewSignedError?.message}`);
  }

  const response = await fetch(previewSignedData.signedUrl);
  if (!response.ok) {
    throw new Error(`Failed to download existing preview PDF: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const existingPdfBuffer = Buffer.from(arrayBuffer);

  // 4. Generate the remaining pages and append to the existing PDF
  // Assuming the `isPreview` logic creates the first 3 pages,
  // we start generating from page 4 (index 3)
  const pdfPageGenerator = new PDFPageGenerator(
    storyTemplate,
    true, // subscription is effectively true for full generation
    project.id,
    undefined // No new frontend images for appending
  );

  // You need to know how many preview pages were generated initially
  // Let's assume 3 pages were generated for preview (pages 1, 2, 3).
  // The next page to generate will be the 4th page (index 3 in a 0-indexed array).
  // The `startingPage` in `generatePages` needs to match the slice.
  const previewPageCount = (project.generatedPages as any)?.pdfMetadata?.pageCount || 3;
  const { layout, pages } = await pdfPageGenerator.generatePages(previewPageCount); // Pass the number of pages already generated

  const pdfGenerator = new EnhancedPDFGenerator();
  const result = await pdfGenerator.generatePDF(layout, pages, {
    append: true,
    existingPdfBuffer: existingPdfBuffer,
    outputFormat: "print",
    generatePreviews: false,
    uploadToStorage: false,
  });

  // 5. Upload the final PDF to Supabase
  const { error: pdfUploadError } = await supabase.storage
    .from("storybook-finals") // Store final PDFs in a separate bucket
    .upload(finalPdfFileName, result.pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (pdfUploadError) {
    throw new Error(`Failed to store final PDF: ${pdfUploadError.message}`);
  }

  // 6. Update project status in your database
  await prisma.project.update({
    where: { id: project.id },
    data: {
      status: "PURCHASED", // Mark as completed
      generatedPages: {
        ...(project.generatedPages || {} as any), // Preserve existing metadata
        pdfMetadata: {
          ...(generatedPagesMetadata?.pdfMetadata || {}),
          pdfPath: finalPdfFileName, // Update to the final PDF path
          pageCount: result.metadata.pageCount,
          fileSize: result.metadata.fileSize,
          generatedAt: new Date().toISOString(),
          isPreview: false, // It's no longer a preview
        }
      },
      updatedAt: new Date(),
    },
  });

  // 7. Get signed URL for the final PDF
  const { data: finalPdfSignedData, error: finalPdfSignedError } =
    await supabase.storage
      .from("storybook-finals")
      .createSignedUrl(finalPdfFileName, 60 * 60);

  if (finalPdfSignedError || !finalPdfSignedData?.signedUrl) {
    throw new Error(`Failed to generate final PDF download link: ${finalPdfSignedError?.message}`);
  }

  console.log(`Fulfillment for projectId: ${projectId} completed. Final PDF URL generated.`);
  return finalPdfSignedData.signedUrl;
}