import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import frontendIncome from "../frontend.js";

function wrapText(
  text: string,
  maxWidth: number,
  font: any,
  fontSize: number
): string[] {
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

  console.log("am in");
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // --- Cover Page ---
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

  // --- Story Pages ---
  for (const p of frontendIncome.pages) {
    let page = pdfDoc.addPage();
    page.setFont(font);

    if (p.text) {
      console.log(p);
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
        page.drawText(line, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= fontSize + 4;
      }
    } else if (!p.text && p.imagePrompt) {
      const imgBytes = await fs.readFileSync(`page_${p.page}.png`);
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

// 1. Updated Schema for File Upload
export const createPostRoute = createRoute({
  method: "post",
  path: "/post-data",
  tags: ["Data"],
  request: {
    body: {
      content: {
        "image/*": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  },
  responses: {
    200: { description: "PDF generated" },
  },
});

export const createPostHandler = async (c: Context) => {
  console.log("started ...");

  const arrayBuffer = await c.req.arrayBuffer();
  const contentType = c.req.header("Content-Type") || "application/octet-stream";
  const file = new File([arrayBuffer], "upload", { type: contentType });

  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync("photo.png",buffer )

  const imagePath = "photo.png";
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyBvlp9O1dQjMHRWjdmc8_c9uXTy9CZUP5Y",
  });

  let generatedPages: { text: string | null; imagePath?: string }[] = [];


  for (const page of frontendIncome.pages) {
    if (!!page.text) {
      continue;
    }

    const contents = [
      {
        text: page.imagePrompt!,
        role: "you are a professional kids storybook maker. the storybook you generate should be colorfull cartoonic and cartoonic background e.g a cartoonic room of a doctor where the cartoonic boy start in front with doctor cloth. the proporition of the things should be keept to be real mean the boy should be too big or small compared to the room but correct size",
      },  
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: contents,
      config: { responseModalities: [ Modality.TEXT, Modality.IMAGE ] },
    });

    for (const part of response.candidates![0].content!.parts!) {
      if (part.inlineData) {
        const buffer = Buffer.from(part!.inlineData!.data!, "base64");
        const filePath = `page_${page.page}.png`;
        fs.writeFileSync(filePath, buffer);
        generatedPages.push({ text: page.text!, imagePath: filePath });
      }
    }
  }
  console.log("finished....")
  const pdfBytes = await generateStorybookPDF(
    generatedPages,
    "My AI Storybook",
    "" 
  )
  return c.body(pdfBytes, 200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=storybook.pdf",
  });
};
