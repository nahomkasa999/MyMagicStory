"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader2, AlertCircle } from "lucide-react";
import type { PreviewImage, PreviewLoadingState } from "../../../../../types/preview-types";

interface PreviewImageProps {
  preview: PreviewImage;
  className?: string;
  showPageNumber?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function PreviewImageComponent({
  preview,
  className,
  showPageNumber = true,
  priority = false,
  onLoad,
  onError,
}: PreviewImageProps) {
  const [loadingState, setLoadingState] = useState<PreviewLoadingState>("loading");

  const handleLoad = useCallback(() => {
    setLoadingState("loaded");
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setLoadingState("error");
    onError?.();
  }, [onError]);

  return (
    <div className={cn("relative group", className)}>
      {/* Loading State */}
      {loadingState === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-md">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {loadingState === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-md">
          <AlertCircle className="h-6 w-6 text-destructive mb-2" />
          <p className="text-xs text-muted-foreground text-center">
            Failed to load preview
          </p>
        </div>
      )}

      {/* Image */}
      <div className={cn(
        "relative overflow-hidden rounded-md transition-opacity duration-300",
        loadingState === "loaded" ? "opacity-100" : "opacity-0"
      )}>
        <Image
          src={preview.url}
          alt={`Page ${preview.pageNumber}`}
          width={preview.width}
          height={preview.height}
          className="w-full h-auto object-cover"
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />

        {/* Page Number Overlay */}
        {showPageNumber && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Page {preview.pageNumber}
          </div>
        )}
      </div>
    </div>
  );
}