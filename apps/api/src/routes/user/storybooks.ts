import type { Context } from "hono";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { prisma } from "../../db/index.js";

// Response schema including isSubscribed
const userStorybooksResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    user: z.object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string(),
      role: z.enum(["ADMIN", "USER"]),
      avatarUrl: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
      isSubscribed: z.boolean(),
    }),
    storybooks: z.array(
      z.object({
        id: z.string(),
        title: z.string().nullable(),
        status: z.enum(["DRAFT", "COMPLETED", "PURCHASED"]),
        createdAt: z.string(),
        updatedAt: z.string(),
        template: z.object({
          id: z.string(),
          title: z.string(),
          coverImageUrl: z.string(),
        }),
      })
    ),
  }),
});

export const getUserStorybooksRoute = createRoute({
  method: "get",
  path: "/user/storybooks",
  tags: ["User"],
  responses: {
    200: {
      description: "User storybooks fetched successfully",
      content: {
        "application/json": {
          schema: userStorybooksResponseSchema,
        },
      },
    },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
});

export const getUserStorybooksHandler = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    // Fetch user details
    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        subscriptions: {
          where: {
            status: "ACTIVE",
            currentPeriodEnd: { gt: new Date() },
          },
          select: { id: true },
        },
      },
    });

    if (!userDetails) return c.json({ error: "User not found" }, 404);

    // Determine if user has an active subscription
    const isSubscribed = userDetails.subscriptions.length > 0;

    // Fetch user's projects/storybooks with template details
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            coverImageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const response = {
      message: "User storybooks fetched successfully",
      data: {
        user: {
          ...userDetails,
          createdAt: userDetails.createdAt.toISOString(),
          updatedAt: userDetails.updatedAt.toISOString(),
          isSubscribed,
        },
        storybooks: projects.map((project) => ({
          id: project.id,
          title: project.title,
          status: project.status,
          createdAt: project.createdAt.toISOString(),
          updatedAt: project.updatedAt.toISOString(),
          template: project.template,
        })),
      },
    };

    return c.json(response);
  } catch (error) {
    console.error("Error fetching user storybooks:", error);
    return c.json(
      {
        error: "Internal server error",
        message: "Failed to fetch user storybooks",
      },
      500
    );
  }
};
