'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  templateFormSchema,
  TemplateFormValues,
} from '../../../../../../types/template-form-schema';
import { useTemplate } from '../_hooks/useTemplate';

export function TemplateForm() {
  const [jsonInput, setJsonInput] = useState('');
  const { createTemplate } = useTemplate();
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
      pages: [{ type: 'text', content: '', linkToPrevious: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'pages',
  });

  function onSubmit(values: TemplateFormValues) {
    createTemplate.mutate(values);
  }

  function loadJson() {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const { storybook, pages } = parsedJson;

      const formValues = {
        title: storybook.title,
        globalStyle: storybook.globalStyle,
        pages: pages.map((page: any) => ({
          type: page.text ? 'text' : 'image',
          content: page.text || page.imagePrompt,
          linkToPrevious: false,
        })),
      };

      form.reset(formValues);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* JSON Loader Section */}
        <div className="p-4 border rounded-md space-y-4">
          <h2 className="text-xl font-semibold">Load from JSON</h2>
          <Textarea
            placeholder="Paste your JSON here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={10}
          />
          <Button type="button" onClick={loadJson}>
            Load from JSON
          </Button>
        </div>

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
          <h2 className="text-xl font-semibold">Page Level Style</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md relative">
              <h3 className="font-medium">Page {index + 1}</h3>
              <div className="space-y-4 mt-2">
                <FormField
                  control={form.control}
                  name={`pages.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pages.${index}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch(`pages.${index}.type`) === 'image'
                          ? 'Image Description'
                          : 'Text'}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            form.watch(`pages.${index}.type`) === 'image'
                              ? 'e.g., A blue rocket ship flying through a purple galaxy.'
                              : 'e.g., Once upon a time, in a land far away...'
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {index > 0 && (
                  <FormField
                    control={form.control}
                    name={`pages.${index}.linkToPrevious`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Link to Previous Page</FormLabel>
                          <FormDescription>
                            Connect this page's content to the previous one.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
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
            onClick={() => append({ type: 'text', content: '', linkToPrevious: false })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Page
          </Button>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Create Template</Button>
        </div>
      </form>
    </Form>
  );
}