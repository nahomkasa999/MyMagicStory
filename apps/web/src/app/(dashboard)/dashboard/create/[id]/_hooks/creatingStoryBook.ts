import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { formSchema } from "@mymagicstory/shared/types";

type FormData = z.infer<typeof formSchema>;

interface CreateStoryBookParams {
  data: {
    imageUrls: string[];
  };
  id: string;
}

interface CreateStoryBookResult {
  blob: Blob;
  storybookId: string;
  isPreview: boolean;
}

const createStoryBook = async ({
  data,
  id,
}: CreateStoryBookParams): Promise<CreateStoryBookResult> => {
  const { createClient } = await import("@supabase/supabase-js");
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
  const response = await fetch(`http://localhost:3001/post-data/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ imageUrls: data.imageUrls }),
  });

  if (!response.ok) {
    throw new Error("Failed to create story book");
  }

 
  const json = await response.json();
  console.log("Full response JSON:", json);


  const blob = new Blob(
    [Uint8Array.from(atob(json.pdfBase64), (c) => c.charCodeAt(0))],
    { type: "application/pdf" }
  );
  console.log("Blob object:", blob);

  return {
    blob,
    storybookId: json.projectId || id,
    isPreview: json.isPreview,
  };
};

export const useCreateStoryBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStoryBook,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["userStorybooks"] });
    },
  });
};
