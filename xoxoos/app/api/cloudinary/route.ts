import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drasvxb0d';
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '367448791256394';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'vJC-5-kIhx_0YptgfjXEFgAPAWk';

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export async function GET() {
  try {
    // Fetch all images
    const imagesResult = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      max_results: 500,
    });

    // Fetch all videos
    const videosResult = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      max_results: 500,
    });

    return NextResponse.json({
      images: imagesResult.resources || [],
      videos: videosResult.resources || [],
    });
  } catch (error: any) {
    console.error('Error fetching Cloudinary resources:', error);
    console.error('Error details:', {
      message: error.message,
      http_code: error.http_code,
      name: error.name,
    });
    
    // Return empty arrays with error info for debugging
    return NextResponse.json({
      images: [],
      videos: [],
      error: error.message || 'Unknown error',
      http_code: error.http_code,
    });
  }
}
