'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { templateFormSchema, TemplateFormValues } from '@mymagicstory/shared/types';
import { Template, useUpdateTemplate } from '../_hooks/useTemplateById';

interface TemplateEditFormProps {
  template: Template;
}

export function TemplateEditForm({ template }: TemplateEditFormProps) {
  const { updateTemplate, isUpdating } = useUpdateTemplate();
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      title: '',
      globalStyle: {
        tone: '',
        colorPalette: '',
        lighting: '',
        shading: '',
        consistency: '',
      },
      pages: [],
    },
  });

  useEffect(() => {
    if (template) {
      form.reset({
        ...template.layoutJson,
        title: template.title,
      });
    }
  }, [template, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'pages',
  });

  function onSubmit(values: TemplateFormValues) {
    updateTemplate({ id: template.id, values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Template Title Section */}
        <div className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold">Template Title</h2>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., The Lost Astronaut" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Global Style Section */}
        <div className="p-4 border rounded-md space-y-4">
          <h2 className="text-xl font-semibold">Global Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="globalStyle.tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Whimsical, Adventurous" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="globalStyle.colorPalette"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Palette</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Pastel, Vibrant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="globalStyle.lighting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lighting</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Soft, Dramatic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="globalStyle.shading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shading</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cel-shaded, Realistic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="globalStyle.consistency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consistency</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., High, Medium" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Page Level Style Section */}
        <div className="p-4 border rounded-md space-y-4">
          <h2 className="text-xl font-semibold">Page Details</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md relative">
              <h3 className="font-medium">Page {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <FormField
                  control={form.control}
                  name={`pages.${index}.page`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Number</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pages.${index}.side`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Side</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select side" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full">Full</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name={`pages.${index}.spread.firstPage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spread Start Page</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pages.${index}.spread.lastPage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spread End Page</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name={`pages.${index}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Once upon a time, in a land far away..."
                          {...field}
                          value={field.value ?? ''} // Ensure the value is a string
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pages.${index}.imagePrompt`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Prompt (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A blue rocket ship flying through a purple galaxy."
                          {...field}
                          value={field.value ?? ''} // Ensure the value is a string
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ page: fields.length + 1, spread: { firstPage: fields.length + 1, lastPage: fields.length + 2 }, side: 'full' })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Page
          </Button>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Template'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
