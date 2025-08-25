'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFetch, createSchema } from '@better-fetch/fetch';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/supabaseClient';
import { templateFormSchema } from '@mymagicstory/shared/types'; // Your shared Zod schema

// This schema should exactly match the `singleTemplateOutputSchema` defined in your backend route.
const singleTemplateOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  coverImageUrl: z.string(),
  layoutJson: templateFormSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Template = z.infer<typeof singleTemplateOutputSchema>;

// Define the output schema for a successful update operation
export const updateTemplateOutputSchema = z.object({
  message: z.string(),
  data: singleTemplateOutputSchema,
});

// Create a schema for the GET and PUT /templates/:id endpoints
export const templateFetchSchema = createSchema({
  '@get/templates/:id': {
    input: z.object({
      id: z.string(),
    }),
    output: z.object({
      message: z.string(),
      data: singleTemplateOutputSchema,
    }),
  },
  '@put/templates/:id': {
    input: templateFormSchema.partial(),
    output: updateTemplateOutputSchema,
  },
});

const $fetch = createFetch({
  baseURL: 'http://localhost:3001',
  schema: templateFetchSchema,
  auth: {
    type: 'Bearer',
    token: async () => {
      const session = await supabase.auth.getSession();
      return session.data.session?.access_token;
    },
  },
});

/**
 * Custom hook for fetching a single story template by its ID.
 * @param id The ID of the template to fetch.
 * @returns A query object containing the template data, loading state, and error state.
 */
export function useTemplateById(id: string) {
  return useQuery<Template, Error>({
    queryKey: ['template', id],
    queryFn: async () => {
      const { data, error } = await $fetch(`/templates/${id}`, {
        method: 'GET',
        params: { id },
      });

      if (error) {
        throw new Error(error.message || 'Failed to fetch template.');
      }
      if (!data) {
        throw new Error('No data returned from the server.');
      }
      // Manually parse the entire response to ensure it conforms to the schema
      const parsedResponse = z
        .object({
          message: z.string(),
          data: singleTemplateOutputSchema,
        })
        .parse(data);
      return parsedResponse.data;
    },
    retry: 1,
    enabled: !!id, // Only run the query if the id is available
  });
}

/**
 * Custom hook for updating an existing story template.
 * @returns An object containing the updateTemplate mutation function and its loading state.
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  const updateTemplateMutation = useMutation<
    z.infer<typeof updateTemplateOutputSchema>,
    Error,
    { id: string; values: Partial<z.infer<typeof templateFormSchema>> }
  >({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await $fetch(`/templates/${id}`, {
        method: 'PUT',
        params: { id },
        body: values,
      });

      if (error) {
        throw new Error(error.message || 'Failed to update template.');
      }
      if (!data) {
        throw new Error('No data returned from the server.');
      }
      // Manually parse to ensure the data conforms to the schema
      return updateTemplateOutputSchema.parse(data);
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || 'Template updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['template', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
    onError: (err: Error) => {
      console.error('Error updating template:', err);
      toast.error(err.message || 'Failed to update template. Internal error');
    },
  });

  return {
    updateTemplate: updateTemplateMutation.mutate,
    isUpdating: updateTemplateMutation.isPending,
  };
}
