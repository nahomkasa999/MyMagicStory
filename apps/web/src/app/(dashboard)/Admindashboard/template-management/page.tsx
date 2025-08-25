"use client"

import React, { useState, useMemo } from 'react'
import { Template, TemplateGrid } from './_Components/admin-template-grid'
import { TemplateManagementHeader } from './_Components/admin-template-header'; 

// Mock data for demonstration
const mockTemplates: Template[] = [
  { id: "1", name: "Business Report", status: "published", thumbnail: "https://placehold.co/400x200?text=Business+Report" },
  { id: "2", name: "Marketing Plan", status: "draft", thumbnail: "https://placehold.co/400x200?text=Marketing+Plan" },
  { id: "3", name: "Invoice Template", status: "published", thumbnail: "https://placehold.co/400x200?text=Invoice+Template" },
  { id: "4", name: "Portfolio Layout", status: "draft", thumbnail: "https://placehold.co/400x200?text=Portfolio+Layout" },
  { id: "5", name: "Proposal Document", status: "published", thumbnail: "https://placehold.co/400x200?text=Proposal+Document" },
];

function AdminTemplate() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter templates based on search query and status filter
  const filteredTemplates = useMemo(() => {
    return mockTemplates.filter((template) => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || template.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const handleCreateTemplate = () => {
    // Implement logic to create a new template here
    console.log("Create new template clicked!");
  };

  return (
    <div className="space-y-6">
      <TemplateManagementHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onCreateTemplate={handleCreateTemplate}
      />
      <TemplateGrid templates={filteredTemplates} />
    </div>
  );
}

export default AdminTemplate;