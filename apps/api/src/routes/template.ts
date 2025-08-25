import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { prisma } from '../db/index.js';
import { templateFormSchema, type TemplateFormValues } from '@mymagicstory/shared/types';
import { TemplateCrud } from '../services/crud/templatecrud.js';


const templateCrud = new TemplateCrud(prisma);

const templateInputSchema = templateFormSchema;

// Define a default layoutJson structure that matches templateFormSchema
// This will be used as a fallback if a stored layoutJson fails validation.
const defaultValidLayoutJson: TemplateFormValues = {
  title: "Untitled Template",
  globalStyle: {
    tone: "neutral",
    colorPalette: "monochromatic",
    lighting: "natural",
    shading: "soft",
    consistency: "medium",
  },
  pages: [{
    page: 1,
    spread: { firstPage: 1, lastPage: 1 },
    side: "full",
    text: "",
    imagePrompt: "",
  }],
};


// Schema for a single template response (data part)
const singleTemplateOutputSchema = z.object({
  id: z.string().openapi({ example: 'clxvh53j70000j5816v6a6q9f' }),
  title: z.string().openapi({ example: 'The Magical Forest' }),
  coverImageUrl: z.string().openapi({example: "supabase public url"}),
  layoutJson: templateFormSchema.openapi({ description: 'The full JSON layout of the story template.' }),
  createdAt: z.string().datetime().openapi({ example: '2023-10-27T10:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-10-27T10:00:00Z' }),
});

// Full response schema for a single template operation
const templateResponseSchema = z.object({
  message: z.string().openapi({ example: 'Template created successfully' }),
  data: singleTemplateOutputSchema,
});

// Full response schema for listing multiple templates
const templateListResponseSchema = z.object({
  message: z.string().openapi({ example: 'Templates retrieved successfully' }),
  data: z.array(singleTemplateOutputSchema),
});

// Schema for error responses
const errorResponseSchema = z.object({
  message: z.string().openapi({ example: 'An error occurred.' }),
  error: z.string().openapi({ example: 'Internal server error' }),
});

// Schema for ID parameter
const idParamSchema = z.object({
  id: z.string().openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: 'clxvh53j70000j5816v6a6q9f',
  }),
});

// Schema for deleting multiple templates
const deleteManyInputSchema = z.object({
  ids: z.array(z.string()).min(1).openapi({
    example: ['clxvh53j70000j5816v6a6q9f', 'clxvh53j70001j581d4e0b0x4'],
    description: 'Array of template IDs to delete.',
  }),
});

// --- Route Definitions ---

