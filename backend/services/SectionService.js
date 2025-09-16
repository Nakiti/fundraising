import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} from '../utils/errors.js';

/**
 * Section Service - Handles page section-related business logic 
 */
export class SectionService extends BaseService {
  constructor() {
    super('page_sections');
  }

  /**
   * Validate section data
   * @param {Object} sectionData - Section data to validate
   * @param {boolean} isUpdate - Whether this is an update operation
   */
  validateSectionData(sectionData, isUpdate = false) {
    if (!isUpdate) {
      // Required fields for creation
      this.validateRequiredFields(sectionData, [
        'organization_id', 
        'page_type', 
        'page_reference_id', 
        'name', 
        'user_id'
      ]);
    }

    // Validate page_type
    if (sectionData.page_type) {
      const validPageTypes = [
        'about', 
        'landing', 
        'header', 
        'footer', 
        'donation_page', 
        'donation_form', 
        'thankyou_page',
        'ticket_page',
        'peer_fundraising_page',
        'peer_landing_page'
      ];
      if (!validPageTypes.includes(sectionData.page_type)) {
        throw new ValidationError(`Invalid page_type. Must be one of: ${validPageTypes.join(', ')}`);
      }
    }

    // Validate name length
    if (sectionData.name && sectionData.name.length > 255) {
      throw new ValidationError('Section name must be 255 characters or less');
    }

    // Validate display_order if provided
    if (sectionData.display_order !== undefined && sectionData.display_order !== null) {
      const order = parseInt(sectionData.display_order);
      if (isNaN(order) || order < 0) {
        throw new ValidationError('Display order must be a non-negative integer');
      }
    }

    // Validate organization_id and page_reference_id
    if (sectionData.organization_id && (!Number.isInteger(Number(sectionData.organization_id)) || Number(sectionData.organization_id) <= 0)) {
      throw new ValidationError('Organization ID must be a positive integer');
    }

    if (sectionData.page_reference_id && (!Number.isInteger(Number(sectionData.page_reference_id)) || Number(sectionData.page_reference_id) <= 0)) {
      throw new ValidationError('Page reference ID must be a positive integer');
    }
  }

  /**
   * Get the next display order for a page
   * @param {number} organizationId - Organization ID
   * @param {string} pageType - Page type
   * @param {number} pageReferenceId - Page reference ID
   * @returns {Promise<number>} Next display order value
   */
  async getNextDisplayOrder(organizationId, pageType, pageReferenceId) {
    const query = `
      SELECT COALESCE(MAX(display_order), -1) + 1 as next_order 
      FROM page_sections 
      WHERE organization_id = ? AND page_type = ? AND page_reference_id = ?
    `;
    
    const results = await this.executeQuery(query, [organizationId, pageType, pageReferenceId]);
    return results[0]?.next_order || 0;
  }

  /**
   * Check if section exists for specific page context
   * @param {number} organizationId - Organization ID
   * @param {string} pageType - Page type
   * @param {number} pageReferenceId - Page reference ID
   * @param {string} sectionName - Section name
   * @param {number} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if section exists
   */
  async checkSectionExists(organizationId, pageType, pageReferenceId, sectionName, excludeId = null) {
    let query = `
      SELECT id FROM page_sections 
      WHERE organization_id = ? AND page_type = ? AND page_reference_id = ? AND name = ?
    `;
    let params = [organizationId, pageType, pageReferenceId, sectionName];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const results = await this.executeQuery(query, params);
    return results && results.length > 0;
  }

  /**
   * Create a new section
   * @param {Object} sectionData - Section data
   * @returns {Promise<Object>} Created section data
   */
  async createSection(sectionData) {
    // Validate input data
    this.validateSectionData(sectionData, false);

    // Check for duplicate section name on the same page
    const sectionExists = await this.checkSectionExists(
      sectionData.organization_id,
      sectionData.page_type,
      sectionData.page_reference_id,
      sectionData.name
    );

    if (sectionExists) {
      throw new ValidationError('Section with this name already exists on this page');
    }

    // Get next display order
    const displayOrder = await this.getNextDisplayOrder(
      sectionData.organization_id,
      sectionData.page_type,
      sectionData.page_reference_id
    );

    // Prepare section data with defaults
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sectionToCreate = {
      organization_id: sectionData.organization_id,
      page_type: sectionData.page_type,
      page_reference_id: sectionData.page_reference_id,
      name: sectionData.name,
      active: sectionData.active !== undefined ? sectionData.active : true,
      display_order: sectionData.display_order !== undefined ? sectionData.display_order : displayOrder,
      created_at: now,
      updated_at: now,
      updated_by: sectionData.user_id
    };

    // Create section
    const result = await this.create(sectionToCreate);
    
    return { 
      id: result.insertId,
      ...sectionToCreate
    };
  }

