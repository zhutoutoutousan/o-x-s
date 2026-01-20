# Cloudinary Setup Guide for XOXOOS

## Configuration

Your Cloudinary credentials are configured:
- **Cloud Name**: `drasvxb0d`
- **API Key**: `367448791256394`

## Environment Variables

Create a `.env` file in the `xoxoos` directory with:

```env
VITE_CLOUDINARY_CLOUD_NAME=drasvxb0d
VITE_CLOUDINARY_API_KEY=367448791256394
VITE_CLOUDINARY_API_SECRET=vJC-5-kIhx_0YptgfjXEFgAPAWk
```

## Uploading Media

### Option 1: Cloudinary Dashboard
1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Navigate to Media Library
3. Upload your images and videos
4. Note the public ID (e.g., `timeline/first-spark`)

### Option 2: Cloudinary Upload Widget (Recommended)
Add the upload widget to your app for easy uploads:

```bash
npm install cloudinary-react
```

### Option 3: API Upload
Use the Cloudinary API to upload programmatically.

## Using Cloudinary in Your App

### Images in Timeline

Update `src/App.tsx` timeline events with Cloudinary public IDs:

```typescript
const timelineEvents = [
  {
    id: '1',
    date: '2023-06-15',
    title: 'First Spark',
    description: '...',
    image: 'timeline/first-spark', // Cloudinary public ID
    color: '#d4af37'
  }
];
```

### Videos

Update the VideoPlayer component:

```typescript
<VideoPlayer 
  videoPublicId="memories/together"
  posterPublicId="memories/together-poster" // Optional
/>
```

### Direct URL Usage

You can also use full URLs if needed:

```typescript
image: 'https://res.cloudinary.com/drasvxb0d/image/upload/timeline/first-spark.jpg'
```

## Utility Functions

The app includes helper functions in `src/utils/cloudinary.ts`:

- `getCloudinaryImageUrl(publicId, options)` - Get optimized image URL
- `getCloudinaryVideoUrl(publicId, options)` - Get optimized video URL
- `getResponsiveImageUrl(publicId, maxWidth)` - Get responsive image
- `getThumbnailUrl(publicId, size)` - Get thumbnail image

### Example Usage

```typescript
import { getCloudinaryImageUrl } from './utils/cloudinary';

// Get optimized image (800px wide, auto quality, auto format)
const imageUrl = getCloudinaryImageUrl('timeline/first-spark', {
  width: 800,
  quality: 'auto',
  format: 'auto'
});

// Get video with optimizations
const videoUrl = getCloudinaryVideoUrl('memories/together', {
  quality: 'auto',
  format: 'auto'
});
```

## Folder Structure Recommendations

Organize your media in Cloudinary with folders:

- `timeline/` - Timeline event images
- `memories/` - Video memories
- `chat/` - Chat-related images
- `thumbnails/` - Thumbnail images

## Optimization Features

Cloudinary automatically:
- ✅ Optimizes image formats (WebP, AVIF when supported)
- ✅ Compresses images and videos
- ✅ Generates responsive images
- ✅ Provides global CDN delivery
- ✅ Handles video streaming

## Free Tier Limits

- 25GB storage
- 25GB bandwidth/month
- Perfect for personal projects like XOXOOS!

## Need Help?

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [React SDK](https://cloudinary.com/documentation/react_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
