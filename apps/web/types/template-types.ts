import { z } from 'zod';

export const storyTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  coverImageUrl: z.string(),
  previewPages: z.number().int(),
});

export const templatesResponseSchema = z.object({
  templates: z.array(storyTemplateSchema),
});

export type StoryTemplate = z.infer<typeof storyTemplateSchema>;
export type TemplatesResponse = z.infer<typeof templatesResponseSchema>;