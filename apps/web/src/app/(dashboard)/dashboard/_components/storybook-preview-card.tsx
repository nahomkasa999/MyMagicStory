// app/dashboard/_components/storybook-preview-card.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StorybookWithPreviews } from "../../../../../types/preview-types";
import { useRouter } from "next/navigation"; // Import useRouter

interface StorybookPreviewCardProps {
  storybook: StorybookWithPreviews;
  onView?: (storybook: StorybookWithPreviews) => void;
  onEdit?: (storybook: StorybookWithPreviews) => void;
}

export function StorybookPreviewCard({
  storybook,
  onView,
  onEdit,
}: StorybookPreviewCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
  };

  const statusLabels = {
    completed: "Completed",
    draft: "Draft",
    processing: "Processing",
  };

  const displayImage = storybook.coverImage
    ? {
        url: storybook.coverImage,
        pageNumber: 1,
        width: 150,
        height: 112,
      }
    : null;

  const handleView = () => {
    router.push(`/dashboard/project/${storybook.id}`);
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
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 pt-0">
        <div
          className="aspect-[4/3] bg-muted rounded-sm overflow-hidden cursor-pointer"
          onClick={handleView}
        >
          {displayImage ? (
            <img
              src={displayImage.url}
              alt={storybook.title}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <BookOpen className="h-4 w-4 text-muted-foreground mb-2" />
              <div className="text-xs h-6 flex flex-row">
                <Eye className="h-3 w-3 mr-1" />
                No Preview
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
