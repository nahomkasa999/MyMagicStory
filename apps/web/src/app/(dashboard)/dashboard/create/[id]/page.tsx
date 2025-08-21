"use client";

import React, { useState } from 'react'
import ImageUploadForm from './_components/imageInputForm'
import PDFViewer from './_components/pdf-viewer'
import { Button } from '@/components/ui/button'

function Page() {
  const [projectId, setProjectId] = useState<string | null>(null);

  return (
    <div>
      <ImageUploadForm onProjectCreated={setProjectId} />
      <div className='w-full'>
        {/* here this button will intiate a stripe payment fo the book*/}
        <Button className='m-auto'>Pay to get</Button>
      </div>
      <div className="mt-8">
        <PDFViewer
          projectId={projectId || undefined}
          pdfPath={!projectId ? "/storybook.pdf" : undefined}
          className="max-w-4xl mx-auto"
        />
      </div>
    </div>
  )
}

export default Page