  /**
   * Update an existing section
   * @param {number} sectionId - Section ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated section data
   */
  async updateSection(sectionId, updateData) {
    // Validate input data
    // console.log('updateData', updateData);
    this.validateSectionData(updateData, true);

    // Check if section exists
    const existingSection = await this.findById(sectionId);
    if (!existingSection) {
      throw new NotFoundError('Section not found');
    }

    // If updating name, check for duplicates
    if (updateData.name && updateData.name !== existingSection.name) {
      const sectionExists = await this.checkSectionExists(
        existingSection.organization_id,
        existingSection.page_type,
        existingSection.page_reference_id,
        updateData.name,
        sectionId
      );

      if (sectionExists) {
        throw new ValidationError('Section with this name already exists on this page');
      }
    }

    // Prepare update data
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    // Update section
    await this.update(sectionId, dataToUpdate);

    // Return updated section
    return await this.findById(sectionId);
  }

  /**
   * Bulk update sections' active flags
   * @param {Array<{id:number, active:number}>} items
   */
  async bulkUpdateSections(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Items array is required');
    }
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const ids = items.map((i) => i.id);
    // Validate all exist first
    const placeholders = ids.map(() => '?').join(', ');
    const checkQuery = `SELECT id FROM page_sections WHERE id IN (${placeholders})`;
    const existing = await this.executeQuery(checkQuery, ids);
    if (!existing || existing.length !== ids.length) {
      throw new NotFoundError('One or more sections not found');
    }

