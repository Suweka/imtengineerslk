import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(buffer: Buffer, filename?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "imt-engineers/products",
        resource_type: "auto",
        public_id: filename,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result?.secure_url || "");
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(url: string): Promise<void> {
  if (!url || url.startsWith("data:")) return;
  
  try {
    const publicId = extractPublicId(url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (err) {
    console.error("Failed to delete image from Cloudinary:", err);
  }
}

function extractPublicId(url: string): string | null {
  const match = url.match(/\/([^/]+)\.(?:jpg|png|gif|webp)$/i);
  return match ? `imt-engineers/products/${match[1]}` : null;
}
