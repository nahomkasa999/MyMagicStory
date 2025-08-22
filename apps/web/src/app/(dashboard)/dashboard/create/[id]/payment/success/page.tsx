"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const projectId = searchParams.get("project_id")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId || !projectId) return

    async function verifyAndGenerate() {
      try {
        const res = await fetch("/api/payment/verify-and-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, projectId }),
        })

        if (!res.ok) throw new Error("Payment verification failed")
        const data = await res.json()

        if (!data.success) throw new Error("Payment not confirmed")

        setDownloadUrl(data.downloadUrl || null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    verifyAndGenerate()
  }, [sessionId, projectId])

  if (loading) return <div className="p-8">Finalizing your project...</div>

  if (error) {
    return (
      <div className="p-8 text-red-600">
        {error}
        <button onClick={() => router.push("/dashboard")} className="ml-4 underline">
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="mt-4">Your storybook is being generated.</p>

      {downloadUrl ? (
        <a
          href={downloadUrl}
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
    </div>
  )
}

//http://localhost:3000/dashboard/create/cmeme550g0003cs1i897bq1b0/payment/success?session_id=cs_test_a1v9DNpmTWnGGwuNZ1NwCfu14U2zgIY7bzcyGoVhHeNdp78rYBUaIAIWPU&project_id=cmenc88bu0001csy2hh9k3qlk
