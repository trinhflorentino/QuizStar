# Cloudinary Migration Guide

This project has been migrated from Firebase Storage to Cloudinary for all media file storage operations.

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. After signing up, you'll be taken to your dashboard

### 2. Get Your Cloudinary Credentials

From your Cloudinary Dashboard, you'll need:
- **Cloud Name**: Found at the top of your dashboard
- **API Key**: Found in the "Account Details" section
- **Upload Preset**: You'll need to create this (see below)

### 3. Create an Upload Preset

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: Choose a name (e.g., `too_upload`)
   - **Signing Mode**: Set to **Unsigned** (for client-side uploads)
   - **Folder**: Optionally set a default folder
   - **Allowed formats**: Set to your preferred formats (jpg, png, mp4, etc.)
   - **Overwrite**: Enable if you want to allow file overwrites
5. Click **Save**

### 4. Configure the Application

Open `js/cloudinaryConfig.js` and update the following values:

```javascript
const CLOUDINARY_CONFIG = {
  cloudName: 'YOUR_CLOUD_NAME',        // Replace with your cloud name
  uploadPreset: 'YOUR_UPLOAD_PRESET',  // Replace with your upload preset name
  apiKey: 'YOUR_API_KEY'               // Replace with your API key
};
```

### 5. Optional: Server-Side File Deletion

For security reasons, file deletion should be handled server-side. The current implementation logs deletion requests but doesn't actually delete files from Cloudinary.

To implement proper deletion:

1. Create a backend API endpoint (Node.js example):

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'  // Never expose this on the client!
});

app.post('/api/delete-media', async (req, res) => {
  const { publicId, resourceType } = req.body;
  
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || 'image'
    });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

2. Update the `deleteFile` method in `js/cloudinaryConfig.js` to call your API:

```javascript
async deleteFile(publicId, resourceType = 'image') {
  const response = await fetch('/api/delete-media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId, resourceType })
  });
  
  return await response.json();
}
```

## Migration Summary

### What Was Changed

1. **Created**: `js/cloudinaryConfig.js` - Cloudinary service configuration and helper functions
2. **Updated**: All JavaScript files that used `firebase.storage()` now use `window.cloudinaryService`
3. **Updated**: `js/firebaseConfig.js` - Removed Firebase Storage emulator initialization
4. **Updated**: All HTML files - Removed Firebase Storage script, added Cloudinary script

### Files Modified

**JavaScript Files:**
- `js/utilities/mediaUtils.js`
- `js/main/profile.js`
- `js/main/projectorConfig.js`
- `js/main/firebaseDefenition.js`
- `js/technician/questionmanagement/data/questionManagementData.js`
- `js/technician/questionmanagement/controls/questionManagementControls.js`
- `js/projector/matchdata/intro/intro.js`
- `js/projector/matchdata/finish/finish.js`
- `js/firebaseConfig.js`

**HTML Files:**
- Main.html
- Projector.html
- Technician.html
- Ingame.html
- QuestionManager.html
- index.html
- Scoreboard.html
- MC.html
- ForgetPassword.html
- Register.html

## API Reference

### CloudinaryService Methods

#### `uploadFile(file, options)`
Upload a file to Cloudinary
- **Parameters**:
  - `file`: File object to upload
  - `options`: Optional configuration
    - `folder`: Folder path in Cloudinary
    - `publicId`: Custom public ID
    - `onProgress`: Progress callback function
- **Returns**: Promise with upload result (url, publicId, etc.)

#### `getDownloadURL(publicId, transformations)`
Get the URL for a file
- **Parameters**:
  - `publicId`: The public ID of the file
  - `transformations`: Optional transformations object (width, height, crop, quality)
- **Returns**: String URL

#### `deleteFile(publicId, resourceType)`
Delete a file (requires server-side implementation)
- **Parameters**:
  - `publicId`: The public ID to delete
  - `resourceType`: 'image', 'video', or 'raw'
- **Returns**: Promise with deletion result

#### `ref(path)`
Create a reference object (Firebase-compatible API)
- **Parameters**:
  - `path`: The file path/public ID
- **Returns**: Reference object with `put()`, `delete()`, and `getDownloadURL()` methods

## Cloudinary Transformations

Cloudinary supports powerful image and video transformations. Examples:

```javascript
// Get a resized image
const url = cloudinaryService.getDownloadURL('my-image', {
  width: 300,
  height: 200,
  crop: 'fill',
  quality: 'auto'
});

// This generates a URL like:
// https://res.cloudinary.com/your-cloud/image/upload/w_300,h_200,c_fill,q_auto/my-image
```

## Cost Considerations

Cloudinary free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 transformations per month

Monitor your usage in the Cloudinary dashboard to avoid unexpected charges.

## Troubleshooting

### Files not uploading
- Check that your upload preset is set to "unsigned"
- Verify your cloud name and upload preset are correct
- Check browser console for errors
- Ensure file size is within Cloudinary limits

### CORS errors
- Cloudinary automatically handles CORS for uploads
- If you experience issues, check your Cloudinary security settings

### Images not displaying
- Verify the public ID is correct
- Check that the file was successfully uploaded
- Ensure the URL is properly formed

## Support

For Cloudinary-specific issues, refer to:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com/)

For application-specific issues, check the browser console for error messages.

