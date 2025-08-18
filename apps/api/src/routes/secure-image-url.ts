import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getSecureImageUrlRoute = createRoute({
  method: "get",
  path: "/secure-image-url",
  tags: ["Image"],
  request: {
    query: z.object({
      public_id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Returns a secure, expiring URL for an image.",
      content: {
        "application/json": {
          schema: z.object({
            secureUrl: z.string().url(),
          }),
        },
      },
    },
  },
});

export const getSecureImageUrlHandler = async (c: Context) => {
  const { public_id } = c.req.valid("query");

  const expirationTime = Math.round(Date.now() / 1000) + 3600; // 1 hour from now

  const secureUrl = cloudinary.url(public_id, {
    sign_url: true,
    secure: true,
    expires_at: expirationTime,
  });

  return c.json({ secureUrl }, 200);
};