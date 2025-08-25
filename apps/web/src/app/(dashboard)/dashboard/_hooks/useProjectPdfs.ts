// app/dashboard/_hooks/useProjectPdf.ts
import { useQuery } from "@tanstack/react-query";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { supabase } from "@/lib/supabase/supabaseClient";
import { z } from "zod";

// Define the schema for the new endpoint
export const projectPdfResponseSchema = z.object({
  success: z.boolean(),
  downloadUrl: z.string(),
  isPreview: z.boolean(),
});

export const projectSchema = createSchema({
  "/project/:projectId/pdf": {
    output: projectPdfResponseSchema,
  },
});

const $fetch = createFetch({
  baseURL: "http://localhost:3001",
  schema: projectSchema,
});

async function getAuthToken() {
  const session = await supabase.auth.getSession();
  return session.data.session?.access_token;
}

async function fetchProjectPdf(projectId: string) {
  const token = await getAuthToken();
  if (!token) throw new Error("No authentication token found");

  const { data, error } = await $fetch("/project/:projectId/pdf", {
    params: { projectId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to fetch PDF data");
  }

  return data;
}

export function useProjectPdf(projectId: string) {
  return useQuery({
    queryKey: ["projectPdf", projectId],
    queryFn: () => fetchProjectPdf(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}