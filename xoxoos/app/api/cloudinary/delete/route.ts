import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drasvxb0d';
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '367448791256394';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'vJC-5-kIhx_0YptgfjXEFgAPAWk';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('public_id');
    const resourceType = searchParams.get('resource_type') || 'image';

    if (!publicId) {
      return NextResponse.json(
        { error: 'public_id is required' },
        { status: 400 }
      );
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: resourceType as 'image' | 'video',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error deleting from Cloudinary:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Delete failed',
        http_code: error.http_code,
      },
      { status: error.http_code || 500 }
    );
  }
}
