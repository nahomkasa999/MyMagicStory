import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import { writeFile } from "fs/promises";
import Replicate from "replicate";
import * as fs from "node:fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { z } from "zod";
import { prisma } from "../db/index.js";
import fetch from "node-fetch";

console.log(process.env.REPLICATE_API_TOKEN)
const replicate = new Replicate({auth: process.env.REPLICATE_API_TOKEN});


const textPageSchema = z.object({
  type: z.literal("text"),
  content: z.string(),
  linkToPrevious: z.boolean(),
});

const imagePageSchema = z.object({
  type: z.literal("image"),
  content: z.string().optional(),
  linkToPrevious: z.boolean(),
});

const layoutJsonSchema = z.object({
  title: z.string(),
  pages: z.array(z.union([textPageSchema, imagePageSchema])),
});

function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const words = text.split(" ");
  let lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const lineWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (lineWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

async function generateStorybookPDF(
  pages: { text: string | null; imagePath?: string }[],
  coverTitle: string,
  coverSubtitle?: string
) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Cover page
  let cover = pdfDoc.addPage();
  cover.setFont(font);
  cover.setFontSize(40);
  cover.drawText(coverTitle, {
    x: 50,
    y: cover.getHeight() / 2 + 50,
    size: 40,
    font,
    color: rgb(0, 0, 0),
  });
  if (coverSubtitle) {
    cover.drawText(coverSubtitle, {
      x: 50,
      y: cover.getHeight() / 2,
      size: 20,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  // Content pages
  for (const p of pages) {
    let page = pdfDoc.addPage();
    page.setFont(font);

    if (p.text) {
      const fontSize = 18;
      page.setFontSize(fontSize);
      const margin = 50;
      const maxWidth = page.getWidth() - margin * 2;
      const lines = wrapText(p.text, maxWidth, font, fontSize);

      let totalHeight = lines.length * (fontSize + 4);
      let y = (page.getHeight() + totalHeight) / 2 - fontSize;

      for (const line of lines) {
        const lineWidth = font.widthOfTextAtSize(line, fontSize);
        const x = (page.getWidth() - lineWidth) / 2;
        page.drawText(line, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= fontSize + 4;
      }
    } else if (p.imagePath) {
      const imgBytes = fs.readFileSync(p.imagePath);
      const img = await pdfDoc.embedPng(imgBytes);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });
    }
  }

  return await pdfDoc.save();
}

export const createPostRoute = createRoute({
  method: "post",
  path: "/post-data/:id",
  tags: ["Data"],
  request: {
    body: {
      content: {
        "image/*": {
          schema: { type: "string", format: "binary" },
        },
      },
    },
  },
  responses: {
    200: { description: "PDF generated" },
  },
});

export const createPostHandler = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Template ID is required" }, 400);

  let layout;
  try {
    const storyTemplate = await prisma.storyTemplate.findUnique({
      where: { id },
      select: { layoutJson: true },
    });
    if (!storyTemplate) return c.json({ error: "Template not found" }, 404);

    layout = layoutJsonSchema.parse(storyTemplate.layoutJson);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid template layout format", details: error }, 500);
    }
    return c.json({ error: "Failed to retrieve or parse story template" }, 500);
  }

  // Save uploaded image locally
  // const arrayBuffer = await c.req.arrayBuffer();
  // const buffer = Buffer.from(arrayBuffer);
  // fs.writeFileSync("photo.png", buffer);

  let allPagesForPdf: { text: string | null; imagePath?: string }[] = [];
  let pageIndex = 0;

  for (const page of layout.pages) {
    if (page.type === "text") {
      allPagesForPdf.push({ text: page.content, imagePath: undefined });
    }

    if (page.type === "image" && page.content) {
      const input = {
        prompt: page.content,
        input_image: "https://res.cloudinary.com/dzimvdwb2/image/upload/v1755596505/1._ec063a.jpg", // could upload to cloud if needed
        output_format: "png",
        aspect_ratio: "3:4",
      };

      const output = await replicate.run("black-forest-labs/flux-kontext-pro", { input });
      // Replicate returns a URL string or array of URLs
      const imageUrl = Array.isArray(output) ? output[0] : output;
      const res = await fetch(imageUrl);
      const imgBuffer = Buffer.from(await res.arrayBuffer());
      const filename = `photo_gen_${pageIndex}.png`;
      await writeFile(filename, imgBuffer);

      allPagesForPdf.push({ text: null, imagePath: filename });
      pageIndex++;
    }
  }

  const pdfBytes = await generateStorybookPDF(allPagesForPdf, layout.title, "");
  return c.body(pdfBytes, 200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "inline; filename=storybook.pdf",
  });
};
