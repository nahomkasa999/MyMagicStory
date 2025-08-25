import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { prisma } from '../db/index.js';
import { templateFormSchema } from '@mymagicstory/shared/types';
import { TemplateCrud } from '../services/crud/templatecrud.js';
// Instantiate the TemplateCrud class with the Prisma client
const templateCrud = new TemplateCrud(prisma);

// Use the imported templateFormSchema directly
const templateSchema = templateFormSchema;

const templateResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    title: z.string(),
    layoutJson: templateFormSchema, 
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
  console.log("hellow");
  try {
    const body = await c.req.json();
    const validatedBody = templateSchema.parse(body);

    // Use the TemplateCrud class to create the template
    const template = await templateCrud.create({
      ...validatedBody,
      coverImageUrl: '', 
      previewPages: 3,
    });
    
    console.log("created");

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