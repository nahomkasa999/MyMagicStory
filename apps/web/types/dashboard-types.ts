import { z } from "zod";

// User schema for dashboard
export const dashboardUserSchema = z.object({
  id: z.uuid(),
  name: z.string().nullable(),
  email: z.email(),
  role: z.enum(["ADMIN", "USER"]),
  avatarUrl: z.string().nullable().optional(),
  plan: z.enum(["free", "paid"]).default("free"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Storybook/Project schema for dashboard
export const storybookSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "COMPLETED", "PURCHASED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  pageCount: z.number().default(0),
  template: z.object({
    id: z.string(),
    title: z.string(),
    coverImageUrl: z.string(),
  }),
});

// Response schemas
export const userStorybooksResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    user: dashboardUserSchema,
    storybooks: z.array(storybookSchema),
  }),
});

// Type exports
export type DashboardUser = z.infer<typeof dashboardUserSchema>;
export type Storybook = z.infer<typeof storybookSchema>;
export type UserStorybooksResponse = z.infer<typeof userStorybooksResponseSchema>;

// Frontend compatible storybook type (matches existing interface)
export const frontendStorybookSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  coverImage: z.string().optional(),
  createdAt: z.string(),
  status: z.enum(["completed", "draft", "processing"]),
  pageCount: z.number(),
});

export type FrontendStorybook = z.infer<typeof frontendStorybookSchema>;

// Frontend user type (matches existing interface)
export const frontendUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  avatar: z.string().optional(),
  plan: z.enum(["free", "paid"]),
});

export type FrontendUser = z.infer<typeof frontendUserSchema>;