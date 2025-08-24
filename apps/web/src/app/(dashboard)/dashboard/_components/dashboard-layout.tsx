// app/dashboard/_components/dashboard-layout.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { StorybooksGridWithPreviews } from "./storybooks-grid-with-previews";

import type { FrontendUser, FrontendStorybook } from "../../../../../types/dashboard-types";
import type { StorybookWithPreviews } from "../../../../../types/preview-types";
import React from "react"; // 1. Import React to use React.ReactNode

type User = FrontendUser;
type Storybook = FrontendStorybook;

interface DashboardLayoutProps {
  user: User;
  storybooks: Storybook[];
  children?: React.ReactNode; // 2. Add children prop as optional
}

// Transform FrontendStorybook to StorybookWithPreviews
function transformToStorybookWithPreviews(storybooks: Storybook[]): StorybookWithPreviews[] {
  return storybooks.map(storybook => ({
    ...storybook,
    hasWebPPreviews: false,
    previews: undefined,
  }));
}

export function DashboardLayout({ user, storybooks, children }: DashboardLayoutProps) { // 3. Destructure the children prop
  const router = useRouter();
  
  const storybooksWithPreviews = transformToStorybookWithPreviews(storybooks);

  const handleViewStorybook = (storybook: StorybookWithPreviews) => {
    // Navigate to storybook view page (to be implemented)
    console.log("View storybook:", storybook.id);
  };

  const handleEditStorybook = (storybook: StorybookWithPreviews) => {
    // Navigate to storybook edit page (to be implemented)
    console.log("Edit storybook:", storybook.id);
  };
  
  return (
    <div className="space-y-3">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight">My Storybooks</h1>
          <p className="text-xs text-muted-foreground">
            Manage and view your magical storybook collection with WebP previews
          </p>
        </div>
        
        <Button
          size="sm"
          className="sm:w-auto h-7 text-xs"
          onClick={() => router.push("/dashboard/choicetemplate")}
        >
          <Plus className="h-3 w-3 mr-1" />
          Create New Storybook
        </Button>
      </div>
      
      {/* Storybooks Grid (Conditionally rendered) */}
      {/* 4. Render the children prop if it exists, otherwise render the grid */}
      {children || (storybooksWithPreviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No storybooks yet</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            Start creating your magical storybooks by choosing a template and adding your own content.
          </p>
          <Button
            onClick={() => router.push("/dashboard/choicetemplate")}
            className="h-9"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Storybook
          </Button>
        </div>
      ) : (
        <StorybooksGridWithPreviews
          storybooks={storybooksWithPreviews}
          onViewStorybook={handleViewStorybook}
          onEditStorybook={handleEditStorybook}
        />
      ))}
    </div>
  );
}