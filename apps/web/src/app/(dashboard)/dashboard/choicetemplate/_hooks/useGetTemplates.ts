import { useQuery } from '@tanstack/react-query';
import { createFetch, createSchema } from '@better-fetch/fetch';
import { templatesResponseSchema } from '../../../../../../types/template-types';
import { supabase } from '@/lib/supabase/supabaseClient';

export const schema = createSchema({
  '/user/templates': {
    output: templatesResponseSchema,
  },
});

const $fetch = createFetch({
  baseURL: 'http://localhost:3001',
  schema,
  throw: true,
  auth: {
    type: 'Bearer',
    token: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token;
    },
  },
});

async function getTemplates() {
  try {
    const data = await $fetch('/user/templates');
    return data;
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    throw new Error('Failed to fetch templates');
  }
}

export function useGetTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: getTemplates,
  });
}