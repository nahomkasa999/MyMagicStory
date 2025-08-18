import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { formSchema } from "@mymagicstory/shared/types";

type FormData = z.infer<typeof formSchema>;

const createStoryBook = async (data: FormData) => {
  const response = await fetch("http://localhost:3001/post-data", {
    method: "POST",
    body: data.singleImage,
    headers: {
      "Content-Type": data.singleImage.type,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create story book");
  }

  return response.blob();
};

export const useCreateStoryBook = () => {
  return useMutation({
    mutationFn: createStoryBook,
  });
};