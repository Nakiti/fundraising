import { BlobServiceClient } from '@azure/storage-blob';

class ImageService {
   constructor() {
      this.isAzureConfigured = false;
      this.blobServiceClient = null;
      this.containerClient = null;
      
      // Check if Azure Storage is configured
      if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
         try {
         this.blobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.AZURE_STORAGE_CONNECTION_STRING
         );
         this.containerName = 'assets';
         this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
         this.isAzureConfigured = true;
         console.log('✅ Azure Blob Storage configured successfully');
         } catch (error) { 
         console.warn('⚠️ Azure Storage connection failed, falling back to local storage:', error.message);
         }
      } else {
         console.warn('⚠️ AZURE_STORAGE_CONNECTION_STRING not set, using local file storage fallback');
      }
   }

   // Generate SAS token for secure access
   generateSasToken(blobPath, permissions = 'r', expiryHours = 24) {
      if (!this.isAzureConfigured) {
         // Return a mock URL for development
         return `/uploads/${blobPath}`;
      }
      
      const blobClient = this.containerClient.getBlobClient(blobPath);
      const sasOptions = {
         permissions: permissions,
         expiresOn: new Date(Date.now() + expiryHours * 60 * 60 * 1000),
      };
      return blobClient.generateSasUrl(sasOptions);
   }

   // Get image URL with appropriate access level
   async getImageUrl(imagePath, accessLevel = 'public') {
      if (!imagePath) return null;
      
      if (!this.isAzureConfigured) {
         // Return local path for development
         return imagePath.startsWith('/uploads/') ? imagePath : `/uploads/${imagePath}`;
      }
      
      const expiryHours = {
         'public': 168,    // 7 days
         'private': 24,    // 1 day
         'admin': 1        // 1 hour
      };
      
      console.log("imagePath", imagePath)
      return this.generateSasToken(imagePath, 'r', expiryHours[accessLevel]);
   }

   // Upload image to blob storage
   async uploadImage(orgId, entityType, entityId, imageType, file) {
      try {
         console.log("entityType", entityType)
         console.log("entityId", entityId)
         console.log("imageType", imageType)
         console.log("file", file)
         // Create deterministic blob path so each image type has a single blob that gets overwritten
         const blobPath = `organizations/${orgId}/${entityType}/${entityId}/${imageType}/image`;
         
         if (!this.isAzureConfigured) {
         // For development, return the path as if it was uploaded
         console.log('📁 Development mode: Image would be uploaded to Azure Blob Storage');
         console.log('📁 Path:', blobPath);
         return blobPath;
         }
         
         // Get block blob client
         const blockBlobClient = this.containerClient.getBlockBlobClient(blobPath);
         
         // Upload file
         await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: {
               blobContentType: file.mimetype,
            },
         });

         console.log("blobPath", blobPath)
         return blobPath;
      } catch (error) {
         console.error('Image upload failed:', error);
         throw new Error('Failed to upload image to blob storage');
      }
   }

   // Delete image from blob storage
   async deleteImage(imagePath) {
      if (!imagePath) return;
      
      if (!this.isAzureConfigured) {
         console.log('📁 Development mode: Image would be deleted from Azure Blob Storage');
         console.log('📁 Path:', imagePath);
         return;
      }
      
      try {
         const blobClient = this.containerClient.getBlobClient(imagePath);
         await blobClient.deleteIfExists();
      } catch (error) {
         console.error('Image deletion failed:', error);
         // Don't throw error for deletion failures to avoid breaking the main flow
      }
   }

   // Update image (delete old, upload new)
   async updateImage(orgId, entityType, entityId, imageType, file, oldImagePath) {
      try {
         // Delete old image if it exists
         if (oldImagePath) {
         await this.deleteImage(oldImagePath);
         }
         
         // Upload new image
         return await this.uploadImage(orgId, entityType, entityId, imageType, file);
      } catch (error) {
         console.error('Image update failed:', error);
         throw new Error('Failed to update image');
      }
   }

   // Validate file
   validateFile(file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!file) {
         throw new Error('No file provided');
      }
      
      if (file.size > maxSize) {
         throw new Error('File size exceeds 5MB limit');
      }
      
      if (!allowedTypes.includes(file.mimetype)) {
         throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
      }
      
      return true;
   }

   // Get service status
   getStatus() {
      return {
         isAzureConfigured: this.isAzureConfigured,
         containerName: this.containerName || 'N/A'
      };
   }
}

export default new ImageService();
