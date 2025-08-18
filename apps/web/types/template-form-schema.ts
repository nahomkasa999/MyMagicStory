import * as z from 'zod';

export const pageSchema = z.object({
  type: z.enum(['text', 'image']),
  content: z.string().min(1, 'Content is required.'),
  linkToPrevious: z.boolean(),
});

export const templateFormSchema = z.object({
  title: z.string().min(1, 'Template title is required'),
  globalStyle: z.object({
    tone: z.string().min(1, 'Tone is required'),
    colorPalette: z.string().min(1, 'Color Palette is required'),
    lighting: z.string().min(1, 'Lighting is required'),
    shading: z.string().min(1, 'Shading is required'),
    consistency: z.string().min(1, 'Consistency is required'),
  }),
  pages: z.array(pageSchema).min(1, 'At least one page is required.'),
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;