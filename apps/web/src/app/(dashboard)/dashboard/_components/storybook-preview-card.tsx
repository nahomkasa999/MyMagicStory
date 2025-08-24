// app/dashboard/_components/storybook-preview-card.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MoreHorizontal, Eye, Edit, Loader2, Image as ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PreviewImageComponent } from "./preview-image";
import { useEnsurePreviews } from "../_hooks/usePreviews";
import { cn } from "@/lib/utils";
import type { StorybookWithPreviews } from "../../../../../types/preview-types";
import { useRouter } from "next/navigation"; // Import useRouter

interface StorybookPreviewCardProps {
  storybook: StorybookWithPreviews;
  // We'll remove the onView prop and handle navigation directly
  onView?: (storybook: StorybookWithPreviews) => void;
  onEdit?: (storybook: StorybookWithPreviews) => void;
}

export function StorybookPreviewCard({
  storybook,
  onView,
  onEdit,
}: StorybookPreviewCardProps) {
  const router = useRouter(); // Initialize router
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    previews,
    isLoading,
    generatePreviews,
    isGenerating,
  } = useEnsurePreviews(storybook.id, storybook.status === "completed");

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800"
  };

  const statusLabels = {
    completed: "Completed",
    draft: "Draft",
    processing: "Processing"
  };

  const previewImage = previews?.previews?.[0];
  const displayImage = previewImage || (storybook.coverImage ? {
    url: storybook.coverImage,
    pageNumber: 1,
    width: 150,
    height: 112,
  } : null);

  const handleGeneratePreviews = (e: React.MouseEvent) => {
    e.stopPropagation();
    generatePreviews();
  };
  
  // This is the new navigation handler
  const handleView = () => {
    // Navigate to the project page using the storybook ID
    router.push(`/dashboard/project/${storybook.id}`);
  };

  const handleEdit = () => {
    onEdit?.(storybook);
  };

  return (
    <Card className="group hover:shadow-sm transition-shadow duration-200">
      <CardHeader className="p-2 pb-1">
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm line-clamp-2 leading-tight mb-1">
              {storybook.title}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Badge 
                variant="secondary" 
                className={`text-xs px-1 py-0 h-4 ${statusColors[storybook.status]}`}
              >
                {statusLabels[storybook.status]}
              </Badge>
              {previews && (
                <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                  <ImageIcon className="h-2 w-2 mr-1" />
                  WebP
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 pt-0">
        <div 
          className="aspect-[4/3] bg-muted rounded-sm overflow-hidden cursor-pointer"
          onClick={handleView} // This now triggers the new navigation
        >
          {displayImage ? (
            <div className="relative w-full h-full">
              <PreviewImageComponent
                preview={displayImage}
                className="w-full h-full"
                showPageNumber={false}
                priority={false}
                onLoad={() => setImageLoaded(true)}
              />
              
              {previews && previews.previews.length > 1 && (
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {previews.previews.length} pages
                </div>
              )}
              
              {(isLoading || isGenerating) && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <BookOpen className="h-4 w-4 text-muted-foreground mb-2" />
              {storybook.status === "completed" && !isLoading && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-6"
                  onClick={handleGeneratePreviews}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <ImageIcon className="h-3 w-3 mr-1" />
                  )}
                  Generate Preview
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}