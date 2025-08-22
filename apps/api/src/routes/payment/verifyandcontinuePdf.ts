import { createRoute } from "@hono/zod-openapi"
import type { Context } from "hono"
import Stripe from "stripe"
import { prisma } from "../../db/index.js"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { EnhancedPDFGenerator, layoutJsonSchema } from "../../services/pdf/index.js"
import * as fs from "fs"
import fetch from "node-fetch"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const requestBodySchema = z.object({
  sessionId: z.string(),
  projectId: z.string(),
})

export const verifyAndGenerateRoute = createRoute({
  method: "post",
  path: "/payment/verify-and-generate",
  tags: ["Stripe", "PDF"],
  request: {
    body: {
      content: {
        "application/json": { schema: requestBodySchema },
      },
    },
  },
  responses: {
    200: { description: "Payment verified and PDF generated" },
    400: { description: "Invalid request" },
    401: { description: "Unauthorized" },
    404: { description: "Project not found" },
    500: { description: "Internal server error" },
  },
})

export const verifyAndGenerateHandler = async (c: Context) => {
  const user = c.get("user")
  if (!user) return c.json({ error: "User not authenticated" }, 401)

  const body = requestBodySchema.safeParse(await c.req.json())
  if (!body.success) return c.json({ error: "Invalid request", details: body.error.issues }, 400)

  const { sessionId, projectId } = body.data

  try {
    // 1. Verify Stripe payment
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (!session || session.payment_status !== "paid")
      return c.json({ success: false, message: "Payment not completed" }, 400)

    // 2. Fetch project and user
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true, template: true },
    })
    if (!project) return c.json({ error: "Project not found" }, 404)

    // 3. Check if PDF already exists
    const pdfFileName = `projects/${project.id}/storybook.pdf`
    const { data: existingUrl, error: existingError } = await supabase.storage
      .from("storybook-pdfs")
      .createSignedUrl(pdfFileName, 60 * 60)

    if (existingUrl && !existingError) {
      // Update project status
      await prisma.project.update({
        where: { id: project.id },
        data: { status: "COMPLETED" },
      })
      return c.json({ success: true, projectId: project.id, downloadUrl: existingUrl.signedUrl })
    }

    // 4. Resume/finish PDF generation
    const layout = layoutJsonSchema.parse(project.template.layoutJson)
    const pdfGenerator = new EnhancedPDFGenerator()
    const result = await pdfGenerator.generatePDF(layout, [], {
      outputFormat: "print",
      generatePreviews: false,
      uploadToStorage: true, // Upload finished PDF to Supabase
    })

    // 5. Create signed URL
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("storybook-pdfs")
      .createSignedUrl(pdfFileName, 60 * 60)
    if (signedUrlError) throw signedUrlError

    // 6. Update project
    await prisma.project.update({
      where: { id: project.id },
      data: { status: "COMPLETED" },
    })

    return c.json({ success: true, projectId: project.id, downloadUrl: signedUrlData.signedUrl })
  } catch (error: any) {
    console.error("Verify & generate error:", error)
    return c.json({ error: error.message || "Internal server error" }, 500)
  }
}
