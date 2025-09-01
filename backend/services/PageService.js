import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} from '../utils/errors.js';
import imageService from './imageService.js';
import { checkAndUpdateOrganizationStatus } from '../controllers/organization_status.js';

/**
 * Page Service - Unified service for managing all page types (about, landing, header, footer, etc.)
 */
export class PageService extends BaseService {
  constructor() {
    super('pages'); // Generic table name, overridden for specific pages
  }

  /**
   * Get page configuration schema for a specific page type
   * @param {string} pageType - Type of page (about, landing, header, footer)
   * @returns {Object} Page configuration object
   */
  getPageSchema(pageType) {
    const schemas = {
      'about': {
        table: 'about_pages',
        folder: 'about-pages',
        images: {
          bgImage: { category: 'hero', required: false },
          storyImage: { category: 'story', required: false },
          aboutImage: { category: 'about', required: false },
          teamImage: { category: 'team', required: false },
          missionImage: { category: 'mission', required: false },
          visionImage: { category: 'vision', required: false },
          valuesImage: { category: 'values', required: false }
        },
        requiredFields: ['organization_id', 'title'],
        designDefaults: {
          banner_title_text: '#ffffff',
          banner_subtitle_text: '#ffffff',
          hero_title_size: '36px',
          hero_subtitle_size: '16px',
          section_title_size: '28px',
          body_text_size: '14px',
          button_text_size: '14px',
          card_title_size: '18px',
          hero_height: '500px',
          section_padding: '80px',
          card_radius: '4px',
          button_radius: '4px',
          overlay_opacity: 0.3,
          accent_color: '#1F2937'
        },
        booleanDefaults: {
          show_video_button: true,
          show_hero_icons: true,
          show_feature_icons: true,
          show_team_photos: true,
          show_mission_section: true,
          show_vision_section: true,
          show_values_section: true,
          show_hover_effects: true
        }
      },
      'landing': {
        table: 'landing_pages',
        folder: 'landing-pages',
        images: {
          bgImage: { category: 'banner', required: false },
          aboutImage: { category: 'about', required: false },
          textImage: { category: 'impact', required: false },
          imageOne: { category: 'triple', required: false },
          imageTwo: { category: 'triple', required: false },
          imageThree: { category: 'triple', required: false }
        },
        requiredFields: ['organization_id', 'title'],
        designDefaults: {
          hero_title_size: '36px',
          hero_subtitle_size: '16px',
          section_title_size: '28px',
          body_text_size: '14px',
          button_text_size: '14px',
          card_title_size: '18px',
          hero_height: '500px',
          section_padding: '80px',
          card_radius: '4px',
          button_radius: '4px',
          overlay_opacity: 0.3,
          accent_color: '#1F2937'
        },
        booleanDefaults: {
          show_video_button: true,
          show_hero_icons: true,
          show_feature_icons: true,
          show_campaign_badges: true,
          show_trust_badge: true,
          show_progress_indicators: true,
          show_statistics: true,
          show_hover_effects: true
        }
      },
      'header': {
        table: 'header_pages',
        folder: 'header-pages',
        images: {
          logo: { category: 'logo', required: false }
        },
        requiredFields: ['organization_id', 'user_id'],
        designDefaults: {},
        booleanDefaults: {}
      },
      'footer': {
        table: 'footer_pages',
        folder: 'footer-pages',
        images: {
          logo: { category: 'logo', required: false }
        },
        requiredFields: ['organization_id', 'user_id'],
        designDefaults: {},
        booleanDefaults: {}
      }
    };

    if (!schemas[pageType]) {
      throw new ValidationError(`Unknown page type: ${pageType}`);
    }

    return schemas[pageType];
  }

  /**
   * Process and upload images for a page
   * @param {string} pageType - Type of page
   * @param {number} organizationId - Organization ID
   * @param {Object} files - Uploaded files from multer
   * @param {string|number} pageId - Page ID ('temp' for new pages)
   * @returns {Promise<Object>} Object with uploaded image paths
   */
  async processPageImages(pageType, organizationId, files = {}, pageId = 'temp') {
    const pageConfig = this.getPageSchema(pageType);
    const uploadedPaths = {};

    // Process each configured image field
    for (const [fieldName, imageConfig] of Object.entries(pageConfig.images)) {
      if (files[fieldName]?.[0]) {
        try {
          // Validate file
          imageService.validateFile(files[fieldName][0]);
          
          // Upload to appropriate location
          const uploadPath = await imageService.uploadImage(
            organizationId,
            pageConfig.folder,
            pageId,
            imageConfig.category,
            files[fieldName][0]
          );
          
          uploadedPaths[fieldName] = uploadPath;
        } catch (error) {
          // Clean up any previously uploaded images on error
          await this.cleanupFailedUploads(Object.values(uploadedPaths));
          throw new ValidationError(`Failed to process ${fieldName}: ${error.message}`);
        }
      }
    }

    return uploadedPaths;
  }

