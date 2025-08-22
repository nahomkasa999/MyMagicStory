  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { useQuery } from "@tanstack/react-query";
  import { z } from "zod";
  import { formSchema } from "@mymagicstory/shared/types";
  import { useGeneratePreviews } from "../../../_hooks/usePreviews";

  type FormData = z.infer<typeof formSchema>;

  interface CreateStoryBookParams {
    data: FormData;
    id: string;
  }

  interface CreateStoryBookResult {
    blob: Blob;
    storybookId: string;
    isPreview: boolean;
  }

  const createStoryBook = async ({ data, id }: CreateStoryBookParams): Promise<CreateStoryBookResult> => {
    // Get auth token from Supabase
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`http://localhost:3001/post-data/${id}`, {
      method: "POST",
      body: data.singleImage,
      headers: {
        "Content-Type": data.singleImage.type,
        "Authorization": `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create story book");
    }

    const blob = await response.blob();
    
    // Get the project ID from response headers
    const projectId = response.headers.get("X-Project-Id");
    // const isPreview = response.headers.get("X-Preview")
    const isPreview = response.headers.get("X-Preview")
    
    // Return both the blob and the actual project ID
    return {
      blob,
      storybookId: projectId || id, // Fallback to template ID if project ID not found
      isPreview: !!isPreview
    };
  };

  export const useCreateStoryBook = () => {
    const queryClient = useQueryClient();
    const generatePreviews = useGeneratePreviews();

    return useMutation({
      mutationFn: createStoryBook,
      onSuccess: (result) => {
        // Invalidate storybooks query to refresh the dashboard
        queryClient.invalidateQueries({ queryKey: ["userStorybooks"] });
        
        // Auto-generate previews for the newly created storybook
        // We'll do this with a slight delay to ensure the PDF is fully processed
        setTimeout(() => {
          generatePreviews.mutate(result.storybookId);
        }, 2000);
      },
    });
  };



