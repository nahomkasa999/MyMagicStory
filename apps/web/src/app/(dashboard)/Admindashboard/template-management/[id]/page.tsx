'use client';

import React from 'react';
import { useParams } from 'next/navigation'; // To get the dynamic ID from the URL
import { useTemplateById } from './_hooks/useTemplateById'; // Import the new hook
import { Loader2 } from 'lucide-react';
// Removed Card, CardContent, CardDescription, CardHeader, CardTitle, Separator as the form component handles the display
import { TemplateEditForm } from './_components/template-edit-form';// Import the new edit form component

/**
 * Main page component for displaying and editing a single story template.
 * Fetches template data based on the dynamic ID in the URL.
 */
export default function TemplateDetailPage() {
  const params = useParams();
  const templateId = Array.isArray(params.id) ? params.id[0] : params.id; // Handle potential array for dynamic route

  const { data: template, isLoading, isError, error } = useTemplateById(templateId as string);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading template details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-red-500 flex-col">
        <h2 className="text-xl font-semibold mb-2">Error Loading Template</h2>
        <p>There was an issue fetching the template: {error?.message}</p>
        <p className="text-sm text-muted-foreground mt-1">Please check the template ID or your network connection.</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-muted-foreground flex-col">
        <h2 className="text-xl font-semibold mb-2">Template Not Found</h2>
        <p>No template was found for the given ID.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Pass the fetched template data to the edit form component */}
      <TemplateEditForm template={template} />
    </div>
  );
}
