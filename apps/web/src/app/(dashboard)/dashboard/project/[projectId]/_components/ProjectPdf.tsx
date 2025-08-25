// app/dashboard/project/[projectId]/_components/ProjectPdf.tsx
"use client";

import { useProjectPdf } from "../../../_hooks/useProjectPdfs";
import { Loader2 } from "lucide-react";
import PDFViewer from "../../../create/[id]/_components/pdf-viewer"; // Make sure the path is correct
import { useParams } from "next/navigation";
import { DashboardLayout } from "../../../_components/dashboard-layout"; 
import { useUserStorybooks } from "../../../_hooks/useUserStorybooks"; 

export default function ProjectPDFPage() {
  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId ?? "";

  const { data, isLoading, error } = useProjectPdf(projectId);
  // Get the error from the user query as well
  const { data: userData, isLoading: userLoading, error: userError } = useUserStorybooks();

  // Handle all loading states at the top
  if (isLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your storybook...</p>
        </div>
      </div>
    );
  }

  // Handle all error and data-not-found states
  // We explicitly check for !data?.downloadUrl and !userData?.user
  if (error || userError || !data?.downloadUrl || !userData?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load the storybook.</p>
          <p className="text-sm text-muted-foreground">
            {(error || userError) instanceof Error ? error!.message : "PDF or user data not found or not available yet."}
          </p>
        </div>
      </div>
    );
  }

  // TypeScript now knows that `userData` and `userData.user` are not undefined
  return (
    <DashboardLayout user={userData.user} storybooks={userData.storybooks || []}>
      <div className="flex flex-col items-center p-8">
        <h1 className="text-2xl font-bold mb-6">Your Storybook</h1>
        <PDFViewer
          projectId={projectId}
          pdfPath={data.downloadUrl}
          isPreview={data.isPreview}
          className="w-full max-w-4xl"
        />
      </div>
    </DashboardLayout>
  );
}