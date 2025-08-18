import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { prisma } from '../db/index.js';

const templateSchema = z.object({
  title: z.string(),
  layoutJson: z.any(),
});

const templateResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    title: z.string(),
    layoutJson: z.any(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

export const createTemplateRoute = createRoute({
  method: 'post',
  path: '/templates',
  tags: ['Templates'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: templateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Template created successfully',
      content: {
        'application/json': {
          schema: templateResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            error: z.string(),
          }),
        },
      },
    },
  },
});

export const createTemplateHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedBody = templateSchema.parse(body);
    const { title } = validatedBody;

    const template = await prisma.storyTemplate.create({
      data: {
        title,
        description: title,
        layoutJson: body,
        coverImageUrl: '', 
        previewPages: 3
      },
    });

    const responseData = {
      id: template.id,
      title: template.title,
      layoutJson: template.layoutJson,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };

    return c.json({ message: 'Template created successfully', data: responseData }, 200);
  } catch (error) {
    console.error('Error processing request in createTemplateHandler:', error);
    return c.json({ message: 'An error occurred.', error: (error as Error).message }, 500);
  }
};