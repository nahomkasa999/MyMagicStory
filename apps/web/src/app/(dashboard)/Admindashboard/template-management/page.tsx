"use client"

import React, { useState, useMemo } from 'react'
import { Template, TemplateGrid } from './_Components/admin-template-grid'
import { TemplateManagementHeader } from './_Components/admin-template-header'; 
import { useRouter } from 'next/navigation';
import { useTemplates } from './_hooks/useTemplateStorybook'; 
import { Loader2 } from 'lucide-react'; // For loading indicator

function AdminTemplate() {
  const [searchQuery, setSearchQuery] = useState("");
  // Removed statusFilter and setStatusFilter as it's not supported by backend StoryTemplate model
  const router = useRouter(); 

  const { data: templates, isLoading, isError, error } = useTemplates(); // Use the new hook


  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    return templates.filter((template) => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, templates]); // Depend on templates and searchQuery

  const handleCreateTemplate = () => {
    router.push('/Admindashboard/template-management/create');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading templates...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-500">
        <p>Error loading templates: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TemplateManagementHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateTemplate={handleCreateTemplate}
      />
      <TemplateGrid templates={filteredTemplates} />
    </div>
  );
}

export default AdminTemplate;
