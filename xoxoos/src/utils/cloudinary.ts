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
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  gravity?: 'auto' | 'face' | 'center';
  transformation?: string;
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
export function getCloudinaryImageUrl(
  publicId: string,
  options: CloudinaryImageOptions = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fit',
    gravity = 'auto',
    transformation = ''
  } = options;

  const transformations: string[] = [];

  if (transformation) {
    transformations.push(transformation);
  }

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity && crop !== 'fit') transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

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
    format = 'auto',
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
  if (format) transformations.push(`f_${format}`);

  const transformString = transformations.length > 0 
    ? transformations.join(',') + '/' 
    : '';

  return `${BASE_URL}/video/upload/${transformString}${publicId}`;
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
