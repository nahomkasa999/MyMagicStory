"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/hooks/session";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.93/build/pdf.worker.min.mjs`;

interface PDFViewerPropsUpdated {
  projectId?: string;
  pdfPath?: string;
  className?: string;
  isPreview: boolean;
}

export default function PDFViewer({ projectId, isPreview, pdfPath, className = "" }: PDFViewerPropsUpdated) {
  const session = useSession();
  const [state, setState] = useState({
    isLoading: true,
    error: null as string | null,
    numPages: null as number | null,
    currentPage: 1,
    isPreview: isPreview,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const returnUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    setState((prev) => ({ ...prev, isPreview: isPreview }));
  }, [isPreview]);

  const handleBuyNowClick = async () => {
    if (!projectId) {
      console.error("No project ID yet!");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("http://localhost:3001/payment/buy-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.session?.access_token}`,
        },
        body: JSON.stringify({ projectId, returnUrl }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout URL not returned", data);
      }
    } catch (err) {
      console.error("Failed to start checkout", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setState((prev) => ({ ...prev, isLoading: false, numPages }));
  };

  const onDocumentLoadError = (error: Error) => {
    setState((prev) => ({ ...prev, isLoading: false, error: error.message }));
  };

  const renderPages = () => {
    if (!state.numPages) return null;
    const limitPages = state.isPreview ? 3 : state.numPages;

    const pages = [];
    for (let i = 1; i <= limitPages; i++) {
      const isBlur = state.isPreview && i === limitPages;
      pages.push(
        <div key={i} className="mb-4 relative">
          <Page
            pageNumber={i}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className={`shadow-lg transition-all duration-300 ${isBlur ? "blur-sm" : ""}`}
            width={Math.min(800, typeof window !== "undefined" ? window.innerWidth - 100 : 800)}
          />
          {isBlur && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-primary text-xl font-semibold">
              <Button onClick={handleBuyNowClick} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Buy Now to get full PDF"}
              </Button>
            </div>
          )}
        </div>
      );
    }
    return pages;
  };

  return (
    <div className={`relative border rounded-lg overflow-hidden bg-white ${className}`}>
      {state.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="flex items-center space-x-2">
            <Loader2 className="animate-spin h-6 w-6" />
            <span>Generating your PDF...</span>
          </div>
        </div>
      )}
      
      <div className="max-h-[1200px] overflow-y-auto p-4">
        <div className="flex flex-col items-center">
          <Document
            file={pdfPath}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin h-6 w-6" />
              </div>
            }
          >
            {renderPages()}
          </Document>
          {state.numPages && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Total Pages: {state.numPages}{state.isPreview ? " (Preview)" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}