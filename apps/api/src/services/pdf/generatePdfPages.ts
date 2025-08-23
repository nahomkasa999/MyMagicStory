import type { LayoutJSON, PageRenderData, LegacyPage } from "./types.js";
import { layoutJsonSchema, legacyLayoutJsonSchema } from "./types.js";
import { writeFile } from "fs/promises";
import pMap from "p-map";
import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "../../db/index.js";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class PDFPageGenerator {
  layout: LayoutJSON;
  storyTemplate: any;
  subscription: boolean;
  projectId: string;
  frontendImages?: File[];
  imageUrls: string[] = [];

  constructor(storyTemplate: any, subscription: boolean, projectId: string, frontendImages?: File[]) {
    this.storyTemplate = storyTemplate;
    this.subscription = subscription;
    this.projectId = projectId;
    this.frontendImages = frontendImages;

    try {
      this.layout = layoutJsonSchema.parse(storyTemplate.layoutJson);
    } catch {
      const legacyLayout = legacyLayoutJsonSchema.parse(storyTemplate.layoutJson);
      this.layout = this.convertLegacyLayout(legacyLayout);
    }
  }

  private convertLegacyLayout(legacyLayout: any): LayoutJSON {
    return {
      title: legacyLayout.title,
      subtitle: undefined,
      pages: legacyLayout.pages.map((page: LegacyPage) => {
        if (page.type === "text") {
          return {
            type: "text" as const,
            content: page.content,
            linkToPrevious: page.linkToPrevious,
            style: {
              fontSize: 18,
              fontFamily: "Helvetica",
              color: "#000000",
              alignment: "center" as const,
              margin: { top: 50, bottom: 50, left: 50, right: 50 },
            },
          };
        } else {
          return {
            type: "image" as const,
            content: page.content,
            linkToPrevious: page.linkToPrevious,
            style: {
              fit: "cover" as const,
              position: { x: 0, y: 0 },
              size: {},
            },
          };
        }
      }),
      settings: {
        pageSize: { width: 595.28, height: 841.89 },
        bleed: 9,
        colorProfile: "CMYK" as const,
        resolution: 300,
      },
    };
  }

  // Upload frontend images to Supabase or fetch existing ones
  private async prepareImageUrls(): Promise<void> {
    // Upload new frontend images
    if (this.frontendImages?.length) {
      for (let i = 0; i < this.frontendImages.length; i++) {
        const file = this.frontendImages[i];
        const filePath = `projects/${this.projectId}/image_${Date.now()}_${i}.png`;

        const { error: uploadError } = await supabase.storage
          .from("storybook-images")
          .upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;

        await prisma.uploadedImage.create({
          data: { projectId: this.projectId, imageUrl: filePath },
        });
      }
    }

    // Fetch all stored images for project
    const storedImages = await prisma.uploadedImage.findMany({
      where: { projectId: this.projectId },
      select: { imageUrl: true },
    });

    // Generate signed URLs and filter out invalid/expired URLs
    const urls: string[] = [];
    for (const img of storedImages) {
      try {
        const { data, error } = await supabase.storage
          .from("storybook-images")
          .createSignedUrl(img.imageUrl, 60 * 60); // 1-hour signed URL
        if (!error && data?.signedUrl) urls.push(data.signedUrl);
      } catch {
        // skip invalid URLs
      }
    }

    this.imageUrls = urls;
  }

  async generatePages(): Promise<{ layout: LayoutJSON; pages: PageRenderData[] }> {
    await this.prepareImageUrls();

    let pagesToRender = [...this.layout.pages];
    if (!this.subscription) pagesToRender = pagesToRender.slice(0, 3);

    const allPages: PageRenderData[] = [];
    const imagePages = pagesToRender
      .map((page, idx) => ({ page, idx }))
      .filter((p) => p.page.type === "image" && p.page.content);

    const imageResults = await pMap(
      imagePages,
      async ({ page, idx }) => {
        try {
          const input = {
            prompt: page.content,
            style_reference_images: this.imageUrls,
            output_format: "png",
            aspect_ratio: "3:4",
          };
          const output = await replicate.run("ideogram-ai/ideogram-v3-turbo", { input });
          const imageUrl = Array.isArray(output) ? output[0] : output;
          const res = await fetch(imageUrl);
          const imgBuffer = Buffer.from(await res.arrayBuffer());
          const filename = `photo_gen_${idx}.png`;
          await writeFile(filename, imgBuffer);

          return { imagePath: filename, style: page.style, idx };
        } catch (error) {
          console.error("Failed to generate image for ", page.content);
          return {
            text: "Image generation failed",
            style: {
              fontSize: 18,
              fontFamily: "Helvetica",
              color: "#666666",
              alignment: "center" as const,
              margin: { top: 50, bottom: 50, left: 50, right: 50 },
            },
            idx,
          };
        }
      },
      { concurrency: 5 }
    );

    let imageCounter = 0;
    for (const page of pagesToRender) {
      if (page.type === "text") {
        allPages.push({ text: page.content, style: page.style });
      } else if (page.type === "image") {
        allPages.push(imageResults[imageCounter]);
        imageCounter++;
      }
    }

    return { layout: this.layout, pages: allPages };
  }
}
