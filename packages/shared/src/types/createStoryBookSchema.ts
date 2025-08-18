import { z } from "@hono/zod-openapi";


const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


export const singleImageSchema = z.object({
  singleImage: z
    .custom<File>()
    .refine((file) => file instanceof File, "Image is required.")
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export const multipleImagesSchema = z.object({
  multipleImages: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, "At least one image is required.")
    .refine((files) => files.length <= 5, "You can select a maximum of 5 images.")
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Each file must be less than 5MB.`
    )
    .refine(
      (files) => Array.from(files).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});



export const formSchema = z.object({
  singleImage: singleImageSchema.shape.singleImage,
  // multipleImages: multipleImagesSchema.shape.multipleImages,
});