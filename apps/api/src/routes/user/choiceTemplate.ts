import { createRoute, z } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { prisma } from '../../db/index.js';

const storyTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  coverImageUrl: z.string(),
  previewPages: z.number().int(),
});

const responseSchema = z.object({
  templates: z.array(storyTemplateSchema),
});

export const getAllTemplatesRoute = createRoute({
  method: 'get',
  path: '/user/templates',
  tags: ['User'],
  responses: {
    200: {
      description: 'List of all story templates for a user to choose from.',
      content: {
        'application/json': {
          schema: responseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});

export const getAllTemplatesHandler = async (c: Context) => {
  try {
    const templates = await prisma.storyTemplate.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        coverImageUrl: true,
        previewPages: true,
      },
    });
    return c.json({ templates }, 200);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return c.json({ message: 'Failed to fetch templates' }, 500);
  }
};