import { Prisma, PrismaClient, type StoryTemplate } from '../../generated/prisma/client.js';
import { z } from 'zod';
import { templateFormSchema } from '@mymagicstory/shared/types';

type CreateTemplateInput = z.infer<typeof templateFormSchema> & {
  coverImageUrl?: string;
  previewPages?: number;
};

type UpdateTemplateInput = Partial<CreateTemplateInput>;

export class TemplateCrud {
  private prisma: PrismaClient;

  constructor(prismaInstance: PrismaClient) {
    this.prisma = prismaInstance;
  }

  async create(data: CreateTemplateInput): Promise<StoryTemplate> {
    try {
      const { title, globalStyle, pages, coverImageUrl, previewPages } = data;

      const layoutJson = {
        title,
        globalStyle,
        pages,
      };

      return await this.prisma.storyTemplate.create({
        data: {
          title,
          description: title,
          coverImageUrl: coverImageUrl || '',
          layoutJson,
          previewPages: previewPages || 2,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error('Database connection error:', error.message);
        throw new Error('Failed to connect to the database.');
      }
      console.error('An unexpected error occurred while creating a template:', error);
      throw new Error('An unexpected error occurred while creating a template.');
    }
  }

  async readOne(id: string): Promise<StoryTemplate | null> {
    try {
      return await this.prisma.storyTemplate.findUnique({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error('Database connection error:', error.message);
        throw new Error('Failed to connect to the database.');
      }
      console.error(`An unexpected error occurred while reading template ${id}:`, error);
      throw new Error(`An unexpected error occurred while reading template ${id}.`);
    }
  }

  async readAll(): Promise<StoryTemplate[]> {
    try {
      return await this.prisma.storyTemplate.findMany();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error('Database connection error:', error.message);
        throw new Error('Failed to connect to the database.');
      }
      console.error('An unexpected error occurred while reading all templates:', error);
      throw new Error('An unexpected error occurred while reading all templates.');
    }
  }

  async update(id: string, data: UpdateTemplateInput): Promise<StoryTemplate> {
    try {
      const updateData: any = {};
      if (data.title) {
        updateData.title = data.title;
        updateData.description = data.title;
      }
      if (data.coverImageUrl) {
        updateData.coverImageUrl = data.coverImageUrl;
      }
      if (data.previewPages) {
        updateData.previewPages = data.previewPages;
      }

      const layoutJsonData = {
        title: data.title,
        globalStyle: data.globalStyle,
        pages: data.pages,
      };

      if (Object.keys(layoutJsonData).length > 0) {
        updateData.layoutJson = layoutJsonData;
      }

      return await this.prisma.storyTemplate.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error('Database connection error:', error.message);
        throw new Error('Failed to connect to the database.');
      }
      console.error(`An unexpected error occurred while updating template ${id}:`, error);
      throw new Error(`An unexpected error occurred while updating template ${id}.`);
    }
  }

  async deleteOne(id: string): Promise<StoryTemplate> {
    try {
      return await this.prisma.storyTemplate.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error('Database connection error:', error.message);
        throw new Error('Failed to connect to the database.');
      }
      console.error(`An unexpected error occurred while deleting template ${id}:`, error);
      throw new Error(`An unexpected error occurred while deleting template ${id}.`);
    }
  }

  async deleteMany(ids: string[]): Promise<{ count: number }> {
    try {
      return await this.prisma.storyTemplate.deleteMany({
        where: { id: { in: ids } },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error('Database connection error:', error.message);
        throw new Error('Failed to connect to the database.');
      }
      console.error(`An unexpected error occurred while deleting templates:`, error);
      throw new Error(`An unexpected error occurred while deleting templates.`);
    }
  }
}
