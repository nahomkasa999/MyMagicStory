"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFileInput } from "./file-input";
import { formSchema } from "@mymagicstory/shared/types";
import { Loader2 } from "lucide-react";
import { useCreateStoryBook } from "../_hooks/creatingStoryBook";
import { compressImage } from "@/lib/compresor";

type FormData = z.infer<typeof formSchema>;

interface ImageUploadFormProps {
  onSetPreviewStatue: (isPreview: boolean) => void;
  onSetProjectId: (projectId: string) => void;
  onSuccess?: (result: { blob: Blob }) => void;
}

export default function ImageUploadForm({
  onSuccess,
  onSetPreviewStatue,
  onSetProjectId,
}: ImageUploadFormProps) {
  const params = useParams();
  const templateId = params.id as string;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      multipleImages: undefined,
    },
  });

  const { mutate, isPending, isSuccess } = useCreateStoryBook();

  async function onSubmit(data: FormData) {
  if (!data.multipleImages) return;

  const files = data.multipleImages instanceof FileList ? Array.from(data.multipleImages) : [data.multipleImages];

  // Compress images
  const compressedFiles = await Promise.all(files.map((file) => compressImage(file)));

  // replace original files with compressed files
  const compressedFormData = { ...data, multipleImages: compressedFiles };

  // Send compressed images + id
  await mutate({ data: compressedFormData, id: templateId }, {
    onSuccess: (result) => {
      onSetPreviewStatue(result.isPreview);
      if (result.storybookId) onSetProjectId(result.storybookId);
      if (result.blob && onSuccess) onSuccess({ blob: result.blob });
    },
  });
}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-lg mx-auto p-4 md:p-8 border rounded-lg shadow-md mt-10"
      >
        <h2 className="text-2xl font-bold text-center">Image Upload Form</h2>

        <CustomFileInput
          form={form}
          name="multipleImages"
          label="Upload Images"
          description="Please upload images in .jpg, .png, or .webp format (max 5MB each)."
          multiple={true}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
        </Button>

        {isSuccess && (
          <p className="text-green-500 text-center">
            Storybook created successfully!
          </p>
        )}
      </form>
    </Form>
  );
}
