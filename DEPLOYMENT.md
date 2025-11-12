# Deployment Guide - Gemini API Key

## How Environment Variables Work in SPAs

When you build a React SPA, environment variables are **embedded into the JavaScript bundle** at build time. This means:

✅ **They work** - Your app can use them
⚠️ **They're visible** - Anyone can see them in the browser's developer tools
🔒 **Solution** - Use API key restrictions in Google Cloud Console

## Setting Up for Firebase Hosting Deployment

### Option 1: Local `.env` file (Development)

1. Create a `.env` file in the project root:
   ```
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   ```

2. The `.env` file is already in `.gitignore`, so it won't be committed

### Option 2: Firebase Hosting Environment Variables (Recommended for Production)

For production builds, you can set environment variables during the build process:

1. **Before building**, set the environment variable:
   ```bash
   # Windows PowerShell
   $env:REACT_APP_GEMINI_API_KEY="your_actual_api_key_here"
   npm run build
   
   # Or in one command
   $env:REACT_APP_GEMINI_API_KEY="your_key"; npm run build
   ```

2. **Or use a `.env.production` file** (create this file):
   ```
   REACT_APP_GEMINI_API_KEY=your_production_api_key_here
   ```

3. Then deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Option 3: CI/CD Pipeline

If using GitHub Actions, GitLab CI, etc., set the environment variable in your pipeline:
```yaml
env:
  REACT_APP_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

## Security Best Practices

### 1. Restrict Your API Key in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Find your Gemini API key
4. Click **Edit** and set **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your domains:
     - `https://yourdomain.com/*`
     - `https://*.yourdomain.com/*`
     - `https://quizstar-txqt.web.app/*` (your Firebase site)
     - `https://quizstar-txqt.firebaseapp.com/*`

5. Set **API restrictions**:
   - Select **Restrict key**
   - Only enable: **Generative Language API**

### 2. Use Different Keys for Development and Production

- Development key: less restrictive (can use localhost)
- Production key: restricted to your production domain only

## Verifying the Setup

After building, you can verify the environment variable is included:

1. Build your app:
   ```bash
   npm run build
   ```

2. Check the built JavaScript files:
   ```bash
   # Search for your API key in the build (should find it)
   findstr /s /i "REACT_APP_GEMINI_API_KEY" build\static\js\*.js
   ```

3. Or check in browser after deployment:
   - Open DevTools (F12)
   - Go to Sources tab
   - Find the main JS bundle
   - Search for your API key (it will be embedded)

## Important Notes

- ⚠️ **Never commit `.env` files** with real API keys (already in `.gitignore`)
- ✅ **Always restrict API keys** in Google Cloud Console
- ✅ **Use different keys** for dev and production
- ✅ **Monitor API usage** in Google Cloud Console
- ✅ **Rotate keys** if they're exposed

## Troubleshooting

If the environment variable isn't working:

1. **Restart the dev server** after creating/modifying `.env`
2. **Rebuild** for production (env vars are embedded at build time)
3. **Check the variable name** - must start with `REACT_APP_`
4. **Check for typos** - environment variable names are case-sensitive
5. **Clear build folder** and rebuild:
   ```bash
   rm -rf build
   npm run build
   ```