  /**
   * Clean up uploaded images when operation fails
   * @param {Array<string>} imagePaths - Array of image paths to delete
   */
  async cleanupFailedUploads(imagePaths) {
    if (!imageService.getStatus().isAzureConfigured || !imagePaths.length) {
      return;
    }

    try {
      await Promise.all(
        imagePaths.filter(path => path).map(path => imageService.deleteImage(path))
      );
    } catch (error) {
      console.warn('Failed to cleanup uploaded images:', error.message);
    }
  }

  /**
   * Move images from temporary location to final page location
   * @param {string} pageType - Type of page
   * @param {number} organizationId - Organization ID
   * @param {Object} tempPaths - Temporary image paths
   * @param {number} finalPageId - Final page ID
   * @param {Object} originalFiles - Original file objects from multer
   */
  async moveImagesFromTemp(pageType, organizationId, tempPaths, finalPageId, originalFiles) {
    if (!imageService.getStatus().isAzureConfigured) {
      return;
    }

    const pageConfig = this.getPageSchema(pageType);

    try {
      for (const [fieldName, tempPath] of Object.entries(tempPaths)) {
        if (tempPath && originalFiles[fieldName]?.[0]) {
          const imageConfig = pageConfig.images[fieldName];
          await imageService.updateImage(
            organizationId,
            pageConfig.folder,
            finalPageId,
            imageConfig.category,
            originalFiles[fieldName][0],
            tempPath
          );
        }
      }
    } catch (error) {
      console.warn('Failed to move images from temp to final location:', error.message);
    }
  }

  /**
   * Apply default design settings to page data
   * @param {string} pageType - Type of page
   * @param {Object} pageData - Page data object
   * @returns {Object} Page data with defaults applied
   */
  applyDefaultDesignSettings(pageType, pageData) {
    const pageConfig = this.getPageSchema(pageType);
    const result = { ...pageData };

    // Apply design defaults
    for (const [key, defaultValue] of Object.entries(pageConfig.designDefaults)) {
      if (result[key] === undefined || result[key] === null) {
        result[key] = defaultValue;
      }
    }

    // Apply boolean defaults
    for (const [key, defaultValue] of Object.entries(pageConfig.booleanDefaults)) {
      if (result[key] === undefined || result[key] === null) {
        result[key] = defaultValue;
      } else {
        // Ensure boolean values are properly converted
        result[key] = result[key] !== false && result[key] !== 'false';
      }
    }

    return result;
  }

  /**
   * Validate page data according to page type requirements
   * @param {string} pageType - Type of page
   * @param {Object} pageData - Page data to validate
   */
  validatePageData(pageType, pageData) {
    const pageConfig = this.getPageSchema(pageType);
    
    // Validate required fields
    this.validateRequiredFields(pageData, pageConfig.requiredFields);

    // Additional validation can be added here for specific page types
    if (pageType === 'about' || pageType === 'landing') {
      // Validate color values if provided
      const colorFields = ['bg_color', 'p_color', 's_color', 'c_color', 'ct_color', 'b_color', 'bt_color'];
      for (const field of colorFields) {
        if (pageData[field] && !this.isValidColor(pageData[field])) {
          throw new ValidationError(`Invalid color value for ${field}: ${pageData[field]}`);
        }
      }

      // Validate size values if provided
      const sizeFields = ['hero_title_size', 'hero_subtitle_size', 'section_title_size', 'body_text_size'];
      for (const field of sizeFields) {
        if (pageData[field] && !this.isValidSize(pageData[field])) {
          throw new ValidationError(`Invalid size value for ${field}: ${pageData[field]}`);
        }
      }
    }
  }

