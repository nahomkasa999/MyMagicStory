"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import { StorybookPreviewCard } from "./storybook-preview-card";
import type { StorybookWithPreviews } from "../../../../../types/preview-types";

interface StorybooksGridWithPreviewsProps {
  storybooks: StorybookWithPreviews[];
  onViewStorybook?: (storybook: StorybookWithPreviews) => void;
  onEditStorybook?: (storybook: StorybookWithPreviews) => void;
}

export function StorybooksGridWithPreviews({ 
  storybooks, 
  onViewStorybook,
  onEditStorybook 
}: StorybooksGridWithPreviewsProps) {
  if (storybooks.length === 0) {
    return (
      <Card className="p-4 text-center">
        <div className="flex flex-col items-center space-y-2">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-semibold">No storybooks yet</h3>
            <p className="text-xs text-muted-foreground">Create your first magical storybook to get started!</p>
          </div>
          <Button size="sm" className="h-6 text-xs">Create Storybook</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {storybooks.map((storybook) => (
        <StorybookPreviewCard
          key={storybook.id}
          storybook={storybook}
          onView={onViewStorybook}
          onEdit={onEditStorybook}
        />
      ))}
    </div>
  );
}