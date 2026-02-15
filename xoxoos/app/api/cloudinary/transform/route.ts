import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drasvxb0d';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('public_id');
    const resourceType = searchParams.get('resource_type') || 'image';
    const transformation = searchParams.get('transformation') || '';

    if (!publicId) {
      return NextResponse.json(
        { error: 'public_id is required' },
        { status: 400 }
      );
    }

    // Build the transformed URL
    const transformString = transformation ? `${transformation}/` : '';
    const url = `${BASE_URL}/${resourceType}/upload/${transformString}${publicId}`;

    return NextResponse.json({
      success: true,
      url,
      public_id: publicId,
      transformation,
    });
  } catch (error: any) {
    console.error('Error generating transform URL:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Transform failed',
      },
      { status: 500 }
    );
  }
}