  /**
   * Validate color value (hex, rgb, or named color)
   * @param {string} color - Color value to validate
   * @returns {boolean} True if valid color
   */
  isValidColor(color) {
    // Basic validation for hex colors, rgb, rgba, or common color names
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/;
    const namedColors = ['transparent', 'inherit', 'currentColor'];
    
    return hexPattern.test(color) || rgbPattern.test(color) || namedColors.includes(color);
  }

  /**
   * Validate size value (px, em, rem, %, etc.)
   * @param {string} size - Size value to validate
   * @returns {boolean} True if valid size
   */
  isValidSize(size) {
    const sizePattern = /^\d+(\.\d+)?(px|em|rem|%|vh|vw)$/;
    return sizePattern.test(size);
  }

  /**
   * Build database query for page operations
   * @param {string} pageType - Type of page
   * @param {string} operation - Operation type ('INSERT' or 'UPDATE')
   * @param {Object} data - Data object
   * @param {Object} imagePaths - Image paths object
   * @returns {Object} Query object with sql and values
   */
  buildPageQuery(pageType, operation, data, imagePaths = {}) {
    const pageConfig = this.getPageSchema(pageType);
    const tableName = pageConfig.table;

    if (operation === 'INSERT') {
      return this.buildInsertQuery(tableName, data, imagePaths);
    } else if (operation === 'UPDATE') {
      return this.buildUpdateQuery(tableName, data, imagePaths);
    } else {
      throw new ValidationError(`Unknown operation: ${operation}`);
    }
  }

  /**
   * Build INSERT query for page creation
   * @param {string} tableName - Database table name
   * @param {Object} data - Page data
   * @param {Object} imagePaths - Image paths
   * @returns {Object} Query object
   */
  buildInsertQuery(tableName, data, imagePaths) {
    const allData = { ...data, ...imagePaths };
    const columns = Object.keys(allData);
    const placeholders = columns.map(() => '?').join(', ');
    const values = columns.map(col => allData[col]);

    const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    return { sql, values };
  }

  /**
   * Build UPDATE query for page modification
   * @param {string} tableName - Database table name
   * @param {Object} data - Page data
   * @param {Object} imagePaths - Image paths
   * @returns {Object} Query object
   */
  buildUpdateQuery(tableName, data, imagePaths) {
    const { id, ...updateData } = data;
    const allData = { ...updateData, ...imagePaths };
    
    const setClauses = Object.keys(allData).map(col => `${col} = ?`);
    const values = [...Object.values(allData), id];

    const sql = `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE id = ?`;
    
    return { sql, values };
  }

  /**
   * Create a new page of specified type
   * @param {string} pageType - Type of page to create
   * @param {number} organizationId - Organization ID
   * @param {Object} pageData - Page content and design data
   * @param {Object} files - Uploaded files
   * @returns {Promise<Object>} Created page data
   */
  async createPage(pageType, organizationId, pageData, files = {}) {
    // Validate page data
    this.validatePageData(pageType, { ...pageData, organization_id: organizationId });

    // Apply default design settings
    const dataWithDefaults = this.applyDefaultDesignSettings(pageType, pageData);

    // Process image uploads
    const imagePaths = await this.processPageImages(pageType, organizationId, files, 'temp');

    try {
      // Build and execute database query
      const { sql, values } = this.buildPageQuery(pageType, 'INSERT', {
        organization_id: organizationId,
        ...dataWithDefaults
      }, imagePaths);

      const result = await this.executeQuery(sql, values);
      const pageId = result.insertId;

      // Move images from temp to final location
      await this.moveImagesFromTemp(pageType, organizationId, imagePaths, pageId, files);

      // Update organization status
      try {
        await checkAndUpdateOrganizationStatus(organizationId);
      } catch (statusError) {
        console.warn('Failed to update organization status:', statusError.message);
      }

      return {
        id: pageId,
        organization_id: organizationId,
        ...dataWithDefaults,
        ...imagePaths
      };

    } catch (error) {
      // Clean up uploaded images on database error
      await this.cleanupFailedUploads(Object.values(imagePaths));
      throw error;
    }
  }

