import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabaseClient";

async function fetchPrivateData() {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  const res = await fetch("http://localhost:3001/private", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export function usePrivateData() {
  return useQuery({ queryKey: ["privateData"], queryFn: fetchPrivateData });
}
