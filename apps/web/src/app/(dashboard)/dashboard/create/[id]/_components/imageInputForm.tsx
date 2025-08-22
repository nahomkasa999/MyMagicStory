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
  onSetPreviewStatue: (ispreview: boolean) => void;
  onSuccess?: (result: { blob: Blob }) => void;
}

// Helper to upload a single file to Cloudinary
async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url as string;
}

export default function ImageUploadForm({
  onSuccess,
  onSetPreviewStatue,
}: ImageUploadFormProps) {
  const params = useParams();
  const id = params.id as string;
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      multipleImages: undefined,
       // can now hold multiple files
    },
  });

  const { mutate, isPending, isSuccess } = useCreateStoryBook();

  async function onSubmit(data: FormData) {
    if (!data.multipleImages) return;

    const files = data.multipleImages instanceof FileList ? Array.from(data.multipleImages) : [data.multipleImages];

    // Compress all images first
    const compressedFiles = await Promise.all(files.map(file => compressImage(file)));

    // Upload all compressed images to Cloudinary
    const cloudinaryUrls = await Promise.all(compressedFiles.map(file => uploadToCloudinary(file)));

    //Send the URLs to your backend in a single request
    await mutate({ data: { imageUrls: cloudinaryUrls }, id }, {
      onSuccess: (result) => {
        onSetPreviewStatue(result.isPreview);
        if (result.blob && onSuccess) {
          onSuccess({ blob: result.blob });
        }
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
          multiple={true} // allows multiple files
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
