import sharp from "sharp";
import { createCanvas, loadImage, CanvasRenderingContext2D as NodeCanvasRenderingContext2D, Image } from "canvas";
import { supabase } from "../../supabase/client.js";

export class PreviewGenerator {
  /**
   * Generate WebP previews from PDF pages
   */
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
      // TODO: Convert PDF pages to images
      // This would require pdf2pic or similar library
      // For now, we'll create placeholder previews
      const pageImages = await this.convertPDFToImages(pdfBuffer);
      
      const clearPreviews: string[] = [];
      const blurredPreviews: string[] = [];

      for (let i = 0; i < pageImages.length; i++) {
        // Generate clear WebP preview
        const clearWebP = await sharp(pageImages[i])
          .resize(width, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality })
          .toBuffer();

        const clearUrl = await this.uploadToSupabase(
          clearWebP,
          `page-${i + 1}.webp`,
          'clear'
        );
        clearPreviews.push(clearUrl);

        // Generate blurred preview if requested
        if (generateBlurred) {
          const blurredWebP = await sharp(pageImages[i])
            .resize(width, null, { 
              withoutEnlargement: true,
              fit: 'inside'
            })
            .blur(10)
            .webp({ quality: 60 })
            .toBuffer();

          const blurredUrl = await this.uploadToSupabase(
            blurredWebP,
            `page-${i + 1}-blur.webp`,
            'blurred'
          );
          blurredPreviews.push(blurredUrl);
        }
      }

      return {
        clear: clearPreviews,
        blurred: generateBlurred ? blurredPreviews : undefined,
      };
    } catch (error) {
      console.error("Preview generation failed:", error);
      throw new Error(`Preview generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate canvas-based page previews for immediate display
   */
  async generateCanvasPreviews(
    pages: Array<{ text?: string; imagePath?: string }>,
    options: {
      width?: number;
      height?: number;
      backgroundColor?: string;
    } = {}
  ): Promise<Buffer[]> {
    const { 
      width = 800, 
      height = 1000, 
      backgroundColor = '#ffffff' 
    } = options;

    const previews: Buffer[] = [];

    for (const page of pages) {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Set background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      if (page.text) {
        await this.renderTextPreview(ctx, page.text, width, height);
      } else if (page.imagePath) {
        await this.renderImagePreview(ctx, page.imagePath, width, height);
      }

      // Convert canvas to WebP buffer
      const webpBuffer = await sharp(canvas.toBuffer('image/png'))
        .webp({ quality: 85 })
        .toBuffer();

      previews.push(webpBuffer);
    }

    return previews;
  }

  /**
   * Render text content on canvas for preview
   */
  private async renderTextPreview(
    ctx: NodeCanvasRenderingContext2D,
    text: string,
    canvasWidth: number,
    canvasHeight: number
  ): Promise<void> {
    const fontSize = 24;
    const lineHeight = fontSize * 1.4;
    const margin = 40;
    const maxWidth = canvasWidth - margin * 2;

    ctx.fillStyle = '#000000';
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Simple text wrapping
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    // Calculate starting Y position for vertical centering
    const totalHeight = lines.length * lineHeight;
    let y = (canvasHeight - totalHeight) / 2 + fontSize / 2;

    // Draw each line
    for (const line of lines) {
      ctx.fillText(line, canvasWidth / 2, y);
      y += lineHeight;
    }
  }

  /**
   * Render image content on canvas for preview
   */
  private async renderImagePreview(
    ctx: NodeCanvasRenderingContext2D,
    imagePath: string,
    canvasWidth: number,
    canvasHeight: number
  ): Promise<void> {
    try {
      const image = await loadImage(imagePath) as Image;
      
      // Calculate dimensions to fit image within canvas
      const scale = Math.min(
        canvasWidth / image.width,
        canvasHeight / image.height
      );
      
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      
      const x = (canvasWidth - scaledWidth) / 2;
      const y = (canvasHeight - scaledHeight) / 2;

      ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    } catch (error) {
      console.error(`Failed to load image for preview: ${error}`);
      
      // Draw error placeholder
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(50, 50, canvasWidth - 100, canvasHeight - 100);
      
      ctx.fillStyle = '#666666';
      ctx.font = '20px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Image not available', canvasWidth / 2, canvasHeight / 2);
    }
  }

  /**
   * Convert PDF buffer to image buffers (placeholder implementation)
   */
  private async convertPDFToImages(pdfBuffer: Buffer): Promise<Buffer[]> {
    // TODO: Implement actual PDF to image conversion
    // This would require pdf2pic, pdf-poppler, or similar library
    
    // For now, return placeholder images
    const placeholderCount = 3; // Assume 3 pages
    const placeholders: Buffer[] = [];

    for (let i = 0; i < placeholderCount; i++) {
      const canvas = createCanvas(800, 1000);
      const ctx = canvas.getContext('2d');
      
      // Create placeholder page
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 1000);
      
      ctx.fillStyle = '#000000';
      ctx.font = '24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Page ${i + 1}`, 400, 500);
      
      const buffer = canvas.toBuffer('image/png');
      placeholders.push(buffer);
    }

    return placeholders;
  }

  /**
   * Upload preview image to Supabase storage
   */
  private async uploadToSupabase(
    imageBuffer: Buffer,
    fileName: string,
    type: 'clear' | 'blurred'
  ): Promise<string> {
    try {
      const timestamp = Date.now();
      const path = `previews/${type}/${timestamp}-${fileName}`;

      const { data, error } = await supabase.storage
        .from('storybook-previews')
        .upload(path, imageBuffer, {
          contentType: 'image/webp',
          cacheControl: '3600',
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('storybook-previews')
        .getPublicUrl(path);

      return urlData.publicUrl;
    } catch (error) {
      console.error(`Failed to upload preview to Supabase: ${error}`);
      throw error;
    }
  }

  /**
   * Generate low-quality blurred variants for progressive loading
   */
  async generateBlurredVariants(
    imageBuffers: Buffer[],
    options: {
      blur?: number;
      quality?: number;
      width?: number;
    } = {}
  ): Promise<Buffer[]> {
    const { blur = 10, quality = 30, width = 200 } = options;

    const blurredVariants: Buffer[] = [];

    for (const buffer of imageBuffers) {
      const blurred = await sharp(buffer)
        .resize(width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .blur(blur)
        .webp({ quality })
        .toBuffer();

      blurredVariants.push(blurred);
    }

    return blurredVariants;
  }
}