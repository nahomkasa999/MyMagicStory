"use client";

import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabaseClient";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";
import { toast } from "sonner";
import { signupSchema, userResponseSchema } from "../../../../types/authtypes";
import { useRouter } from "next/navigation";
import type { UserResponse } from "@supabase/supabase-js";

// --- API Schema and Fetch Instance ---
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

// --- Mutation Functions ---
interface SignupArgs {
  username: string;
  email: string;
  password: string;
}

async function signupUser({ username, email, password }: SignupArgs) {
  toast("Signing up...");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });
  if (error) {
    throw error;
  }
  return data;
}

interface LoginArgs {
  email: string;
  password: string;
}

async function loginUser({ email, password }: LoginArgs) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
}

interface ResetPasswordArgs {
  email: string;
}

async function resetPasswordEmail({ email }: ResetPasswordArgs) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) {
    throw error;
  }
}

interface ChangePasswordArgs {
  currentPassword: string;
  newPassword: string;
}

async function changePasswordUser({ currentPassword, newPassword }: ChangePasswordArgs) {
  // First verify current password by attempting to sign in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    throw new Error("No user found");
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    throw new Error("Current password is incorrect");
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }
}

async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

// --- React Query Hook ---//
export function useAuth() {
  const router = useRouter();

  const signup = useMutation({
    mutationFn: signupUser,
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
        toast.success(
          "Signed up successfully. Please check your email to confirm."
        );
      } catch (error: any) {
        console.log(error)
        toast.success(
          "Signed up successfully. Please check your email to confirm."
        );
      }
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Signing up failed. Internal error");
    },
  });

  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      toast.success("Login successful!");
    },
    onError: () => {
      toast.error("Login failed. Please check your credentials");
    },
  });

  const resetPassword = useMutation({
    mutationFn: resetPasswordEmail,
    onSuccess: () => {
      toast.success("Password reset email sent! Check your inbox.");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to send reset email. Please try again.");
    },
  });

  const changePassword = useMutation({
    mutationFn: changePasswordUser,
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(
        err.message || "Failed to update password. Please try again."
      );
    },
  });

  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success("Logged out successfully!");
      router.push("/");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to logout. Please try again.");
    },
  });

  return { signup, login, resetPassword, changePassword, logout };
}