import { prisma } from "../db/index.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getSignedImageUrls(projectId: string) {
  // Fetch stored file paths for the project
  const images = await prisma.uploadedImage.findMany({
    where: { projectId },
    select: { imageUrl: true },
  });

  // Generate signed URLs for each file path
  const signedUrls: string[] = [];
  for (const img of images) {
    const { data, error } = await supabase.storage
      .from("storybook-images")
      .createSignedUrl(img.imageUrl, 60 * 60); // 1-hour signed URL
    if (error || !data?.signedUrl) throw new Error("Failed to generate signed URL");
    signedUrls.push(data.signedUrl);
  }

  return signedUrls;
}
