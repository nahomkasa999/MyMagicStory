"use client";

import React, { useState, useMemo } from 'react';
import { ContentProjectHeader } from './_Components/content-project-header';
import { ContentProjectFilters } from './_Components/content-project-filters';
import { ProjectTable, Project } from './_Components/project-table';
import { Card } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";


// Mock data for projects (from the AI reference, expanded slightly for more filter options)
const mockProjects: Project[] = [
  {
    id: "proj_001",
    title: "The Magic Forest Adventure",
    user: "john.doe@example.com",
    status: "COMPLETED",
    generationDate: "2024-01-16",
    pageCount: 12,
    fileSize: "5.2 MB",
  },
  {
    id: "proj_002",
    title: "Space Explorer's Journey",
    user: "jane.smith@example.com",
    status: "PENDING",
    generationDate: "2024-01-16",
    pageCount: 8,
    fileSize: "3.1 MB",
  },
  {
    id: "proj_003",
    title: "Underwater Mystery",
    user: "mike.wilson@example.com",
    status: "FAILED",
    generationDate: "2024-01-15",
    pageCount: 0,
    fileSize: "0 MB",
  },
  {
    id: "proj_004",
    title: "The Haunted Mansion",
    user: "alice.johnson@example.com",
    status: "COMPLETED",
    generationDate: "2024-01-14",
    pageCount: 20,
    fileSize: "7.8 MB",
  },
  {
    id: "proj_005",
    title: "Robot's First Day",
    user: "bob.brown@example.com",
    status: "DRAFT", // New status
    generationDate: "2024-01-13",
    pageCount: 5,
    fileSize: "1.5 MB",
  },
  {
    id: "proj_006",
    title: "Ancient City Unveiled",
    user: "charlie.davis@example.com",
    status: "PENDING",
    generationDate: "2024-01-12",
    pageCount: 15,
    fileSize: "6.0 MB",
  },
];

function ContentProjectPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagesFilter, setPagesFilter] = useState("all");

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || project.status === statusFilter;

      const matchesPages = () => {
        if (pagesFilter === "all") return true;
        if (pagesFilter === "1-10") return project.pageCount >= 1 && project.pageCount <= 10;
        if (pagesFilter === "11-20") return project.pageCount >= 11 && project.pageCount <= 20;
        if (pagesFilter === "21+") return project.pageCount >= 21;
        return false;
      };

      return matchesSearch && matchesStatus && matchesPages();
    });
  }, [searchQuery, statusFilter, pagesFilter]);

  return (
    <div className="space-y-6">
      <ContentProjectHeader />
      <ContentProjectFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        pagesFilter={pagesFilter}
        setPagesFilter={setPagesFilter}
      />

      {filteredProjects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground text-center mb-6">
            Try adjusting your search or filter criteria.
          </p>
        </Card>
      ) : (
        <ProjectTable projects={filteredProjects} />
      )}
    </div>
  );
}

export default ContentProjectPage;
