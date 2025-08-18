"use client";

import { supabase } from "@/lib/supabase/supabaseClient";
import { ReactNode, useEffect } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          document.cookie = `sb-access-token=${session.access_token}; path=/`;
        } else {
          document.cookie = "sb-access-token=; Max-Age=0; path=/";
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
