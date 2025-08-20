"use client";

import { useQuery } from "@tanstack/react-query";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { supabase } from "@/lib/supabase/supabaseClient";
import { type FrontendUser, type FrontendStorybook } from "../../../../../types/dashboard-types";
import { z } from "zod";

// Create schema that matches the actual API response
const apiUserStorybooksResponseSchema = z.object({
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
    }),
    storybooks: z.array(z.object({
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
    })),
  }),
});

// Create schema for the API endpoint
export const storybooksSchema = createSchema({
  "/user/storybooks": {
    output: apiUserStorybooksResponseSchema,
  },
});

// Create fetch instance
  const $fetch = createFetch({
  baseURL: "http://localhost:3001",
  schema: storybooksSchema,
});

// Helper function to get auth token
async function getAuthToken() {
  const session = await supabase.auth.getSession();
  return session.data.session?.access_token;
}


// Helper function to transform backend data to frontend format
function transformStorybookData(backendData: any): {
  user: FrontendUser;
  storybooks: FrontendStorybook[];
} {
  const user: FrontendUser = {
    name: backendData.user.name || "Unknown User",
    email: backendData.user.email,
    avatar: backendData.user.avatarUrl || undefined,
    plan: backendData.user.role === "ADMIN" ? "paid" : "free", // Simple mapping
  };

  const storybooks: FrontendStorybook[] = backendData.storybooks.map((storybook: any) => ({
    id: storybook.id,
    title: storybook.title || storybook.template.title,
    description: `A magical storybook based on ${storybook.template.title}`,
    coverImage: storybook.template.coverImageUrl || undefined,
    createdAt: storybook.createdAt,
    status: mapStatus(storybook.status),
    pageCount: calculatePageCount(storybook.status),
  }));

  return { user, storybooks };
}

// Helper function to map backend status to frontend status
function mapStatus(backendStatus: string): "completed" | "draft" | "processing" {
  switch (backendStatus) {
    case "COMPLETED":
    case "PURCHASED":
      return "completed";
    case "DRAFT":
      return "draft";
    default:
      return "processing";
  }
}

// Helper function to calculate page count based on status
function calculatePageCount(status: string): number {
  switch (status) {
    case "COMPLETED":
    case "PURCHASED":
      return Math.floor(Math.random() * 15) + 8; // Random between 8-22
    case "DRAFT":
      return Math.floor(Math.random() * 8) + 1; // Random between 1-8
    default:
      return 0;
  }
}

// Fetch function
async function fetchUserStorybooks() {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error("No authentication token found");
  }
  const { data, error } = await $fetch("/user/storybooks", {
     headers: {
        authorization: `Bearer ${token}`
     }
  });
  if (error) {
    throw new Error(error.message || "Failed to fetch user storybooks");
  }

  return transformStorybookData(data.data);
}

// Hook
export function useUserStorybooks() {
  return useQuery({
    queryKey: ["userStorybooks"],
    queryFn: fetchUserStorybooks,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}