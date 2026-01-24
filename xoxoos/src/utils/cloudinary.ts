/**
 * Cloudinary utility functions for generating optimized image and video URLs
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
                   process.env.CLOUDINARY_CLOUD_NAME || 
                   'drasvxb0d';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;

export interface CloudinaryImageOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'jpeg';
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  gravity?: 'auto' | 'face' | 'center';
  transformation?: string;
  forceFormat?: boolean; // Force format conversion (useful for HEIC files)
}

export interface CloudinaryVideoOptions {
  quality?: 'auto' | number;
  format?: 'auto' | 'mp4' | 'webm';
  width?: number;
  height?: number;
  transformation?: string;
}

/**
 * Generate a Cloudinary image URL with optimizations
 * @param publicId - The public ID of the image (e.g., 'timeline/first-spark')
 * @param options - Transformation options
 * @returns Optimized Cloudinary image URL
 */
/**
 * Check if a file is HEIC format
 */
function isHeicFormat(format: string | undefined, publicId: string, secureUrl?: string): boolean {
  if (!format && !secureUrl && !publicId) return false;
  
  const formatLower = format?.toLowerCase() || '';
  const publicIdLower = publicId?.toLowerCase() || '';
  const urlLower = secureUrl?.toLowerCase() || '';
  
  return formatLower === 'heic' || 
         formatLower === 'heif' ||
         publicIdLower.endsWith('.heic') ||
         publicIdLower.endsWith('.heif') ||
         urlLower.includes('.heic') ||
         urlLower.includes('.heif');
}

export function getCloudinaryImageUrl(
  publicId: string,
  options: CloudinaryImageOptions = {},
  resourceFormat?: string,
  secureUrl?: string
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fit',
    gravity = 'auto',
    transformation = '',
    forceFormat = false
  } = options;

  // Check if this is a HEIC file that needs conversion
  const isHeic = isHeicFormat(resourceFormat, publicId, secureUrl);
  
  // Force JPEG format for HEIC files (browser-compatible)
  const finalFormat = isHeic || forceFormat 
    ? (format === 'auto' ? 'jpg' : format)
    : format;

  const transformations: string[] = [];

  if (transformation) {
    transformations.push(transformation);
  }

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity && crop !== 'fit') transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);
  // Always specify format for HEIC files to force conversion
  if (finalFormat && (isHeic || finalFormat !== 'auto')) {
    transformations.push(`f_${finalFormat}`);
  }

  const transformString = transformations.length > 0 
    ? transformations.join(',') + '/' 
    : '';

  return `${BASE_URL}/image/upload/${transformString}${publicId}`;
}

/**
 * Generate a Cloudinary video URL with optimizations
 * @param publicId - The public ID of the video (e.g., 'memories/together')
 * @param options - Transformation options
 * @returns Optimized Cloudinary video URL
 */
export function getCloudinaryVideoUrl(
  publicId: string,
  options: CloudinaryVideoOptions = {}
): string {
  const {
    quality = 'auto',
    format = 'mp4', // Default to mp4 for better compatibility
    width,
    height,
    transformation = ''
  } = options;

  const transformations: string[] = [];

  if (transformation) {
    transformations.push(transformation);
  }

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  // Always ensure mp4 format for videos
  transformations.push(`f_${format === 'auto' ? 'mp4' : format}`);

  const transformString = transformations.length > 0 
    ? transformations.join(',') + '/' 
    : '';

  return `${BASE_URL}/video/upload/${transformString}${publicId}`;
}

/**
 * Generate a Cloudinary raw file URL (for PDFs, etc.)
 * @param publicId - The public ID of the file
 * @returns Cloudinary raw file URL
 */
export function getCloudinaryRawUrl(publicId: string): string {
  return `${BASE_URL}/raw/upload/${publicId}`;
}

/**
 * Get a responsive image URL that adapts to different screen sizes
 * @param publicId - The public ID of the image
 * @param maxWidth - Maximum width for the image
 * @returns Responsive Cloudinary image URL
 */
export function getResponsiveImageUrl(
  publicId: string,
  maxWidth: number = 1200
): string {
  return getCloudinaryImageUrl(publicId, {
    width: maxWidth,
    quality: 'auto',
    format: 'auto',
    crop: 'fit'
  });
}

/**
 * Get a thumbnail image URL
 * @param publicId - The public ID of the image
 * @param size - Size of the thumbnail (square)
 * @returns Thumbnail Cloudinary image URL
 */
export function getThumbnailUrl(
  publicId: string,
  size: number = 300
): string {
  return getCloudinaryImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    format: 'auto'
  });
}
