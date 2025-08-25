import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("User not authenticated");
  }


const verifyAndgenerateHandler = async (sessionId: string, projectId: string ) => {
      if (!sessionId || !projectId || !session?.access_token) {
        throw new Error("Missing required params or session")
      }

      const res = await fetch("http://localhost:3001/payment/verifyandgenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ sessionId, projectId }),
      })

      if (!res.ok) throw new Error("Payment verification failed")
      const result = await res.json()
      if (!result.success) throw new Error("Payment not confirmed")
      return result
    }


export const useVerifierGenerator = (sessionId: string, projectId: string) => {
      return  useQuery({
    queryKey: ["verifyAndGenerate", sessionId, projectId],
    queryFn: () => verifyAndgenerateHandler(sessionId, projectId),
    enabled: !!sessionId && !!projectId && !!session.access_token,
    retry: 1,
  })


}