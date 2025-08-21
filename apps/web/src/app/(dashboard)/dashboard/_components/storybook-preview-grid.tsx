"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Eye, BookOpen } from "lucide-react";
import { PreviewImageComponent } from "./preview-image";
import { useEnsurePreviews } from "../_hooks/usePreviews";
import { cn } from "@/lib/utils";
import type { StorybookWithPreviews } from "../../../../../types/preview-types";

interface StorybookPreviewGridProps {
  storybook: StorybookWithPreviews;
  className?: string;
  maxPreviewsToShow?: number;
  showGenerateButton?: boolean;
  onPreviewClick?: (pageNumber: number) => void;
}

export function StorybookPreviewGrid({
  storybook,
  className,
  maxPreviewsToShow = 4,
  showGenerateButton = true,
  onPreviewClick,
}: StorybookPreviewGridProps) {
  const [loadedCount, setLoadedCount] = useState(0);
  
  const {
    previews,
    isLoading,
    error,
    generatePreviews,
    isGenerating,
    hasError,
  } = useEnsurePreviews(storybook.id, false);

  const handleImageLoad = () => {
    setLoadedCount(prev => prev + 1);
  };

  const handlePreviewClick = (pageNumber: number) => {
    onPreviewClick?.(pageNumber);
  };

  // Show loading state
  if (isLoading && !previews) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading previews...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Show error state
  if (hasError && !previews) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex flex-col items-center justify-center py-8">
          <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-4">
            Failed to load previews
          </p>
          {showGenerateButton && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => generatePreviews()}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Retry
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Show no previews state
  if (!previews || previews.previews.length === 0) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex flex-col items-center justify-center py-8">
          <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            No previews available
          </p>
          <p className="text-xs text-muted-foreground mb-4 text-center">
            Generate WebP previews to see your storybook pages
          </p>
          {showGenerateButton && (
            <Button
              size="sm"
              onClick={() => generatePreviews()}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Generate Previews
            </Button>
          )}
        </div>
      </Card>
    );
  }

  const previewsToShow = previews.previews.slice(0, maxPreviewsToShow);
  const hasMorePreviews = previews.previews.length > maxPreviewsToShow;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{storybook.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {previews.totalPages} pages • {loadedCount}/{previewsToShow.length} loaded
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              WebP
            </Badge>
            {isGenerating && (
              <Badge variant="outline" className="text-xs">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Generating
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {previewsToShow.map((preview, index) => (
            <div
              key={preview.pageNumber}
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => handlePreviewClick(preview.pageNumber)}
            >
              <PreviewImageComponent
                preview={preview}
                className="aspect-[3/4]"
                showPageNumber={true}
                priority={index < 2}
                onLoad={handleImageLoad}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {hasMorePreviews && (
              <span>+{previews.previews.length - maxPreviewsToShow} more pages</span>
            )}
          </div>
          
          <div className="flex gap-2">
            {showGenerateButton && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => generatePreviews()}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerate
              </Button>
            )}
            
            <Button size="sm" variant="default">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}