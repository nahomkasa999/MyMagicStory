"use client";

import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabaseClient";
import { toast } from "sonner"

export function useAuth() {
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
      console.log(username, email, password);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("signed up successful, please check your email and comfirm your email.")
    },
    onError: () => {
      toast.error("signing up failed. Internal Error ")
    }
  });

  const login = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

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