    // Build CASE update for active
    const caseClauses = items.map((i) => `WHEN id = ${Number(i.id)} THEN ${Number(i.active) ? 1 : 0}`).join(' ');
    const updateQuery = `
      UPDATE page_sections
      SET active = CASE ${caseClauses} END,
          updated_at = '${now}'
      WHERE id IN (${placeholders})
    `;
    await this.executeQuery(updateQuery, ids);
    return true;
  }

  /**
   * Get section by ID
   * @param {number} sectionId - Section ID
   * @returns {Promise<Object>} Section data
   */
  async getSection(sectionId) {
    if (!sectionId) {
      throw new ValidationError('Section ID is required');
    }

    const section = await this.findById(sectionId);
    if (!section) {
      throw new NotFoundError('Section not found');
    }

    return section;
  }

  /**
   * Get sections by page context
   * @param {number} organizationId - Organization ID
   * @param {string} pageType - Page type
   * @param {number} pageReferenceId - Page reference ID
   * @param {boolean} activeOnly - Whether to return only active sections
   * @returns {Promise<Array>} Array of sections
   */
  async getSectionsByPage(organizationId, pageType, pageReferenceId, activeOnly = false) {
    if (!organizationId || !pageType || !pageReferenceId) {
      throw new ValidationError('Organization ID, page type, and page reference ID are required');
    }

    let query = `
      SELECT * FROM page_sections 
      WHERE organization_id = ? AND page_type = ? AND page_reference_id = ?
    `;
    let params = [organizationId, pageType, pageReferenceId];

    if (activeOnly) {
      query += ' AND active = 1';
    }

    query += ' ORDER BY display_order ASC';

    const results = await this.executeQuery(query, params);
    return results || [];
  }

  /**
   * Get sections by page reference ID only (legacy support)
   * @param {number} pageReferenceId - Page reference ID
   * @returns {Promise<Array>} Array of sections
   */
  async getSectionsByPageReference(pageReferenceId) {
    if (!pageReferenceId) {
      throw new ValidationError('Page reference ID is required');
    }

    const query = `
      SELECT * FROM page_sections 
      WHERE page_reference_id = ? 
      ORDER BY display_order ASC
    `;

    const results = await this.executeQuery(query, [pageReferenceId]);
    return results || [];
  }

  /**
   * Update display order for multiple sections
   * @param {number} organizationId - Organization ID
   * @param {string} pageType - Page type
   * @param {number} pageReferenceId - Page reference ID
   * @param {Array} sections - Array of section objects with id and order
   * @returns {Promise<boolean>} True if successful
   */
  async updateSectionOrder(organizationId, pageType, pageReferenceId, sections) {
    if (!organizationId || !pageType || !pageReferenceId || !Array.isArray(sections)) {
      throw new ValidationError('Organization ID, page type, page reference ID, and sections array are required');
    }

    if (sections.length === 0) {
      throw new ValidationError('Sections array cannot be empty');
    }

    // Validate each section in the array
    sections.forEach((section, index) => {
      if (!section.id || typeof section.id !== 'number') {
        throw new ValidationError(`Section at index ${index} must have a valid numeric ID`);
      }
    });

    // Start a transaction for atomic updates
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    try {
      // Update each section's display order
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const query = `
          UPDATE page_sections 
          SET display_order = ?, updated_at = ? 
          WHERE id = ? AND organization_id = ? AND page_type = ? AND page_reference_id = ?
        `;
        
        const result = await this.executeQuery(query, [
          i, // Use array index as the new display order
          now,
          section.id,
          organizationId,
          pageType,
          pageReferenceId
        ]);

        if (result.affectedRows === 0) {
          throw new NotFoundError(`Section with ID ${section.id} not found or does not belong to the specified page`);
        }
      }

      return true;
    } catch (error) {
      throw new DatabaseError('Failed to update section order', error);
    }
  }

  /**
   * Delete a section
   * @param {number} sectionId - Section ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async deleteSection(sectionId) {
    if (!sectionId) {
      throw new ValidationError('Section ID is required');
    }

    // Check if section exists
    const section = await this.findById(sectionId);
    if (!section) {
      throw new NotFoundError('Section not found');
    }

    // Delete section
    const result = await this.delete(sectionId);
    return result.affectedRows > 0;
  }

  /**
   * Get section statistics for a page
   * @param {number} organizationId - Organization ID
   * @param {string} pageType - Page type
   * @param {number} pageReferenceId - Page reference ID
   * @returns {Promise<Object>} Section statistics
   */
  async getPageSectionStats(organizationId, pageType, pageReferenceId) {
    const query = `
      SELECT 
        COUNT(*) as total_sections,
        COUNT(CASE WHEN active = 1 THEN 1 END) as active_sections,
        COUNT(CASE WHEN active = 0 THEN 1 END) as inactive_sections,
        MAX(display_order) as max_order
      FROM page_sections 
      WHERE organization_id = ? AND page_type = ? AND page_reference_id = ?
    `;

    const results = await this.executeQuery(query, [organizationId, pageType, pageReferenceId]);
    const stats = results[0] || {
      total_sections: 0,
      active_sections: 0,
      inactive_sections: 0,
      max_order: 0
    };

    return {
      total_sections: stats.total_sections,
      active_sections: stats.active_sections,
      inactive_sections: stats.inactive_sections,
      max_order: stats.max_order || 0
    };
  }

  /**
   * Reorder sections by moving one section to a new position
   * @param {number} sectionId - Section ID to move
   * @param {number} newPosition - New position (0-based index)
   * @returns {Promise<boolean>} True if successful
   */
  async reorderSection(sectionId, newPosition) {
    if (!sectionId || newPosition < 0) {
      throw new ValidationError('Section ID and valid position are required');
    }

    // Get the section to move
    const section = await this.findById(sectionId);
    if (!section) {
      throw new NotFoundError('Section not found');
    }

    // Get all sections for the same page
    const allSections = await this.getSectionsByPage(
      section.organization_id,
      section.page_type,
      section.page_reference_id
    );

    if (newPosition >= allSections.length) {
      throw new ValidationError(`Position ${newPosition} is out of range. Maximum position is ${allSections.length - 1}`);
    }

    // Remove the section from its current position
    const sectionsToReorder = allSections.filter(s => s.id !== sectionId);
    
    // Insert it at the new position
    sectionsToReorder.splice(newPosition, 0, section);

    // Update the order for all sections
    return await this.updateSectionOrder(
      section.organization_id,
      section.page_type,
      section.page_reference_id,
      sectionsToReorder
    );
  }

  /**
   * Duplicate a section within the same page or to a different page
   * @param {number} sectionId - Section ID to duplicate
   * @param {Object} targetPage - Target page info (optional, defaults to same page)
   * @param {string} newName - New name for the duplicated section (optional)
   * @returns {Promise<Object>} Created duplicate section
   */
  async duplicateSection(sectionId, targetPage = null, newName = null) {
    if (!sectionId) {
      throw new ValidationError('Section ID is required');
    }

    // Get the original section
    const originalSection = await this.findById(sectionId);
    if (!originalSection) {
      throw new NotFoundError('Section not found');
    }

    // Prepare target page info
    const target = targetPage || {
      organization_id: originalSection.organization_id,
      page_type: originalSection.page_type,
      page_reference_id: originalSection.page_reference_id
    };

    // Generate new name if not provided
    const duplicateName = newName || `${originalSection.name} (Copy)`;

    // Create the duplicate
    const duplicateData = {
      organization_id: target.organization_id,
      page_type: target.page_type,
      page_reference_id: target.page_reference_id,
      name: duplicateName,
      active: originalSection.active,
      user_id: originalSection.updated_by // Use the same user who last updated the original
    };

    return await this.createSection(duplicateData);
  }
}
