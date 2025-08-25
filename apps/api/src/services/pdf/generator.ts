import {
  PDFDocument,
  StandardFonts,
  rgb,
  cmyk,
  PDFFont,
  PDFPage,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import sharp from "sharp";
import { createCanvas, loadImage, CanvasRenderingContext2D } from "canvas";
import * as fs from "node:fs";

type LayoutJSON = any;
type PageRenderData = any;

type PDFGenerationOptions = {
  outputFormat: "print" | "screen";
  generatePreviews: boolean;
  generateFirstPagePreview?: boolean;
  uploadToStorage?: boolean;
  append?: boolean;
  existingPdfBuffer?: Buffer;
  projectId?: string;
};

type PDFGenerationResult = {
  pdfBuffer: Buffer;
  metadata: {
    pageCount: number;
    fileSize: number;
    dimensions: {
      width: number;
      height: number;
    };
  };
  previewUrls?: string[];
  firstPagePreviewUrl?: string;
  firstPagePreviewPath?: string;
};

export class EnhancedPDFGenerator {
  private pdfDoc: PDFDocument | null = null;
  private fonts: Map<string, PDFFont> = new Map();
  private supabase: any;

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }
  async generatePDF(
    layout: LayoutJSON,
    pages: PageRenderData[],
    options: PDFGenerationOptions = {
      outputFormat: "print",
      generatePreviews: false,
      generateFirstPagePreview: false,
      uploadToStorage: false, 
    }
  ): Promise<PDFGenerationResult> {
    try {
      if (options.append && options.existingPdfBuffer) {
        this.pdfDoc = await PDFDocument.load(options.existingPdfBuffer);
      } else {
        this.pdfDoc = await PDFDocument.create();
      }
      this.pdfDoc.registerFontkit(fontkit);
      await this.loadFonts();

      if (!(options.append && options.existingPdfBuffer)) {
        await this.generateCoverPage(layout);
      }

      for (let i = 0; i < pages.length; i++) {
        await this.generateContentPage(pages[i], layout, i);
      }

      const pdfBuffer = Buffer.from(await this.pdfDoc.save());

      const processedPdfBuffer =
        options.outputFormat === "print"
          ? await this.convertToCMYK(pdfBuffer)
          : pdfBuffer;

      const result: PDFGenerationResult = {
        pdfBuffer: processedPdfBuffer,
        metadata: {
          pageCount: pages.length + 1,
          fileSize: processedPdfBuffer.length,
          dimensions: {
            width: layout.settings.pageSize.width,
            height: layout.settings.pageSize.height,
          },
        },
      };

      if (options.generatePreviews) {
        const { PreviewGenerator } = await import("./preview.js");
        const previewGenerator = new PreviewGenerator(this.supabase);
        const previews = await previewGenerator.generateWebPPreviews(processedPdfBuffer);
        result.previewUrls = previews.clear;
      }

      if (options.generateFirstPagePreview && options.projectId) {
        try {
          const { PreviewGenerator } = await import("./preview.js");
          const previewGenerator = new PreviewGenerator(this.supabase);
          const { signedUrl, filePath } = await previewGenerator.generateFirstPageWebPPreview(
            processedPdfBuffer,
            options.projectId,
            { quality: 75, width: 400 }
          );
          result.firstPagePreviewUrl = signedUrl;
          result.firstPagePreviewPath = filePath;
        } catch (error) {
          console.error("Failed to generate first page preview within EnhancedPDFGenerator:", error);
        }
      }

      return result;
    } catch (error) {
      console.error("PDF generation failed:", error);
      throw new Error(
        `PDF generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private async loadFonts(): Promise<void> {
    if (!this.pdfDoc) throw new Error("PDF document not initialized");

    const helvetica = await this.pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await this.pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );
    const timesRoman = await this.pdfDoc.embedFont(StandardFonts.TimesRoman);

    this.fonts.set("Helvetica", helvetica);
    this.fonts.set("Helvetica-Bold", helveticaBold);
    this.fonts.set("Times-Roman", timesRoman);
  }

  private async generateCoverPage(layout: LayoutJSON): Promise<void> {
    if (!this.pdfDoc) throw new Error("PDF document not initialized");

    const page = this.pdfDoc.addPage([
      layout.settings.pageSize.width,
      layout.settings.pageSize.height,
    ]);

    const font =
      this.fonts.get("Helvetica-Bold") || this.fonts.get("Helvetica")!;
    const titleFontSize = 40;
    const subtitleFontSize = 20;

    const titleWidth = font.widthOfTextAtSize(layout.title, titleFontSize);
    page.drawText(layout.title, {
      x: (page.getWidth() - titleWidth) / 2,
      y: page.getHeight() / 2 + 50,
      size: titleFontSize,
      font,
      color:
        layout.settings.colorProfile === "CMYK"
          ? cmyk(0, 0, 0, 1)
          : rgb(0, 0, 0),
    });

    if (layout.subtitle) {
      const subtitleWidth = font.widthOfTextAtSize(
        layout.subtitle,
        subtitleFontSize
      );
      page.drawText(layout.subtitle, {
        x: (page.getWidth() - subtitleWidth) / 2,
        y: page.getHeight() / 2,
        size: subtitleFontSize,
        font,
        color:
          layout.settings.colorProfile === "CMYK"
            ? cmyk(0, 0, 0, 0.7)
            : rgb(0.3, 0.3, 0.3),
      });
    }
  }

  private async generateContentPage(
    pageData: PageRenderData,
    layout: LayoutJSON,
    pageIndex: number
  ): Promise<void> {
    if (!this.pdfDoc) throw new Error("PDF document not initialized");

    const page = this.pdfDoc.addPage([
      layout.settings.pageSize.width,
      layout.settings.pageSize.height,
    ]);

    if (pageData.text) {
      await this.renderTextPage(page, pageData, layout);
    } else if (pageData.imagePath) {
      await this.renderImagePage(page, pageData, layout);
    }
  }

  private async renderTextPage(
    page: PDFPage,
    pageData: PageRenderData,
    layout: LayoutJSON
  ): Promise<void> {
    if (!pageData.text || !pageData.style) return;

    const style = pageData.style as any;
    const font =
      this.fonts.get(style.fontFamily) || this.fonts.get("Helvetica")!;
    const fontSize = style.fontSize || 18;
    const margin = style.margin || { top: 50, bottom: 50, left: 50, right: 50 };

    const textWidth = page.getWidth() - margin.left - margin.right;
    const textHeight = page.getHeight() - margin.top - margin.bottom;

    const lines = this.wrapText(pageData.text, textWidth, font, fontSize);

    const totalTextHeight = lines.length * (fontSize + 4);
    let y = page.getHeight() - margin.top - (textHeight - totalTextHeight) / 2;

    for (const line of lines) {
      let x: number;

      switch (style.alignment) {
        case "left":
          x = margin.left;
          break;
        case "right":
          x =
            page.getWidth() -
            margin.right -
            font.widthOfTextAtSize(line, fontSize);
          break;
        case "center":
        default:
          x = (page.getWidth() - font.widthOfTextAtSize(line, fontSize)) / 2;
          break;
      }

      page.drawText(line, {
        x,
        y,
        size: fontSize,
        font,
        color:
          layout.settings.colorProfile === "CMYK"
            ? cmyk(0, 0, 0, 1)
            : rgb(0, 0, 0),
      });

      y -= fontSize + 4;
    }
  }

  private async renderImagePage(
    page: PDFPage,
    pageData: PageRenderData,
    layout: LayoutJSON
  ): Promise<void> {
    if (!pageData.imagePath) return;

    try {
      const processedImageBuffer = await this.processImageForPDF(
        pageData.imagePath,
        {
          width: page.getWidth(),
          height: page.getHeight(),
          colorProfile: layout.settings.colorProfile,
          resolution: layout.settings.resolution,
        }
      );

      const image = await this.pdfDoc!.embedPng(processedImageBuffer);

      const { width, height } = this.calculateImageDimensions(
        image.width,
        image.height,
        page.getWidth(),
        page.getHeight(),
        pageData.style as any
      );

      page.drawImage(image, {
        x: (page.getWidth() - width) / 2,
        y: (page.getHeight() - height) / 2,
        width,
        height,
      });
    } catch (error) {
      console.error(`Failed to render image page: ${error}`);
      const font = this.fonts.get("Helvetica")!;
      page.drawText("Image could not be loaded", {
        x: 50,
        y: page.getHeight() / 2,
        size: 18,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }
  }

  private async processImageForPDF(
    imagePath: string,
    options: {
      width: number;
      height: number;
      colorProfile: "RGB" | "CMYK";
      resolution: number;
    }
  ): Promise<Buffer> {
    const imageBuffer = fs.readFileSync(imagePath);

    let sharpImage = sharp(imageBuffer)
      .resize(
        Math.round((options.width * options.resolution) / 72),
        Math.round((options.height * options.resolution) / 72),
        { fit: "inside", withoutEnlargement: false }
      )
      .png({ quality: 100 });

    if (options.colorProfile === "CMYK") {
      sharpImage = sharpImage.png({ quality: 100 });
    }

    return await sharpImage.toBuffer();
  }

  private calculateImageDimensions(
    imageWidth: number,
    imageHeight: number,
    pageWidth: number,
    pageHeight: number,
    style: any
  ): { width: number; height: number } {
    const fit = style?.fit || "cover";
    const margin = 20;

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    switch (fit) {
      case "fill":
        return { width: availableWidth, height: availableHeight };

      case "contain":
        const scaleContain = Math.min(
          availableWidth / imageWidth,
          availableHeight / imageHeight
        );
        return {
          width: imageWidth * scaleContain,
          height: imageHeight * scaleContain,
        };

      case "cover":
      default:
        const scaleCover = Math.max(
          availableWidth / imageWidth,
          availableHeight / imageHeight
        );
        return {
          width: Math.min(imageWidth * scaleCover, availableWidth),
          height: Math.min(imageHeight * scaleCover, availableHeight),
        };
    }
  }

  private async convertToCMYK(pdfBuffer: Buffer): Promise<Buffer> {
    return pdfBuffer;
  }

  private async generateWebPPreviews(pdfBuffer: Buffer): Promise<string[]> {
    try {
      const { PreviewGenerator } = await import("./preview.js");
      const previewGenerator = new PreviewGenerator(this.supabase);

      const result = await previewGenerator.generateWebPPreviews(pdfBuffer, {
        quality: 80,
        width: 800,
        generateBlurred: false,
      });

      return result.clear;
    } catch (error) {
      console.error("Failed to generate WebP previews:", error);
      return [];
    }
  }

  private wrapText(
    text: string,
    maxWidth: number,
    font: PDFFont,
    fontSize: number
  ): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const lineWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (lineWidth <= maxWidth) {
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

    return lines;
  }
}