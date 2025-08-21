"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { supabase } from "@/lib/supabase/supabaseClient";
import { 
  generatePreviewsResponseSchema, 
  getPreviewsResponseSchema,
  type GeneratePreviewsResponse,
  type GetPreviewsResponse,
  type StorybookPreviews
} from "../../../../../types/preview-types";

// Create schema for preview API endpoints
export const previewsSchema = createSchema({
  "/generate-previews": {
    output: generatePreviewsResponseSchema,
  },
  "/previews/:storybookId": {
    output: getPreviewsResponseSchema,
  },
});

// Create fetch instance
const $fetch = createFetch({
  baseURL: "http://localhost:3001",
  schema: previewsSchema,
});

// Helper function to get auth token
async function getAuthToken() {
  const session = await supabase.auth.getSession();
  return session.data.session?.access_token;
}

// Fetch function to get existing previews
async function fetchPreviews(storybookId: string): Promise<StorybookPreviews | null> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const { data, error } = await $fetch("/previews/:storybookId", {
    params: { storybookId },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to fetch previews");
  }

  const response = data as GetPreviewsResponse;
  return response.data || null;
}

// Mutation function to generate previews
async function generatePreviews(storybookId: string): Promise<StorybookPreviews> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const { data, error } = await $fetch("/generate-previews", {
    method: "POST",
    body: { storybookId },
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to generate previews");
  }

  const response = data as GeneratePreviewsResponse;
  if (!response.data) {
    throw new Error("No preview data returned");
  }

  return response.data;
}

// Hook to fetch existing previews
export function usePreviews(storybookId: string) {
  return useQuery({
    queryKey: ["previews", storybookId],
    queryFn: () => fetchPreviews(storybookId),
    enabled: !!storybookId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// Hook to generate previews
export function useGeneratePreviews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generatePreviews,
    onSuccess: (data, storybookId) => {
      // Update the previews cache
      queryClient.setQueryData(["previews", storybookId], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["userStorybooks"] });
    },
    onError: (error) => {
      console.error("Failed to generate previews:", error);
    },
  });
}

// Hook to check if previews exist and generate if needed
export function useEnsurePreviews(storybookId: string, autoGenerate = false) {
  const { data: previews, isLoading, error } = usePreviews(storybookId);
  const generateMutation = useGeneratePreviews();

  // Auto-generate previews if they don't exist and autoGenerate is true
  const shouldGenerate = autoGenerate && !isLoading && !previews && !error && !generateMutation.isPending;

  if (shouldGenerate) {
    generateMutation.mutate(storybookId);
  }

  return {
    previews,
    isLoading: isLoading || generateMutation.isPending,
    error: error || generateMutation.error,
    generatePreviews: () => generateMutation.mutate(storybookId),
    isGenerating: generateMutation.isPending,
    hasError: !!error || !!generateMutation.error,
  };
}