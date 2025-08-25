import { z } from "zod";

// Schema for the global style part of the form
export const templateGlobalStyleFormSchema = z.object({
  tone: z.string().min(1, "Tone is required."),
  colorPalette: z.string().min(1, "Color Palette is required."),
  lighting: z.string().min(1, "Lighting is required."),
  shading: z.string().min(1, "Shading is required."),
  consistency: z.string().min(1, "Consistency is required."),
});

// Schema for a single page within the form
export const templatePageFormSchema = z.object({
  type: z.union([z.literal("text"), z.literal("image")]),
  content: z.string().min(1, "Content is required for the page."),
  linkToPrevious: z.boolean().default(false), // Only relevant for form UI, not directly in StorybookContentSchema
});

// Overall schema for the template creation form
export const templateFormSchema = z.object({
  title: z.string().min(1, "Template title is required."),
  coverImageUrl: z.string().url("A valid cover image URL is required.").optional(), // Optional for form, required for backend
  previewPages: z.number().int().min(1).default(2), // Optional for form, required for backend
  globalStyle: templateGlobalStyleFormSchema,
  pages: z.array(templatePageFormSchema).min(1, "At least one page is required."),
});

// Infer TypeScript type for the form values
export type TemplateFormValues = z.infer<typeof templateFormSchema>;
