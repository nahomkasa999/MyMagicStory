'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation and useQueryClient
import { createFetch, createSchema } from '@better-fetch/fetch';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/supabaseClient'; 
import { templateFormSchema } from '@mymagicstory/shared/types'; 
import { toast } from 'sonner'; // Assuming you have sonner for toasts

const singleTemplateOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  coverImageUrl: z.string(),
  layoutJson: templateFormSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const templateListOutputSchema = z.object({
  message: z.string(),
  data: z.array(singleTemplateOutputSchema),
});

// Schema for the response after deleting a single template
export const deleteTemplateOutputSchema = z.object({
  message: z.string(),
  id: z.string(),
});

export const fetchSchema = createSchema({
  '@get/templates': {
    output: templateListOutputSchema,
  },
  // Add schema for the DELETE /templates/{id} endpoint
  '@delete/templates/:id': {
    output: deleteTemplateOutputSchema,
    input: z.object({ id: z.string() }), // Define input for parameter
  },
});


const $fetch = createFetch({
  baseURL: 'http://localhost:3001',
  schema: fetchSchema,
  auth: {
    type: 'Bearer',
    token: async () => {
      const session = await supabase.auth.getSession();
      return session.data.session?.access_token;
    },
  },
});

export function useTemplates() {
  const queryClient = useQueryClient(); // Initialize useQueryClient

  const templatesQuery = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await $fetch('/templates');

      if (error) {
        throw new Error((error).message || 'Failed to fetch templates.');
      }
      const parsedData = templateListOutputSchema.parse(data);
      return parsedData.data;
    },
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false, 
  });

  // New mutation hook for deleting a template
  const deleteTemplateMutation = useMutation<z.infer<typeof deleteTemplateOutputSchema>, Error, string>({
    mutationFn: async (id) => {
      const { data, error } = await $fetch(`/templates/${id}`, {
        method: 'DELETE',
        params: { id }, // Pass the ID as a parameter for the URL
      });

      if (error) {
        throw new Error(error.message || 'Failed to delete template.');
      }
      const parsedData = deleteTemplateOutputSchema.parse(data);
      return parsedData;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Template deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['templates'] }); // Invalidate and refetch the templates list
    },
    onError: (err) => {
      console.error('Error deleting template:', err);
      toast.error(err.message || 'Failed to delete template.');
    },
  });

  return { 
    ...templatesQuery, 
    deleteTemplate: deleteTemplateMutation.mutate, // Expose the delete function
    isDeleting: deleteTemplateMutation.isPending, // Expose loading state for delete
  };
}
