"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StorybookWithPreviews } from "../../../../../types/preview-types";

interface StorybookPreviewGridProps {
  storybook: StorybookWithPreviews;
  className?: string;
  maxPreviewsToShow?: number;
  onPreviewClick?: (pageNumber: number) => void;
}

export function StorybookPreviewGrid({
  storybook,
  className,
  maxPreviewsToShow = 4,
  onPreviewClick,
}: StorybookPreviewGridProps) {

  const handlePreviewClick = (pageNumber: number) => {
    onPreviewClick?.(pageNumber);
  };

  const pagesToShow = Math.min(storybook.pageCount, maxPreviewsToShow);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{storybook.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {storybook.pageCount} pages
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {storybook.status === "completed" ? "WebP" : "Draft"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {Array.from({ length: pagesToShow }).map((_, index) => (
            <div
              key={index}
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => handlePreviewClick(index + 1)}
            >
              <div className="aspect-[3/4] bg-muted rounded-sm flex items-center justify-center text-muted-foreground">
                {/* Conditionally render the preview image for the first page */}
                {index === 0 && storybook.coverImage ? (
                  <img
                    src={storybook.coverImage}
                    alt={`${storybook.title} Page 1 Preview`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs mt-1">Page {index + 1}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          {storybook.pageCount > maxPreviewsToShow && (
            <div className="text-xs text-muted-foreground">
              +{storybook.pageCount - maxPreviewsToShow} more pages
            </div>
          )}
          <Button size="sm" variant="default">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}