import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} from '../utils/errors.js';
import imageService from './imageService.js';
import { pageSchemas } from './pages/config.js';
import { applyDefaultDesignSettings, validatePageData } from './pages/validation.js';
import { processPageImages, moveImagesFromTemp, cleanupFailedUploads } from './pages/imageLifecycle.js';
import { ThemeService } from './ThemeService.js';
// Note: Organization status updates are handled by the OrganizationStatusService
// We'll access it through the service registry to avoid circular dependencies

/**
 * Page Service - Unified service for managing all page types (about, landing, header, footer, etc.)
 */
export class PageService extends BaseService {
  constructor() {
    super('pages'); // Generic table name, overridden for specific pages
    this.themeService = new ThemeService();
  }

  /**
   * Get page configuration schema for a specific page type
   * @param {string} pageType - Type of page (about, landing, header, footer)
   * @returns {Object} Page configuration object
   */
  getPageSchema(pageType) {
    const schema = pageSchemas[pageType];
    if (!schema) {
      throw new ValidationError(`Unknown page type: ${pageType}`);
    }
    return schema;
  }

  /**
   * Get organization ID for campaign-based pages
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<number>} Organization ID
   */
  async getOrganizationIdFromCampaign(campaignId) {
    const query = 'SELECT organization_id FROM campaigns WHERE id = ?';
    const results = await this.executeQuery(query, [campaignId]);
    
    if (!results || results.length === 0) {
      throw new NotFoundError('Campaign not found');
    }
    
    return results[0].organization_id;
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
   * @param {number} organizationId - Organization ID (for org-based pages)
   * @param {number} campaignId - Campaign ID (for campaign-based pages)  
   * @param {Object} pageData - Page content and design data
   * @param {Object} files - Uploaded files
   * @returns {Promise<Object>} Created page data
   */
  async createPage(pageType, organizationId, campaignId, pageData = {}, files = {}) {
    const pageConfig = this.getPageSchema(pageType);
    
    // Validate required IDs and fields
    if (pageConfig.isCampaignBased) {
      this.validateRequiredFields({ campaign_id: campaignId }, ['campaign_id']);
      this.validateRequiredFields(pageData, pageConfig.requiredFields);
      validatePageData(pageType, { ...pageData, campaign_id: campaignId }, pageConfig);
    } else {
      this.validateRequiredFields({ organization_id: organizationId }, ['organization_id']);
      this.validateRequiredFields(pageData, pageConfig.requiredFields);
      validatePageData(pageType, { ...pageData, organization_id: organizationId }, pageConfig);
    }

    // Apply default design settings
    const dataWithDefaults = applyDefaultDesignSettings(pageConfig, pageData);

    // Process image uploads
    const imagePaths = await processPageImages(pageConfig, organizationId, campaignId, files, 'temp');

    try {
      // Build and execute database query
      let queryData;
      if (pageConfig.isCampaignBased) {
        queryData = {
          campaign_id: campaignId,
          ...dataWithDefaults
        };
      } else {
        queryData = {
          organization_id: organizationId,
          ...dataWithDefaults
        };
      }

      const { sql, values } = this.buildPageQuery(pageType, 'INSERT', queryData, imagePaths);

      const result = await this.executeQuery(sql, values);
      const pageId = result.insertId;

      // Move images from temp to final location
      let actualOrgId = organizationId;
      if (pageConfig.isCampaignBased && campaignId) {
        try {
          actualOrgId = await this.getOrganizationIdFromCampaign(campaignId);
        } catch (e) {
          // If we cannot resolve organization, keep original
        }
      }
      await moveImagesFromTemp(pageConfig, actualOrgId, imagePaths, pageId, files);

      // Update organization status (for organization-based pages)
      if (!pageConfig.isCampaignBased) {
        try {
          // Use dynamic import to avoid circular dependency
          const { getOrganizationStatusService } = await import('./ServiceRegistry.js');
          const orgStatusService = getOrganizationStatusService();
          await orgStatusService.checkAndUpdateOrganizationStatus(organizationId);
        } catch (statusError) {
          console.warn('Failed to update organization status:', statusError.message);
        }
      }

      return {
        id: pageId,
        ...(pageConfig.isCampaignBased ? { campaign_id: campaignId } : { organization_id: organizationId }),
        ...dataWithDefaults,
        ...imagePaths
      };

    } catch (error) {
      // Clean up uploaded images on database error
      await cleanupFailedUploads(Object.values(imagePaths));
      throw error;
    }
  }

  /**
   * Update an existing page
   * @param {string} pageType - Type of page to update
   * @param {number} organizationId - Organization ID (for org-based pages)
   * @param {number} campaignId - Campaign ID (for campaign-based pages)
   * @param {number} pageId - Page ID
   * @param {Object} pageData - Updated page data
   * @param {Object} files - New uploaded files 
   * @returns {Promise<Object>} Updated page data
   */
  async updatePage(pageType, organizationId, campaignId = null, pageId, pageData, files = {}) {
    // const pageConfig = this.getPageSchema(pageType);

    // console.log('organizationId', organizationId);
    // console.log('campaignId', campaignId);
    // console.log('pageType', pageType);
    // console.log('pageId', pageId);
    // console.log('pageData', pageData);
    // console.log('files', files);

    // For campaign-based pages, get the page with campaign info
    // let query;
    // if (pageConfig.isCampaignBased) {
    //   //query = `SELECT p.*, c.organization_id FROM ${pageConfig.table} p JOIN campaigns c ON p.campaign_id = c.id WHERE p.id = ?`;
    //   query = `SELECT * FROM ${pageConfig.table} WHERE campaign_id = ?`;
    // } else {
    //   query = `SELECT * FROM ${pageConfig.table} WHERE campaign_id = ?`;
    // }

    // const existingPage = await this.executeQuery(query, [pageId]);

    // if (!existingPage || existingPage.length === 0) {
    //   throw new NotFoundError(`${pageType} page`);
    // }

    // Validate page data
    const pageConfig = this.getPageSchema(pageType);
    this.validateRequiredFields(pageData, pageConfig.requiredFields);
    validatePageData(pageType, pageData, pageConfig);
    // console.log('pageData', pageData);

    // Apply default design settings
    const dataWithDefaults = applyDefaultDesignSettings(pageConfig, pageData);

    // Process new image uploads if any
      // const organizationId = pageData.organization_id;
      // const campaignId = pageConfig.isCampaignBased ? pageData.campaign_id : null;
    console.log("files", files)
    console.log("organizationId", organizationId)
    console.log("campaignId", campaignId)
    console.log("pageId", pageId)
    console.log("pageConfig", pageConfig)
    const imagePaths = await processPageImages(pageConfig, organizationId, campaignId, files, pageId);

    try {
      // Build and execute update query
      console.log("imagePaths", imagePaths)
      console.log("dataWithDefaults", dataWithDefaults)
      // Exclude image fields from data updates unless a new file was uploaded
      const imageFieldNames = Object.keys(pageConfig.images || {});
      const filteredData = Object.fromEntries(
        Object.entries(dataWithDefaults).filter(([key]) => !imageFieldNames.includes(key))
      );

      const { sql, values } = this.buildPageQuery(pageType, 'UPDATE', {
        id: pageId,
        ...filteredData
      }, imagePaths);


      await this.executeQuery(sql, values);

      // Move new images from temp to final location
      let actualOrgId = organizationId;
      if (pageConfig.isCampaignBased && campaignId) {
        try {
          actualOrgId = await this.getOrganizationIdFromCampaign(campaignId);
        } catch (e) {}
      }
      await moveImagesFromTemp(pageConfig, actualOrgId, imagePaths, pageId, files);

      return {
        id: pageId,
        ...filteredData,
        ...imagePaths
      };

    } catch (error) {
      // Clean up uploaded images on database error
      await cleanupFailedUploads(Object.values(imagePaths));
      throw error;
    }
  }

  /**
   * Get a page by ID, organization ID, or campaign ID
   * @param {string} pageType - Type of page
   * @param {number} identifier - Page ID, organization ID, or campaign ID
   * @param {string} identifierType - 'id', 'organization_id', or 'campaign_id'
   * @returns {Promise<Object>} Page data with image URLs
   */
  async getPage(pageType, identifier, identifierType = 'organization_id') { 
    const pageConfig = this.getPageSchema(pageType);
    const validIdentifierTypes = ['id', 'organization_id', 'campaign_id'];

    if (!validIdentifierTypes.includes(identifierType)) {
      throw new ValidationError(`Invalid identifier type: ${identifierType}`); 
    }

    // For campaign-based pages, use appropriate identifier type
    if (pageConfig.isCampaignBased && identifierType === 'organization_id') {
      identifierType = 'campaign_id';
    }

    const query = `SELECT * FROM ${pageConfig.table} WHERE ${identifierType} = ?`;
    const results = await this.executeQuery(query, [identifier]);

    if (!results || results.length === 0) { 
      throw new NotFoundError(`${pageType} page`);
    }

    const page = results[0];

    // console.log("page", page)
    // console.log("pageConfig.images", pageConfig.images)

    // Generate image URLs for all configured image fields
    for (const fieldName of Object.keys(pageConfig.images)) {
      if (page[fieldName]) {
        page[`${fieldName}Url`] = await imageService.getImageUrl(page[fieldName], 'public');
        // console.log("fieldName", fieldName)
        // console.log("page[`${fieldName}Url`]", page[`${fieldName}Url`])
      }
    }

    return page;
  }

  /**
   * Get page with merged theme colors (organization theme + page overrides)
   * @param {string} pageType - Type of page
   * @param {number} identifier - Page identifier (organization_id, campaign_id, or page id)
   * @param {string} identifierType - Type of identifier ('organization_id', 'campaign_id', or 'id')
   * @param {boolean} includeTheme - Whether to include merged theme colors
   * @returns {Promise<Object>} Page data with merged theme colors
   */
  async getPageWithTheme(pageType, identifier, identifierType = 'organization_id', includeTheme = true) {
    // Get the base page data
    const page = await this.getPage(pageType, identifier, identifierType);
    
    if (!includeTheme) {
      return page;
    }

    // Determine organization ID for theme lookup
    let organizationId;
    if (identifierType === 'organization_id') {
      organizationId = identifier;
    } else if (identifierType === 'campaign_id') {
      organizationId = await this.getOrganizationIdFromCampaign(identifier);
    } else if (identifierType === 'id') {
      // For page ID, we need to get the organization_id from the page data
      const pageConfig = this.getPageSchema(pageType);
      if (pageConfig.isCampaignBased) {
        organizationId = await this.getOrganizationIdFromCampaign(page.campaign_id);
      } else {
        organizationId = page.organization_id;
      }
    }

    if (!organizationId) {
      // If we can't determine organization ID, return page without theme
      return page;
    }

    try {
      // Get merged theme colors
      const mergedTheme = await this.themeService.getMergedTheme(organizationId, page);
      
      // Add theme colors to page data
      return {
        ...page,
        theme: mergedTheme
      };
    } catch (error) {
      // If theme lookup fails, return page without theme
      console.warn(`Failed to load theme for organization ${organizationId}:`, error.message);
      return page;
    }
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

    await cleanupFailedUploads(imagePaths);

    return true;
  }

  // Convenience methods for specific page types
  async createAboutPage(organizationId, pageData, files) {
    return await this.createPage('about', organizationId, null, pageData, files);
  }

  async createLandingPage(organizationId, pageData, files) {
    return await this.createPage('landing', organizationId, null, pageData, files);
  }

  async createHeaderPage(organizationId, pageData, files) {
    return await this.createPage('header', organizationId, null, pageData, files);
  }

  async createFooterPage(organizationId, pageData, files) {
    return await this.createPage('footer', organizationId, null, pageData, files);
  }

  async updateAboutPage(organizationId, pageId, pageData, files) {
    return await this.updatePage('about', organizationId, null, pageId, pageData, files);
  }

  async updateLandingPage(organizationId, pageId, pageData, files) {
    return await this.updatePage('landing', organizationId, null, pageId, pageData, files);
  }

  async updateHeaderPage(organizationId, pageId, pageData, files) {
    return await this.updatePage('header', organizationId, null, pageId, pageData, files);
  }

  async updateFooterPage(organizationId, pageId, pageData, files) {
    return await this.updatePage('footer', organizationId, null, pageId, pageData, files);
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

  // Convenience methods for donation-related pages 
  async createDonationPage(campaignId, pageData = {}, files = {}) {  
    return await this.createPage('donation-page', null, campaignId, pageData, files);
  }

  async createDonationForm(campaignId, pageData = {}, files = {}) {
    return await this.createPage('donation-form', null, campaignId, pageData, files);
  }

  async createThankYouPage(campaignId, pageData = {}, files = {}) {
    return await this.createPage('thankyou-page', null, campaignId, pageData, files);
  }

  async updateDonationPage(organizationId, campaignId, pageId, pageData, files) {
    return await this.updatePage('donation-page', organizationId, campaignId, pageId, pageData, files);
  }

  async updateDonationForm(organizationId, campaignId, pageId, pageData, files) {
    return await this.updatePage('donation-form', organizationId, campaignId, pageId, pageData, files);
  }

  async updateThankYouPage(organizationId, campaignId, pageId, pageData, files) {
    return await this.updatePage('thankyou-page', organizationId, campaignId, pageId, pageData, files);
  }

  async getDonationPage(campaignId) {
    return await this.getPage('donation-page', campaignId, 'campaign_id');
  }

  async getDonationForm(campaignId) {
    return await this.getPage('donation-form', campaignId, 'campaign_id');
  }

  async getThankYouPage(campaignId) {
    return await this.getPage('thankyou-page', campaignId, 'campaign_id');
  }
}
