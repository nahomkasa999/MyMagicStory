"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  PDFViewerProps,
  PDFViewerState,
} from "../../../../../../../types/pdf-viewer-types";
import { Loader2 } from "lucide-react";
import { usePreviews } from "../../../_hooks/usePreviews";
import Image from "next/image";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.93/build/pdf.worker.min.mjs`;

interface PDFViewerPropsUpdated {
  projectId?: string;
  pdfPath?: string;
  className?: string;
}

export default function PDFViewer({
  projectId,
  pdfPath,
  className = "",
}: PDFViewerPropsUpdated) {
  const [state, setState] = useState<PDFViewerState>({
    isLoading: true,
    error: null,
    numPages: null,
    currentPage: 1,
  });

  const {
    data: previews,
    isLoading: previewsLoading,
    error: previewsError,
  } = usePreviews(projectId || "");

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      numPages,
    }));
  };

  const onDocumentLoadError = (error: Error) => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      error: error.message,
    }));
  };

  // Render preview images
  const renderPreviewImages = () => {
    if (!previews?.previews) return null;

    return previews.previews
      .map((preview, index) => {
        const blur = index >= 1; // blur after 3rd page
        return (
          <div key={index} className="mb-4 relative">
            <Image
              src={`https://via.placeholder.com/600x800.png?text=Page+${preview.pageNumber}`}
              alt={`Page ${preview.pageNumber}`}
              width={preview.width}
              height={preview.height}
              className={`w-full h-auto max-w-[800px] mx-auto transition-all duration-300 opacity-[0.2] ${blur ? "blur-sm" : ""}`}
              priority={index < 2}
            />
            {blur && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Button
                  className="text-lg font-semibold"
                  onClick={() => (window.location.href = "/api/checkout")} // <-- Stripe checkout route
                >
                  Subscribe to get full PDF
                </Button>
              </div>
            )}

            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              Page {preview.pageNumber}
            </div>
          </div>
        );
      })
      .slice(0, 3); // limit to 3 pages
  };

  const renderAllPages = () => {
    if (!state.numPages) return null;

    const pages = [];
    for (let i = 1; i <= state.numPages && i <= 3; i++) {
      // limit 3 pages
      const isBlur = i > 2;
      pages.push(
        <div key={i} className="mb-4 relative">
          <Page
            pageNumber={i}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className={`shadow-lg transition-all duration-300 ${isBlur ? "blur-sm" : ""}`}
            width={Math.min(
              800,
              typeof window !== "undefined" ? window.innerWidth - 100 : 800
            )}
          />
          {isBlur && (
            <div className="absolute inset-0 flex items-center justify-center bg-opacity-1 text-primary text-3xl font-extrabold ">
              Subscribe to get full PDF
            </div>
          )}
        </div>
      );
    }
    return pages;
  };

  if (projectId && previewsLoading) {
    return (
      <div
        className={`flex items-center justify-center p-8 border rounded-lg bg-gray-50 ${className}`}
      >
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin h-6 w-6" />
          <span>Loading storybook...</span>
        </div>
      </div>
    );
  }

  if (state.error || (projectId && previewsError)) {
    return (
      <div
        className={`flex items-center justify-center p-8 border rounded-lg bg-red-50 ${className}`}
      >
        <p className="text-red-600">
          Error loading storybook: {state.error || previewsError?.message}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative border rounded-lg overflow-hidden bg-white ${className}`}
    >
      {state.isLoading && !projectId && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="flex items-center space-x-2">
            <Loader2 className="animate-spin h-6 w-6" />
            <span>Loading PDF...</span>
          </div>
        </div>
      )}

      <div className="max-h-[1200px] overflow-y-auto p-4">
        <div className="flex flex-col items-center">
          {projectId && previews?.previews ? (
            <>
              {renderPreviewImages()}
              <div className="mt-4 text-sm text-gray-600 text-center">
                Total Pages: {previews.totalPages}
              </div>
            </>
          ) : (
            <>
              <Document
                file={pdfPath || "/storybook.pdf"}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="animate-spin h-6 w-6" />
                  </div>
                }
              >
                {renderAllPages()}
              </Document>

              {state.numPages && (
                <div className="mt-4 text-sm text-gray-600 text-center">
                  Total Pages: {state.numPages}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
