# XOXOOS - Arrival-Inspired Love Story

A profound, non-linear love story website inspired by the film "Arrival". Features password protection, photorealistic design, and a philosophical narrative about choosing love despite knowing the future.

## Features

- 🔐 **Password Protection**: Secure access with a meaningful password
- 🎬 **Arrival-Inspired Design**: Non-linear narrative style with philosophical themes
- 📸 **Photo Gallery**: Automatically displays all images from Cloudinary
- 🎥 **Hero Video**: Full-screen MP4 background video
- 📱 **Mobile Friendly**: Fully responsive design
- ✨ **Non-Linear Storytelling**: Memories presented across time

## Password

The password is: `7C40-6A1B-7C4E-CBE8`

Hint: The first picture sent via IM (京东E卡卡密~)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
cd xoxoos
pnpm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=drasvxb0d
NEXT_PUBLIC_CLOUDINARY_API_KEY=367448791256394
CLOUDINARY_API_SECRET=vJC-5-kIhx_0YptgfjXEFgAPAWk
```

### Development

```bash
pnpm dev
```

The site will be available at `http://localhost:3001`

### Build

```bash
pnpm build
pnpm start
```

## Railway Deployment

### Quick Deploy

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for Railway"
   git push origin main
   ```

2. **Go to Railway.app** and sign in

3. **Create New Project** → "Deploy from GitHub repo"

4. **Select your repository** (`xoxoos`)

5. **Add Environment Variables** in Railway dashboard (Variables tab):
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=drasvxb0d
   NEXT_PUBLIC_CLOUDINARY_API_KEY=367448791256394
   CLOUDINARY_API_SECRET=vJC-5-kIhx_0YptgfjXEFgAPAWk
   ```

6. **Deploy!** Railway will automatically:
   - Detect Next.js
   - Install dependencies
   - Build the project
   - Start the server

7. **Get your URL** - Railway provides a public URL automatically

### Detailed Guide

See [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) for complete deployment instructions.

The site will be private (not indexed) and accessible only via the Railway URL.

## Design Philosophy

Inspired by "Arrival", this site explores:
- Non-linear time perception
- The choice to love despite knowing the future
- The value of every moment, good or bad
- Memories existing simultaneously across time

## Privacy

This site is designed to be:
- Password protected
- Deployed on Railway (private URL)
- Not publicly indexed
- Personal and intimate

Enjoy your love story! 💕
