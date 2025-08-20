"use client";

import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CustomFileInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  description?: string;
  multiple?: boolean;
}

export function CustomFileInput({ form, name, label, description, multiple = false }: CustomFileInputProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fieldState = form.watch(name);

  useEffect(() => {
    if (!fieldState) {
      setPreviews([]);
      return;
    }

    let files: File[] = [];
    if (multiple) {
      files = Array.from(fieldState as FileList);
    } else {
      files = [fieldState as File];
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
  }, [fieldState, multiple]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...fieldProps } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="file"
              multiple={multiple}
              {...fieldProps}
              onChange={(event) => {
                const files = event.target.files;
                onChange(multiple ? files : files?.[0]);
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />


          {previews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md border"
                />
              ))}
            </div>
          )}
        </FormItem>
      )}
    />
  );
}