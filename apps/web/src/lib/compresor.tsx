import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

export async function compressImage(file: File): Promise<File> {
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed file size: ${compressedFile.size / 1024 / 1024} MB`);
    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    // Return original file if compression fails
    return file;
  }
}