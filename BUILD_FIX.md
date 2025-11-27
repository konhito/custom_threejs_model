# Build Fix Summary

## Issues Fixed

### 1. Deprecated Next.js Config Options (Next.js 15)

**Error:**
```
⚠ Invalid next.config.mjs options detected: 
⚠     Unrecognized key(s) in object: 'swcMinify', 'optimizeFonts'
```

**Fix:**
- ✅ Removed `swcMinify: true` - SWC minification is now default in Next.js 15
- ✅ Removed `optimizeFonts: true` - Font optimization is now default in Next.js 15

### 2. Invalid Rewrite Destination

**Error:**
```
`destination` does not start with `/`, `http://`, or `https://` for route 
{"source":"/api-proxy/:path*","destination":"undefined/api/:path*"}
```

**Fix:**
- ✅ Made rewrite conditional - only adds rewrite if `NEXT_PUBLIC_API_URL` is set
- ✅ Returns empty array if API URL is not configured (prevents build failure)

## Changes Made

### `frontend/next.config.mjs`

1. **Removed deprecated options:**
   ```javascript
   // REMOVED:
   swcMinify: true,
   optimizeFonts: true,
   ```

2. **Fixed rewrite logic:**
   ```javascript
   // BEFORE:
   async rewrites() {
     return [
       {
         source: '/api-proxy/:path*',
         destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
       },
     ];
   },

   // AFTER:
   async rewrites() {
     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
     
     // Only add rewrite if API URL is configured
     if (!apiUrl) {
       return [];
     }
     
     return [
       {
         source: '/api-proxy/:path*',
         destination: `${apiUrl}/api/:path*`,
       },
     ];
   },
   ```

## Environment Variables

Make sure to set in Vercel:

1. **Required for API proxy:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

2. **Optional but recommended:**
   ```
   NEXT_PUBLIC_CDN_URL=https://your-cdn-url.com
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

## Verification

After these fixes, the build should:
- ✅ Pass Next.js config validation
- ✅ Build successfully on Vercel
- ✅ Handle missing API URL gracefully

## Next Steps

1. **Commit changes:**
   ```bash
   git add frontend/next.config.mjs
   git commit -m "Fix Next.js 15 build errors: remove deprecated options and fix API rewrite"
   git push origin test
   ```

2. **Set environment variables in Vercel:**
   - Go to Vercel Dashboard > Project > Settings > Environment Variables
   - Add `NEXT_PUBLIC_API_URL` with your backend URL

3. **Redeploy:**
   - Vercel will auto-deploy on push
   - Or manually trigger deployment

## Testing

After deployment, verify:
- ✅ Build completes successfully
- ✅ Site loads correctly
- ✅ API calls work (if API URL is set)
- ✅ No console errors

---

**Status:** ✅ Fixed and ready to deploy

