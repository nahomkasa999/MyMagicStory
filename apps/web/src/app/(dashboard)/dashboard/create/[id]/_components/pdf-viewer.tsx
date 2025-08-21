"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFViewerProps, PDFViewerState } from "../../../../../../../types/pdf-viewer-types";
import { Loader2 } from "lucide-react";
import { usePreviews } from "../../../_hooks/usePreviews";
import Image from "next/image";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.93/build/pdf.worker.min.mjs`;

interface PDFViewerPropsUpdated {
  projectId?: string;
  pdfPath?: string;
  className?: string;
}

export default function PDFViewer({ projectId, pdfPath, className = "" }: PDFViewerPropsUpdated) {
  const [state, setState] = useState<PDFViewerState>({
    isLoading: true,
    error: null,
    numPages: null,
    currentPage: 1,
  });

  // Fetch previews if projectId is provided
  const { data: previews, isLoading: previewsLoading, error: previewsError } = usePreviews(
    projectId || ""
  );

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      numPages
    }));
  };

  const onDocumentLoadError = (error: Error) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: error.message
    }));
  };

  // Render preview images if available
  const renderPreviewImages = () => {
    if (!previews?.previews) return null;
    
    return previews.previews.map((preview, index) => (
      <div key={index} className="mb-4">
        <div className="relative shadow-lg rounded-lg overflow-hidden">
          <Image
            src={preview.url}
            alt={`Page ${preview.pageNumber}`}
            width={preview.width}
            height={preview.height}
            className="w-full h-auto max-w-[800px] mx-auto"
            priority={index < 2} // Prioritize first 2 images
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            Page {preview.pageNumber}
          </div>
        </div>
      </div>
    ));
  };

  // Render all PDF pages (fallback)
  const renderAllPages = () => {
    if (!state.numPages) return null;
    
    const pages = [];
    for (let i = 1; i <= state.numPages; i++) {
      pages.push(
        <div key={i} className="mb-4">
          <Page
            pageNumber={i}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg"
            width={Math.min(800, typeof window !== 'undefined' ? window.innerWidth - 100 : 800)}
          />
        </div>
      );
    }
    return pages;
  };

  // Show loading state
  if (projectId && previewsLoading) {
    return (
      <div className={`flex items-center justify-center p-8 border rounded-lg bg-gray-50 ${className}`}>
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin h-6 w-6" />
          <span>Loading storybook...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (state.error || (projectId && previewsError)) {
    return (
      <div className={`flex items-center justify-center p-8 border rounded-lg bg-red-50 ${className}`}>
        <p className="text-red-600">
          Error loading storybook: {state.error || previewsError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Loading overlay for PDF */}
      {state.isLoading && !projectId && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="flex items-center space-x-2">
            <Loader2 className="animate-spin h-6 w-6" />
            <span>Loading PDF...</span>
          </div>
        </div>
      )}

      {/* Scrollable Container */}
      <div className="max-h-[1200px] overflow-y-auto p-4">
        <div className="flex flex-col items-center">
          {/* Show previews if available */}
          {projectId && previews?.previews ? (
            <>
              {renderPreviewImages()}
              <div className="mt-4 text-sm text-gray-600 text-center">
                Total Pages: {previews.totalPages}
              </div>
            </>
          ) : (
            /* Fallback to PDF viewer */
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
              
              {/* Page count info */}
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
