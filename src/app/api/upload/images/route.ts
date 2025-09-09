import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json();

    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    const uploadPromises = images.map(async (base64Image: string) => {
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "dev-connect/portfolio-projects",
        transformation: [
          { width: 1920, height: 1080, crop: "limit" },
          { quality: "auto" },
          { format: "auto" },
        ],
      });
      return result.secure_url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}
