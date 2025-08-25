import sharp from "sharp";
import { createCanvas } from "canvas";
import * as pdfjsLib from "../../../tools/pdfjs-dist/legacy/build/pdf.mjs";

export class PreviewGenerator {
  private supabase: any;

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }
  async generateWebPPreviews(
    pdfBuffer: Buffer,
    options: {
      quality?: number;
      width?: number;
      generateBlurred?: boolean;
    } = {}
  ): Promise<{ clear: string[]; blurred?: string[] }> {
    const { quality = 80, width = 800, generateBlurred = true } = options;

    try {
      const pageImages = await this.convertPDFToImages(pdfBuffer);

      const clearPreviews: string[] = [];
      const blurredPreviews: string[] = [];

      for (let i = 0; i < pageImages.length; i++) {
        const clearWebP = await sharp(pageImages[i])
          .resize(width, null, { withoutEnlargement: true, fit: "inside" })
          .webp({ quality })
          .toBuffer();

        const { signedUrl: clearUrl } = await this.uploadPrivateToSupabase(
          clearWebP,
          `page-${i + 1}.webp`
        );
        clearPreviews.push(clearUrl);

        if (generateBlurred) {
          const blurredWebP = await sharp(pageImages[i])
            .resize(width, null, { withoutEnlargement: true, fit: "inside" })
            .blur(10)
            .webp({ quality: 60 })
            .toBuffer();

          const { signedUrl: blurredUrl } = await this.uploadPrivateToSupabase(
            blurredWebP,
            `page-${i + 1}-blur.webp`
          );
          blurredPreviews.push(blurredUrl);
        }
      }

      return { clear: clearPreviews, blurred: generateBlurred ? blurredPreviews : undefined };
    } catch (err) {
      console.error("Error generating previews:", err);
      throw err;
    }
  }

  async generateFirstPageWebPPreview(
    pdfBuffer: Buffer,
    projectId: string,
    options: {
      quality?: number;
      width?: number;
    } = {}
  ): Promise<{ signedUrl: string; filePath: string }> {
    const { quality = 80, width = 800 } = options;

    try {
      const pageImages = await this.convertPDFToImages(pdfBuffer, 1);
      if (pageImages.length === 0) {
        throw new Error("Could not convert the first page of the PDF to an image.");
      }

      const webPBuffer = await sharp(pageImages[0])
        .resize(width, null, { withoutEnlargement: true, fit: "inside" })
        .webp({ quality })
        .toBuffer();

      const fileName = `first-page-preview-${Date.now()}.webp`;
      const filePath = `projects/${projectId}/${fileName}`;

      const { signedUrl } = await this.uploadPrivateToSupabase(
        webPBuffer,
        filePath
      );
      
      return { signedUrl, filePath };

    } catch (error) {
      console.error(`Failed to generate first page WebP preview for project ${projectId}:`, error);
      throw new Error(
        `First page preview generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private async convertPDFToImages(pdfBuffer: Buffer, pageNumber?: number): Promise<Buffer[]> {
    try {
      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(pdfBuffer),
        useSystemFonts: true,
      }).promise;

      const images: Buffer[] = [];
      const startPage = pageNumber || 1;
      const endPage = pageNumber ? pageNumber : pdf.numPages;

      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
        if (pageNum > pdf.numPages) break;

        try {
          const page = await pdf.getPage(pageNum);
          const scale = 2.0;
          const viewport = page.getViewport({ scale });

          const canvas = createCanvas(viewport.width, viewport.height);
          const ctx = canvas.getContext("2d");

          const renderContext = {
            canvasContext: ctx as any,
            viewport,
            canvas: canvas as any,
          };

          await page.render(renderContext).promise;

          const imageBuffer = canvas.toBuffer("image/png");
          images.push(imageBuffer);
        } catch (pageError) {
          console.error(`Failed to render page ${pageNum}:`, pageError);

          const canvas = createCanvas(800, 1000);
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, 800, 1000);
          ctx.fillStyle = "#f00";
          ctx.font = "24px Arial";
          ctx.textAlign = "center";
          ctx.fillText(`Error loading page ${pageNum}`, 400, 500);

          images.push(canvas.toBuffer("image/png"));
        }
      }

      return images;
    } catch (error) {
      console.error("PDF to image conversion failed:", error);

      const canvas = createCanvas(800, 1000);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 800, 1000);
      ctx.fillStyle = "#f00";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("PDF conversion failed", 400, 450);
      ctx.fillText("Please try again", 400, 500);

      return [canvas.toBuffer("image/png")];
    }
  }

  private async uploadToSupabase(
    imageBuffer: Buffer,
    fileName: string,
    type: "clear" | "blurred"
  ): Promise<string> {
    const timestamp = Date.now();
    const path = `previews/${type}/${timestamp}-${fileName}`;

    const { error } = await this.supabase.storage
      .from("storybook-previews")
      .upload(path, imageBuffer, {
        contentType: "image/webp",
        cacheControl: "3600",
      });

    if (error) throw error;

    const { data: urlData } = this.supabase.storage
      .from("storybook-previews")
      .getPublicUrl(path);

    return urlData.publicUrl;
  }
private async uploadPrivateToSupabase(
    imageBuffer: Buffer,
    filePath: string
  ): Promise<{ signedUrl: string; filePath: string }> {
    console.log("--- Supabase Upload Process Started ---");
    console.log(`[DEBUG] Attempting to upload to path: ${filePath}`);
    console.log(`[DEBUG] Buffer size: ${imageBuffer.length} bytes`);
    console.log(`[DEBUG] Bucket: storybook-previews`);

    try {
      const { error: uploadError } = await this.supabase.storage
        .from("storybook-previews")
        .upload(filePath, imageBuffer, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("--- Supabase Upload Failed! ---");
        console.error("[ERROR] uploadError:", uploadError);
         const typedError = uploadError as any; 

        if (typedError.originalError && typedError.originalError.text) {
          try {
            const responseBody = await typedError.originalError.text();
            console.error(`[ERROR] Supabase API Response Body: ${responseBody}`);
          } catch (textError) {
            console.error("[ERROR] Failed to read original error text:", textError);
          }
        }
        
        throw uploadError;
      }
      
      console.log("--- Supabase Upload Successful! ---");

      const { data: signedUrlData, error: signedUrlError } = await this.supabase.storage
        .from("storybook-previews")
        .createSignedUrl(filePath, 3600); 

      if (signedUrlError) {
        console.error("--- Signed URL Generation Failed! ---");
        console.error("[ERROR] signedUrlError:", signedUrlError);
        throw signedUrlError;
      }
      
      if (!signedUrlData || !signedUrlData.signedUrl) {
        console.error("--- Signed URL Generation Failed! ---");
        console.error("[ERROR] Supabase returned no data for signed URL.");
        throw new Error("Supabase did not return a signed URL after upload.");
      }
      
      console.log("--- Signed URL Generation Successful! ---");
      console.log(`[SUCCESS] Signed URL: ${signedUrlData.signedUrl.substring(0, 75)}...`);
      console.log("--- Supabase Upload Process Complete ---");

      return { signedUrl: signedUrlData.signedUrl, filePath };

    } catch (err) {
      console.error("--- Unexpected Error in uploadPrivateToSupabase ---");
      console.error("[ERROR] Caught exception:", err);
      throw err;
    }
  }
}