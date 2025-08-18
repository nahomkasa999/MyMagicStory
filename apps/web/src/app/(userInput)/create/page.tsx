"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFileInput } from "./_components/file-input";
import { formSchema } from "@mymagicstory/shared/types";
import { Loader2 } from "lucide-react";
import { useCreateStoryBook } from "./_hooks/creatingStoryBook";

type FormData = z.infer<typeof formSchema>;

export default function ImageUploadForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      singleImage: undefined,
    },
  });

  const { mutate, isPending, isSuccess } = useCreateStoryBook();

  function onSubmit(data: FormData) {
    mutate(data, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "storybook.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
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
          name="singleImage"
          label="Upload a Single Image"
          description="Please upload one image in .jpg, .png, or .webp format (max 5MB)."
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