import { z } from "zod";

// Enhanced layout schema with positioning and styling
export const textPageSchema = z.object({
  type: z.literal("text"),
  content: z.string(),
  linkToPrevious: z.boolean(),
  style: z.object({
    fontSize: z.number().default(18),
    fontFamily: z.string().default("Helvetica"),
    color: z.string().default("#000000"),
    alignment: z.enum(["left", "center", "right"]).default("center"),
    margin: z.object({
      top: z.number().default(50),
      bottom: z.number().default(50),
      left: z.number().default(50),
      right: z.number().default(50),
    }).default(() => ({ top: 50, bottom: 50, left: 50, right: 50 })),
  }).default(() => ({
    fontSize: 18,
    fontFamily: "Helvetica",
    color: "#000000",
    alignment: "center" as const,
    margin: { top: 50, bottom: 50, left: 50, right: 50 }
  })),
});

export const imagePageSchema = z.object({
  type: z.literal("image"),
  content: z.string().optional(),
  linkToPrevious: z.boolean(),
  style: z.object({
    fit: z.enum(["cover", "contain", "fill"]).default("cover"),
    position: z.object({
      x: z.number().default(0),
      y: z.number().default(0),
    }).default(() => ({ x: 0, y: 0 })),
    size: z.object({
      width: z.number().optional(),
      height: z.number().optional(),
    }).default(() => ({})),
  }).default(() => ({
    fit: "cover" as const,
    position: { x: 0, y: 0 },
    size: {}
  })),
});

export const layoutJsonSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  pages: z.array(z.union([textPageSchema, imagePageSchema])),
  settings: z.object({
    pageSize: z.object({
      width: z.number().default(595.28), // A4 width in points
      height: z.number().default(841.89), // A4 height in points
    }).default(() => ({ width: 595.28, height: 841.89 })),
    bleed: z.number().default(9), // 3mm bleed in points
    colorProfile: z.enum(["RGB", "CMYK"]).default("CMYK"),
    resolution: z.number().default(300), // DPI
  }).default(() => ({
    pageSize: { width: 595.28, height: 841.89 },
    bleed: 9,
    colorProfile: "CMYK" as const,
    resolution: 300
  })),
});


export const legacyTextPageSchema = z.object({
  type: z.literal("text"),
  content: z.string(),
  linkToPrevious: z.boolean(),
});
export const legacyImagePageSchema = z.object({
  type: z.literal("image"),
  content: z.string().optional(),
  linkToPrevious: z.boolean(),
});
export const legacyLayoutJsonSchema = z.object({
  title: z.string(),
  pages: z.array(z.union([legacyTextPageSchema, legacyImagePageSchema])),
});


export type TextPage = z.infer<typeof textPageSchema>;
export type ImagePage = z.infer<typeof imagePageSchema>;
export type LayoutJSON = z.infer<typeof layoutJsonSchema>;
export type LegacyPage = z.infer<typeof legacyLayoutJsonSchema>["pages"][number];

export interface PageRenderData {
  text?: string;
  imagePath?: string;
  style?: TextPage["style"] | ImagePage["style"];
}

export interface PDFGenerationOptions {
  outputFormat: "print" | "web";
  generatePreviews: boolean;
  uploadToStorage: boolean;
  append?: boolean;
  existingPdfBuffer?: Buffer;     
}

export interface PDFGenerationResult {
  pdfBuffer: Buffer;
  previewUrls?: string[];
  metadata: {
    pageCount: number;
    fileSize: number;
    dimensions: {
      width: number;
      height: number;
    };
  };
}