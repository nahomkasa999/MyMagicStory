'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  ageGroup: z.string().min(1, 'Age group is required'),
  structure: z.array(z.object({ value: z.string().min(1, 'Chapter title is required') })).min(1),
  prompts: z.array(z.object({ value: z.string().min(1, 'Prompt is required') })).min(1),
});

export function TemplateForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      ageGroup: '',
      structure: [{ value: '' }],
      prompts: [{ value: '' }],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Space Adventure" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A short description of the template." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ageGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an age group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-8">6-8 years</SelectItem>
                  <SelectItem value="9-12">9-12 years</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Template Structure</h3>
          {form.watch('structure').map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`structure.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mb-2">
                  <FormControl>
                    <Input placeholder={`Chapter ${index + 1}`} {...field} />
                  </FormControl>
                  <Button type="button" variant="ghost" size="icon" onClick={() => {
                    const structure = form.getValues('structure');
                    form.setValue('structure', structure.filter((_, i) => i !== index));
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => form.setValue('structure', [...form.getValues('structure'), { value: '' }])}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Chapter
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Sample Prompts</h3>
          {form.watch('prompts').map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`prompts.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mb-2">
                  <FormControl>
                    <Input placeholder={`Prompt ${index + 1}`} {...field} />
                  </FormControl>
                  <Button type="button" variant="ghost" size="icon" onClick={() => {
                    const prompts = form.getValues('prompts');
                    form.setValue('prompts', prompts.filter((_, i) => i !== index));
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => form.setValue('prompts', [...form.getValues('prompts'), { value: '' }])}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Prompt
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