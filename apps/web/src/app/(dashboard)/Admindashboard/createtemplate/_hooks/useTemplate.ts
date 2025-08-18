'use client';

import { useMutation } from '@tanstack/react-query';
import { createFetch, createSchema } from '@better-fetch/fetch';
import { z } from 'zod';
import { toast } from 'sonner';
import { templateFormSchema } from '../../../../../../types/template-form-schema';
import { supabase } from '@/lib/supabase/supabaseClient';

export const schema = createSchema({
  '@post/templates': {
    input: templateFormSchema,
    output: z.object({
      message: z.string(),
      data: z.object({
        id: z.string(),
        title: z.string(),
        layoutJson: z.any(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
    }),
  },
});

const $fetch = createFetch({
  baseURL: 'http://localhost:3001',
  schema,
  auth: {
    type: 'Bearer',
    token: async () => {
      const session = await supabase.auth.getSession();
      return session.data.session?.access_token;
    },
  },
});

export function useTemplate() {
  const createTemplate = useMutation({
    mutationFn: async (values: z.infer<typeof templateFormSchema>) => {
      const { data, error } = await $fetch('/templates', {
        body: values,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      console.log(data!.message!)
      toast.success('Template created successfully!');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || 'Template creation failed. Internal error');
    },
  });

  return { createTemplate };
}