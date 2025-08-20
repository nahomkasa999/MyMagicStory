"use client";

import { Document, Page, pdfjs } from "react-pdf";

// Needed to load worker for react-pdf - use CDN to match react-pdf version
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUrl: string;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  return (
    <div className="border rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">PDF Preview:</h3>
      <Document file={pdfUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}