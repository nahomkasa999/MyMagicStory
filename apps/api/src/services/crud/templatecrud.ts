import { PrismaClient, type StoryTemplate } from '../../generated/prisma/client.js';
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
    const { title, globalStyle, pages, coverImageUrl, previewPages } = data;

    const layoutJson = {
      title,
      globalStyle,
      pages,
    };

    return this.prisma.storyTemplate.create({
      data: {
        title,
        description: title,
        coverImageUrl: coverImageUrl || '',
        layoutJson,
        previewPages: previewPages || 2,
      },
    });
  }

  async readOne(id: string): Promise<StoryTemplate | null> {
    return this.prisma.storyTemplate.findUnique({
      where: { id },
    });
  }

  async readAll(): Promise<StoryTemplate[]> {
    return this.prisma.storyTemplate.findMany();
  }

  async update(id: string, data: UpdateTemplateInput): Promise<StoryTemplate> {
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

    return this.prisma.storyTemplate.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteOne(id: string): Promise<StoryTemplate> {
    return this.prisma.storyTemplate.delete({
      where: { id },
    });
  }

  async deleteMany(ids: string[]): Promise<{ count: number }> {
    return this.prisma.storyTemplate.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
