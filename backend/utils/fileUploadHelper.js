import multer from 'multer';
import { ValidationError } from './errors.js';

/**
 * Configure multer for page file uploads
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    fieldSize: 25 * 1024 * 1024 // 25MB for field data
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ValidationError('Only image files are allowed'), false);
    }
  }
});

/**
 * Handle file upload for page creation/update
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Array<string>} imageFields - Array of image field names to accept
 * @returns {Promise} Promise that resolves when upload is complete
 */
export function handlePageFileUpload(req, res, imageFields) {
  return new Promise((resolve, reject) => {
    const fields = imageFields.map(fieldName => ({ name: fieldName, maxCount: 1 }));
    
    upload.fields(fields)(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          reject(new ValidationError('File is too large. Max size is 5MB'));
        } else if (err.code === "LIMIT_FIELD_VALUE") {
          reject(new ValidationError('Field data is too large. Max size is 25MB'));
        } else if (err instanceof ValidationError) {
          reject(err);
        } else {
          reject(new ValidationError(`File upload failed: ${err.message}`));
        }
      } else {
        resolve();
      }
    });
  });
}

/**
 * Get image field configurations for different page types
 */
export const PAGE_IMAGE_CONFIGS = {
  about: ['bgImage', 'storyImage', 'aboutImage', 'teamImage', 'missionImage', 'visionImage', 'valuesImage'],
  landing: ['bgImage', 'aboutImage', 'textImage', 'imageOne', 'imageTwo', 'imageThree'],
  header: ['logo'],
  footer: ['logo']
};

/**
 * Get image fields for a specific page type
 * @param {string} pageType - Type of page
 * @returns {Array<string>} Array of image field names
 */
export function getImageFieldsForPageType(pageType) {
  const fields = PAGE_IMAGE_CONFIGS[pageType];
  if (!fields) {
    throw new ValidationError(`Unknown page type: ${pageType}`);
  }
  return fields;
}