  /**
   * Update an existing page
   * @param {string} pageType - Type of page to update
   * @param {number} pageId - Page ID
   * @param {Object} pageData - Updated page data
   * @param {Object} files - New uploaded files
   * @returns {Promise<Object>} Updated page data
   */
  async updatePage(pageType, pageId, pageData, files = {}) {
    const pageConfig = this.getPageSchema(pageType);

    // Validate that page exists
    const existingPage = await this.executeQuery(
      `SELECT * FROM ${pageConfig.table} WHERE id = ?`,
      [pageId]
    );

    if (!existingPage || existingPage.length === 0) {
      throw new NotFoundError(`${pageType} page`);
    }

    // Validate page data
    this.validatePageData(pageType, pageData);

    // Apply default design settings
    const dataWithDefaults = this.applyDefaultDesignSettings(pageType, pageData);

    // Process new image uploads if any
    const imagePaths = await this.processPageImages(pageType, existingPage[0].organization_id, files, pageId);

    try {
      // Build and execute update query
      const { sql, values } = this.buildPageQuery(pageType, 'UPDATE', {
        id: pageId,
        ...dataWithDefaults
      }, imagePaths);

      await this.executeQuery(sql, values);

      // Move new images from temp to final location
      await this.moveImagesFromTemp(pageType, existingPage[0].organization_id, imagePaths, pageId, files);

      return {
        id: pageId,
        ...dataWithDefaults,
        ...imagePaths
      };

    } catch (error) {
      // Clean up uploaded images on database error
      await this.cleanupFailedUploads(Object.values(imagePaths));
      throw error;
    }
  }

  /**
   * Get a page by ID or organization ID
   * @param {string} pageType - Type of page
   * @param {number} identifier - Page ID or organization ID
   * @param {string} identifierType - 'id' or 'organization_id'
   * @returns {Promise<Object>} Page data with image URLs
   */
  async getPage(pageType, identifier, identifierType = 'organization_id') {
    const pageConfig = this.getPageSchema(pageType);
    const validIdentifierTypes = ['id', 'organization_id'];

    if (!validIdentifierTypes.includes(identifierType)) {
      throw new ValidationError(`Invalid identifier type: ${identifierType}`);
    }

    const query = `SELECT * FROM ${pageConfig.table} WHERE ${identifierType} = ?`;
    const results = await this.executeQuery(query, [identifier]);

    if (!results || results.length === 0) {
      throw new NotFoundError(`${pageType} page`);
    }

    const page = results[0];

    // Generate image URLs for all configured image fields
    for (const fieldName of Object.keys(pageConfig.images)) {
      if (page[fieldName]) {
        page[`${fieldName}Url`] = await imageService.getImageUrl(page[fieldName], 'public');
      }
    }

    return page;
  }

  /**
   * Delete a page
   * @param {string} pageType - Type of page
   * @param {number} pageId - Page ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async deletePage(pageType, pageId) {
    const pageConfig = this.getPageSchema(pageType);

    // Get page data to clean up images
    const page = await this.getPage(pageType, pageId, 'id');

    // Delete from database
    const query = `DELETE FROM ${pageConfig.table} WHERE id = ?`;
    await this.executeQuery(query, [pageId]);

    // Clean up associated images
    const imagePaths = Object.keys(pageConfig.images)
      .map(fieldName => page[fieldName])
      .filter(path => path);

    await this.cleanupFailedUploads(imagePaths);

    return true;
  }

  // Convenience methods for specific page types
  async createAboutPage(organizationId, pageData, files) {
    return await this.createPage('about', organizationId, pageData, files);
  }

  async createLandingPage(organizationId, pageData, files) {
    return await this.createPage('landing', organizationId, pageData, files);
  }

  async createHeaderPage(organizationId, pageData, files) {
    return await this.createPage('header', organizationId, pageData, files);
  }

  async createFooterPage(organizationId, pageData, files) {
    return await this.createPage('footer', organizationId, pageData, files);
  }

  async updateAboutPage(pageId, pageData, files) {
    return await this.updatePage('about', pageId, pageData, files);
  }

  async updateLandingPage(pageId, pageData, files) {
    return await this.updatePage('landing', pageId, pageData, files);
  }

  async updateHeaderPage(pageId, pageData, files) {
    return await this.updatePage('header', pageId, pageData, files);
  }

  async updateFooterPage(pageId, pageData, files) {
    return await this.updatePage('footer', pageId, pageData, files);
  }

  async getAboutPage(organizationId) {
    return await this.getPage('about', organizationId);
  }

  async getLandingPage(organizationId) {
    return await this.getPage('landing', organizationId);
  }

  async getHeaderPage(organizationId) {
    return await this.getPage('header', organizationId);
  }

  async getFooterPage(organizationId) {
    return await this.getPage('footer', organizationId);
  }
}
