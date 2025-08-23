"use client";

import React, { useState } from 'react';
import ImageUploadForm from './_components/imageInputForm';
import PDFViewer from './_components/pdf-viewer';
import { Button } from '@/components/ui/button';

function Page() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isPreview, setIspreview] = useState(true);
  const [isReadyToDisplay, setIsReadyToDisplay] = useState(false);

  const handleUploadSuccess = (result: { blob: Blob }) => {
    const url = URL.createObjectURL(result.blob);
    setPdfBlobUrl(url);
    setIsReadyToDisplay(true);
  };

  return (
    <div>
      <ImageUploadForm 
        onSetPreviewStatue={setIspreview}
        onSetProjectId={setProjectId}
        onSuccess={handleUploadSuccess} 
      />
      <div className="mt-8">
        {/* Conditionally render the PDFViewer based on the new state */}
        {isReadyToDisplay ? (
          <PDFViewer
            projectId={projectId || undefined}
            isPreview={isPreview}
            pdfPath={pdfBlobUrl || undefined}
            className="max-w-4xl mx-auto"
          />
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500">Your pdf preview will be here once it's generated.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;