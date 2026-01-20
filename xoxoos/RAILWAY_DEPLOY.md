# Railway Deployment Guide for XOXOOS

## Quick Deploy Steps

### 1. Push to GitHub
Make sure your code is pushed to a GitHub repository:
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Deploy on Railway

1. Go to [Railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository (`xoxoos`)
5. Railway will automatically detect Next.js and start building

### 3. Set Environment Variables

In Railway dashboard, go to your project → **Variables** tab and add:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=drasvxb0d
NEXT_PUBLIC_CLOUDINARY_API_KEY=367448791256394
CLOUDINARY_API_SECRET=vJC-5-kIhx_0YptgfjXEFgAPAWk
```

**Important:** 
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `CLOUDINARY_API_SECRET` is server-side only (no `NEXT_PUBLIC_` prefix)

### 4. Deploy

Railway will automatically:
- Install dependencies (`pnpm install` or `npm install`)
- Build the project (`next build`)
- Start the server (`next start`)

### 5. Get Your URL

Once deployed:
- Railway will provide a public URL (e.g., `https://your-app.railway.app`)
- You can also set a custom domain in Railway settings

## Configuration Files

The project includes:
- ✅ `railway.json` - Railway configuration
- ✅ `Procfile` - Process file for Railway
- ✅ `.railwayignore` - Files to ignore during deployment
- ✅ `next.config.js` - Next.js configuration with Cloudinary image domains

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (Railway uses Node 18+ by default)

### Environment Variables Not Working
- Make sure `NEXT_PUBLIC_*` prefix is used for client-side variables
- Restart the deployment after adding variables

### Images/Videos Not Loading
- Verify Cloudinary credentials are correct
- Check Railway logs for API errors
- Ensure `CLOUDINARY_API_SECRET` is set (not `NEXT_PUBLIC_CLOUDINARY_API_SECRET`)

### Port Issues
- Railway automatically sets `PORT` environment variable
- The start script handles this: `next start -p $PORT || next start -p 3001`

## Security Notes

- ✅ Password protection is client-side (sessionStorage)
- ✅ Cloudinary API secret is server-side only
- ✅ Site is not publicly indexed (private Railway URL)
- ⚠️ For production, consider adding additional security layers

## Monitoring

- Check Railway dashboard for:
  - Build logs
  - Runtime logs
  - Resource usage
  - Deployment status

## Custom Domain (Optional)

1. Go to Railway project settings
2. Click "Generate Domain" or add custom domain
3. Update DNS records as instructed
4. Railway will handle SSL automatically

---

Your Arrival-inspired love story is now live! 💕
