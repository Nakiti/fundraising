import imageService from '../imageService.js';

export async function processPageImages(pageConfig, organizationId, campaignId, files = {}, pageId = 'temp') {
  const uploadedPaths = {};
  // console.log("files", files)

  for (const [fieldName, imageConfig] of Object.entries(pageConfig.images || {})) {
    if (files[fieldName]?.[0]) {
      try {
        imageService.validateFile(files[fieldName][0]);  
        console.log("files[fieldName][0]", files[fieldName][0])
        const uploadPath = await imageService.uploadImage(
          organizationId,
          pageConfig.folder, 
          pageId,
          // Use fieldName as image type to avoid collisions when multiple fields share a category
          fieldName,
          files[fieldName][0]
        );
        console.log("uploadPath", uploadPath)
        uploadedPaths[fieldName] = uploadPath;
      } catch (error) {
        console.log("error", error)
        await cleanupFailedUploads(Object.values(uploadedPaths));
        throw new Error(`Failed to process ${fieldName}: ${error.message}`);
      }
    }
  }

  return uploadedPaths;
}

export async function moveImagesFromTemp(pageConfig, organizationId, tempPaths, finalPageId, originalFiles) {
  if (!imageService.getStatus().isAzureConfigured) return;

  try {
    for (const [fieldName, tempPath] of Object.entries(tempPaths || {})) {
      if (tempPath && originalFiles[fieldName]?.[0]) {
        const imageConfig = pageConfig.images[fieldName];
        await imageService.updateImage(
          organizationId,
          pageConfig.folder,
          finalPageId,
          // Use fieldName to ensure deterministic unique key per field
          fieldName,
          originalFiles[fieldName][0],
          tempPath
        );
      }
    }
  } catch (error) {
    console.warn('Failed to move images from temp to final location:', error.message);
  } 
}

export async function cleanupFailedUploads(imagePaths) {
  if (!imageService.getStatus().isAzureConfigured || !imagePaths?.length) return;  
  try {
    await Promise.all(imagePaths.filter(Boolean).map(path => imageService.deleteImage(path)));
  } catch (error) {
    console.warn('Failed to cleanup uploaded images:', error.message);
  }
}
 