// 1. Create Template Route
export const createTemplateRoute = createRoute({
  method: 'post',
  path: '/templates',
  tags: ['Templates'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: templateInputSchema,
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
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 2. Get All Templates Route
export const getTemplatesRoute = createRoute({
  method: 'get',
  path: '/templates',
  tags: ['Templates'],
  responses: {
    200: {
      description: 'List of all templates',
      content: {
        'application/json': {
          schema: templateListResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 3. Get One Template Route
export const getOneTemplateRoute = createRoute({
  method: 'get',
  path: '/templates/{id}',
  tags: ['Templates'],
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: 'Single template by ID',
      content: {
        'application/json': {
          schema: templateResponseSchema,
        },
      },
    },
    404: {
      description: 'Template not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 4. Update Template Route
export const updateTemplateRoute = createRoute({
  method: 'put',
  path: '/templates/{id}',
  tags: ['Templates'],
  request: {
    params: idParamSchema,
    body: {
      content: {
        'application/json': {
          schema: templateInputSchema.partial(), // Allow partial updates
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Template updated successfully',
      content: {
        'application/json': {
          schema: templateResponseSchema,
        },
      },
    },
    404: {
      description: 'Template not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 5. Delete One Template Route
export const deleteOneTemplateRoute = createRoute({
  method: 'delete',
  path: '/templates/{id}',
  tags: ['Templates'],
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: 'Template deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Template deleted successfully' }),
            id: z.string().openapi({ example: 'clxvh53j70000j5816v6a6q9f' }),
          }),
        },
      },
    },
    404: {
      description: 'Template not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 6. Delete Many Templates Route
export const deleteManyTemplatesRoute = createRoute({
  method: 'delete',
  path: '/templates/batch',
  tags: ['Templates'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: deleteManyInputSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Multiple templates deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Successfully deleted 2 templates.' }),
            count: z.number().openapi({ example: 2 }),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});


export const createTemplateHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedBody: TemplateFormValues = templateFormSchema.parse(body);

    const template = await templateCrud.create(validatedBody);

    const responseData = {
      id: template.id,
      title: template.title,
      coverImageUrl: template.coverImageUrl,
      layoutJson: templateFormSchema.parse(template.layoutJson), // Keep parsing here to ensure output conformity
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };

    return c.json({ message: 'Template created successfully', data: responseData }, 200);
  } catch (error: any) {
    console.error(error);
    return c.json({ message: 'An error occurred.', error: error.message }, 500);
  }
};

export const getTemplatesHandler = async (c: Context) => {
  console.log("hellow")
  try {
    const templates = await templateCrud.readAll();

    const formattedTemplates = templates.map((template: any) => {
      let parsedLayoutJson: TemplateFormValues;
      const parseResult = templateFormSchema.safeParse(template.layoutJson);

      if (parseResult.success) {
        parsedLayoutJson = parseResult.data;
      } else {
        // console.error(`Zod validation failed for template ID ${template.id} layoutJson:`, parseResult.error);
        console.log("error in line 333")
        // Fallback to a default valid structure
        const originalLayout = template.layoutJson as any;
        parsedLayoutJson = {
          ...defaultValidLayoutJson,
          ...originalLayout,
          title: originalLayout.title || defaultValidLayoutJson.title,
          globalStyle: {
            ...defaultValidLayoutJson.globalStyle,
            ...(originalLayout.globalStyle || {}),
          },
          pages: (originalLayout.pages || []).map((page: any, index: number) => ({
            page: index + 1,
            spread: { firstPage: index + 1, lastPage: index + 1 },
            side: 'full',
            text: page.text || "",
            imagePrompt: page.imagePrompt || "",
          })),
        };
      }

      return {
        id: template.id,
        title: template.title,
        coverImageUrl: template.coverImageUrl,
        layoutJson: parsedLayoutJson,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
      };
    });

    return c.json({ message: 'Templates retrieved successfully', data: formattedTemplates }, 200);
  } catch (error: any) {
    console.error(error);
    return c.json({ message: 'An error occurred.', error: error.message }, 500);
  }
};

export const getOneTemplateHandler = async (c: Context) => {
  try {
    const { id } = c.req.param();
    console.log("theid:", id)
    const validatedParam = z.object({ id: z.string() }).parse({ id });

    const template = await templateCrud.readOne(validatedParam.id);
    console.log(template)

    if (!template) {
      return c.json({ message: 'Template not found.', error: `Template with ID ${id} not found.` }, 404);
    }

    let parsedLayoutJson: TemplateFormValues;
    const parseResult = templateFormSchema.safeParse(template.layoutJson);

    if (parseResult.success) {
      parsedLayoutJson = parseResult.data;
    } else {
      console.error(`Zod validation failed for template ID ${template.id} layoutJson:`, parseResult.error);
      console.error("there is error in the line 372")
      const originalLayout = template.layoutJson as any;
      parsedLayoutJson = {
        ...defaultValidLayoutJson,
        ...originalLayout,
        title: originalLayout.title || defaultValidLayoutJson.title,
        globalStyle: {
          ...defaultValidLayoutJson.globalStyle,
          ...(originalLayout.globalStyle || {}),
        },
        pages: (originalLayout.pages || []).map((page: any, index: number) => ({
          page: index + 1,
          spread: { firstPage: index + 1, lastPage: index + 1 },
          side: 'full',
          text: page.text || "",
          imagePrompt: page.imagePrompt || "",
        })),
      };
    }

    const responseData = {
      id: template.id,
      title: template.title,
      coverImageUrl: template.coverImageUrl,
      layoutJson: parsedLayoutJson,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };

    return c.json({ message: 'Template retrieved successfully', data: responseData }, 200);
  } catch (error: any) {
    console.error(error);
    return c.json({ message: 'An error occurred.', error: error.message }, 500);
  }
};

export const updateTemplateHandler = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const validatedParam = z.object({ id: z.string() }).parse({ id });

    const body = await c.req.json();
    const validatedBody: TemplateFormValues = templateFormSchema.parse(body); // Input must be fully valid

    const template = await templateCrud.update(validatedParam.id, validatedBody);

    if (!template) {
      return c.json({ message: 'Template not found for update.', error: `Template with ID ${id} not found.` }, 404);
    }

    let parsedLayoutJson: TemplateFormValues;
    const parseResult = templateFormSchema.safeParse(template.layoutJson);

    if (parseResult.success) {
      parsedLayoutJson = parseResult.data;
    } else {
      // console.error(`Zod validation failed for template ID ${template.id} layoutJson after update:`, parseResult.error);
      console.error("there is here in the line 412")
      parsedLayoutJson = defaultValidLayoutJson;
    }

    const responseData = {
      id: template.id,
      title: template.title,
      coverImageUrl: template.coverImageUrl,
      layoutJson: parsedLayoutJson,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };

    return c.json({ message: 'Template updated successfully', data: responseData }, 200);
  } catch (error: any) {
    console.error(error);
    return c.json({ message: 'An error occurred.', error: error.message }, 500);
  }
};

export const deleteOneTemplateHandler = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const validatedParam = z.object({ id: z.string() }).parse({ id });

    const deletedTemplate = await templateCrud.deleteOne(validatedParam.id);

    return c.json({ message: 'Template deleted successfully', id: deletedTemplate.id }, 200);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') {
      return c.json({ message: 'Template not found for deletion.', error: error.message }, 404);
    }
    return c.json({ message: 'An error occurred.', error: error.message }, 500);
  }
};

export const deleteManyTemplatesHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedBody = z.object({ ids: z.array(z.string()).min(1) }).parse(body);

    const result = await templateCrud.deleteMany(validatedBody.ids);

    return c.json({ message: `Successfully deleted ${result.count} templates.`, count: result.count }, 200);
  } catch (error: any) {
    console.error(error);
    return c.json({ message: 'An error occurred.', error: error.message }, 500);
  }
};

