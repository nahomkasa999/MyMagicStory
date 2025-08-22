import { z } from "zod";

// WebP Preview schemas
export const previewImageSchema = z.object({
  pageNumber: z.number(),
  url: z.string().url(),
  width: z.number(),
  height: z.number(),
});

export const storybookPreviewsSchema = z.object({
  storybookId: z.string(),
  previews: z.array(previewImageSchema),
  totalPages: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// API Response schemas
export const generatePreviewsRequestSchema = z.object({
  storybookId: z.string(),
});

export const generatePreviewsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: storybookPreviewsSchema.optional(),
});

export const getPreviewsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: storybookPreviewsSchema.optional(),
});

// Progressive loading states
export const previewLoadingStateSchema = z.enum([
  "loading",
  "loaded",
  "error",
  "generating"
]);

// Frontend preview component props
export const previewDisplayOptionsSchema = z.object({
  showPageNumbers: z.boolean().default(true),
  enableLazyLoading: z.boolean().default(true),
  blurDataURL: z.string().optional(),
  className: z.string().optional(),
});

// Type exports
export type PreviewImage = z.infer<typeof previewImageSchema>;
export type StorybookPreviews = z.infer<typeof storybookPreviewsSchema>;
export type GeneratePreviewsRequest = z.infer<typeof generatePreviewsRequestSchema>;
export type GeneratePreviewsResponse = z.infer<typeof generatePreviewsResponseSchema>;
export type GetPreviewsResponse = z.infer<typeof getPreviewsResponseSchema>;
export type PreviewLoadingState = z.infer<typeof previewLoadingStateSchema>;
export type PreviewDisplayOptions = z.infer<typeof previewDisplayOptionsSchema>;

// Extended storybook type with preview support
export const storybookWithPreviewsSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  coverImage: z.string().optional(),
  createdAt: z.string(),
  status: z.enum(["completed", "draft", "processing"]),
  pageCount: z.number(),
  previews: storybookPreviewsSchema.optional(),
  hasWebPPreviews: z.boolean().default(false),
});

export type StorybookWithPreviews = z.infer<typeof storybookWithPreviewsSchema>;