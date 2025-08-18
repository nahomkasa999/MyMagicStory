"use client";

import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabaseClient";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";
import { toast } from "sonner";
import { signupSchema, userResponseSchema } from "../../../../types/authtypes"; //convert it to @ if possible
import { useRouter } from 'next/navigation'


export const schema = createSchema({
  "/signup": {
    input: signupSchema,
    output: userResponseSchema,
  },
});

const $fetch = createFetch({
  baseURL: "http://localhost:3001",
  schema,
});

export function useAuth() {
  const router = useRouter()
  const signup = useMutation({
    mutationFn: async ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => {
        toast("hellow")
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: async (supabaseResponse) => {

      const user = supabaseResponse.user;
      
      if (!user) {
        toast.error("No user returned from Supabase");
        return;
      }
      try {
          await $fetch("/signup", {
        body: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.username ?? null,
          role: "USER",
          avatarUrl: user.user_metadata?.avatar_url ?? undefined,
        },
      });
      } catch (error: any) {
        toast.error(error.message)
      }
      toast.success(
        "Signed up successfully. Please check your email to confirm."
      );
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Signing up failed. Internal error");
    },
  });

  const login = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Login successful!");
    },
    onError: () => {
      toast.error("Login failed. Please check your credentials");
    },
  });

  return { signup, login };
}
