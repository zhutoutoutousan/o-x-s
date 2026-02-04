import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drasvxb0d';
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '367448791256394';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'vJC-5-kIhx_0YptgfjXEFgAPAWk';

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

// Helper function to fetch all resources with pagination
async function fetchAllResources(resourceType: 'image' | 'video', maxResults: number = 500) {
  const allResources: any[] = [];
  let nextCursor: string | undefined = undefined;

  do {
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: resourceType,
      max_results: maxResults,
      next_cursor: nextCursor,
    });

    if (result.resources) {
      allResources.push(...result.resources);
    }

    nextCursor = result.next_cursor;
  } while (nextCursor);

  return allResources;
}

export async function GET() {
  try {
    // Fetch all resources (images and videos only - PDFs removed)
    const [imagesResult, videosResult] = await Promise.all([
      fetchAllResources('image'),
      fetchAllResources('video'),
    ]);

    // Filter out PDFs from images array (safety check)
    const filteredImages = imagesResult.filter((resource: any) => 
      resource.format !== 'pdf' && 
      resource.format !== 'PDF' && 
      !resource.secure_url?.toLowerCase().endsWith('.pdf') &&
      !resource.public_id?.toLowerCase().endsWith('.pdf') &&
      !resource.public_id?.toLowerCase().includes('.pdf')
    );

    // Disable caching to always get fresh data
    return NextResponse.json(
      {
        images: filteredImages || [],
        videos: videosResult || [],
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Timestamp': Date.now().toString(), // Add timestamp for cache busting
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching Cloudinary resources:', error);
    console.error('Error details:', {
      message: error.message,
      http_code: error.http_code,
      name: error.name,
    });
    
    // Return empty arrays with error info for debugging
    return NextResponse.json(
      {
        images: [],
        videos: [],
        error: error.message || 'Unknown error',
        http_code: error.http_code,
      },
      {
        status: error.http_code || 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}
