'use client';

import { useMutation } from '@tanstack/react-query';
import { createFetch, createSchema } from '@better-fetch/fetch';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  templateFormSchema,
  pageSchema,
} from '@mymagicstory/shared/types';
import { supabase } from '@/lib/supabase/supabaseClient';
import { useRouter } from 'next/navigation'; // ✅ use next/navigation in App Router

export const schema = createSchema({
  '@post/templates': {
    input: templateFormSchema,
    output: z.object({
      message: z.string(),
      data: z.object({
        id: z.string(),
        title: z.string(),
        layoutJson: z.object({
          globalStyle: templateFormSchema.shape.globalStyle,
          pages: z.array(pageSchema),
        }),
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
  const router = useRouter(); 

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
      console.log(data);
      toast.success('Template created successfully!');
      router.push('/Admindashboard/template-managment');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || 'Template creation failed. Internal error');
    },
  });

  return { createTemplate };
}
