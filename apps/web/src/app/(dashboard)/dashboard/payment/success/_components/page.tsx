"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useVerifierGenerator } from "../../_hooks/fetchbackend";
import { useSession } from "@/app/hooks/session";
import PDFViewer from "../../../create/[id]/_components/pdf-viewer";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();
  const sessionId = searchParams.get("session_id");
  const projectId = searchParams.get("project_id");

  const { data, error, isLoading } = useVerifierGenerator(
    sessionId!,
    projectId!
  );
  if (isLoading) return <div className="p-8">Finalizing your project...</div>;

  if (error) {
    return (
      <div className="p-8 text-red-600">
        {(error as Error).message}
        <button
          onClick={() => router.push("/dashboard")}
          className="ml-4 underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <h1 className="text-2xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
      <p className="mt-4">Your storybook has been generated.</p>
      {data?.downloadUrl ? (
        <a
          href={data.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
        >
          Download Storybook
        </a>
      ) : (
        <button
          onClick={() => router.push(`/dashboard/project/${projectId}`)}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
        >
          Go to Project
        </button>
      )}
      <PDFViewer
        projectId={projectId || undefined}
        isPreview={false}
        pdfPath={
          data.downloadUrl || (!projectId ? "/storybook.pdf" : undefined)
        }
        className="max-w-4xl mx-auto"
      />
      
    </div>
  );
}
