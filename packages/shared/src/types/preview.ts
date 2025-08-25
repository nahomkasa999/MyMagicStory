import z from "zod/v3";

export const PageSchema = z.object({
  page: z.number(),
  spread: z.object({
    firstPage: z.number(),
    lastPage: z.number(),
  }),
  side: z.union([z.literal("full"), z.literal("left"), z.literal("right")]),
  text: z.string().nullable(),
  imagePrompt: z.string().nullable(),
});

export const GlobalStyleSchema = z.object({
  title: z.string(),
  tone: z.string(),
  colorPalette: z.string(),
  lighting: z.string(),
  shading: z.string(),
  consistency: z.string(),
});

export const StorybookContentSchema = z.object({
  globalStyle: GlobalStyleSchema,
  pages: z.array(PageSchema),
});

export const StoryTemplateCreateInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  coverImageUrl: z.string().url(),
  layoutJson: StorybookContentSchema,
  previewPages: z.number().int().min(1).default(2),
});

export const StoryTemplateUpdateInputSchema = StoryTemplateCreateInputSchema.partial();

export const StoryTemplateResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  coverImageUrl: z.string(),
  layoutJson: StorybookContentSchema,
  previewPages: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type StoryTemplateCreateInput = z.infer<typeof StoryTemplateCreateInputSchema>;

export type StoryTemplateUpdateInput = z.infer<typeof StoryTemplateUpdateInputSchema>;

export type StoryTemplateResponse = z.infer<typeof StoryTemplateResponseSchema>;