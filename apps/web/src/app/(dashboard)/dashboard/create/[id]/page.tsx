"use client";

import React, { useState } from 'react'
import ImageUploadForm from './_components/imageInputForm'
import PDFViewer from './_components/pdf-viewer'
import { Button } from '@/components/ui/button'

function Page() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const handleUploadSuccess = (result: { blob: Blob }) => {
    const url = URL.createObjectURL(result.blob);
    setPdfBlobUrl(url);
  };

  return (
    <div>
      <ImageUploadForm 
        onProjectCreated={setProjectId} 
        onSuccess={handleUploadSuccess} 
      />

      <div className='w-full'>
        <Button className='m-auto'>Pay to get</Button>
      </div>

      <div className="mt-8">
        <PDFViewer
          projectId={projectId || undefined}
          pdfPath={pdfBlobUrl || (!projectId ? "/storybook.pdf" : undefined)}
          className="max-w-4xl mx-auto"
        />
      </div>
    </div>
  )
}

export default Page;
