import { BaseService } from './BaseService.js';
import { ValidationError, NotFoundError, DatabaseError } from '../utils/errors.js';

/**
 * Theme Service - Manages organization theme colors and inheritance
 */
export class ThemeService extends BaseService {
  constructor() {
    super('organization_themes');
  }

  /**
   * Get theme colors for an organization
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Theme colors object
   */
  async getOrganizationTheme(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    try {
      const query = `
        SELECT 
          primary_color,
          secondary_color,
          accent_color,
          background_color,
          surface_color,
          text_primary_color,
          text_secondary_color,
          text_muted_color,
          button_background_color,
          button_text_color,
          button_hover_color,
          border_color,
          divider_color,
          success_color,
          error_color,
          warning_color,
          created_at,
          updated_at
        FROM organization_themes 
        WHERE organization_id = ?
      `;
      
      const results = await this.executeQuery(query, [organizationId]);
      
      if (!results || results.length === 0) {
        // Return default theme if no custom theme exists
        return this.getDefaultTheme();
      }
      
      return results[0];
    } catch (error) {
      throw new DatabaseError('Failed to fetch organization theme', error);
    }
  }

  /**
   * Create or update organization theme
   * @param {number} organizationId - Organization ID
   * @param {Object} themeData - Theme color data
   * @returns {Promise<Object>} Updated theme object
   */
  async saveOrganizationTheme(organizationId, themeData) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    // Validate theme data
    this.validateThemeData(themeData);

    try {
      // Check if theme already exists
      const existingTheme = await this.getOrganizationTheme(organizationId);
      
      if (existingTheme && existingTheme.primary_color) {
        // Update existing theme
        return await this.updateTheme(organizationId, themeData);
      } else {
        // Create new theme
        return await this.createTheme(organizationId, themeData);
      }
    } catch (error) {
      throw new DatabaseError('Failed to save organization theme', error);
    }
  }

  /**
   * Create new organization theme
   * @param {number} organizationId - Organization ID
   * @param {Object} themeData - Theme color data
   * @returns {Promise<Object>} Created theme object
   */
  async createTheme(organizationId, themeData) {
    const query = `
      INSERT INTO organization_themes (
        organization_id,
        primary_color,
        secondary_color,
        accent_color,
        background_color,
        surface_color,
        text_primary_color,
        text_secondary_color,
        text_muted_color,
        button_background_color,
        button_text_color,
        button_hover_color,
        border_color,
        divider_color,
        success_color,
        error_color,
        warning_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      organizationId,
      themeData.primary_color || '#1F2937',
      themeData.secondary_color || '#6B7280',
      themeData.accent_color || '#3B82F6',
      themeData.background_color || '#FFFFFF',
      themeData.surface_color || '#F9FAFB',
      themeData.text_primary_color || '#111827',
      themeData.text_secondary_color || '#6B7280',
      themeData.text_muted_color || '#9CA3AF',
      themeData.button_background_color || '#3B82F6',
      themeData.button_text_color || '#FFFFFF',
      themeData.button_hover_color || '#2563EB',
      themeData.border_color || '#E5E7EB',
      themeData.divider_color || '#F3F4F6',
      themeData.success_color || '#10B981',
      themeData.error_color || '#EF4444',
      themeData.warning_color || '#F59E0B'
    ];

    await this.executeQuery(query, values);
    return await this.getOrganizationTheme(organizationId);
  }

  /**
   * Update existing organization theme
   * @param {number} organizationId - Organization ID
   * @param {Object} themeData - Theme color data
   * @returns {Promise<Object>} Updated theme object
   */
  async updateTheme(organizationId, themeData) {
    const query = `
      UPDATE organization_themes SET
        primary_color = ?,
        secondary_color = ?,
        accent_color = ?,
        background_color = ?,
        surface_color = ?,
        text_primary_color = ?,
        text_secondary_color = ?,
        text_muted_color = ?,
        button_background_color = ?,
        button_text_color = ?,
        button_hover_color = ?,
        border_color = ?,
        divider_color = ?,
        success_color = ?,
        error_color = ?,
        warning_color = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE organization_id = ?
    `;

    const values = [
      themeData.primary_color || '#1F2937',
      themeData.secondary_color || '#6B7280',
      themeData.accent_color || '#3B82F6',
      themeData.background_color || '#FFFFFF',
      themeData.surface_color || '#F9FAFB',
      themeData.text_primary_color || '#111827',
      themeData.text_secondary_color || '#6B7280',
      themeData.text_muted_color || '#9CA3AF',
      themeData.button_background_color || '#3B82F6',
      themeData.button_text_color || '#FFFFFF',
      themeData.button_hover_color || '#2563EB',
      themeData.border_color || '#E5E7EB',
      themeData.divider_color || '#F3F4F6',
      themeData.success_color || '#10B981',
      themeData.error_color || '#EF4444',
      themeData.warning_color || '#F59E0B',
      organizationId
    ];

    await this.executeQuery(query, values);
    return await this.getOrganizationTheme(organizationId);
  }

  /**
   * Get merged theme colors for a page (organization theme + page overrides)
   * @param {number} organizationId - Organization ID
   * @param {Object} pageColors - Page-specific color overrides
   * @returns {Promise<Object>} Merged theme object
   */
  async getMergedTheme(organizationId, pageColors = {}) {
    const organizationTheme = await this.getOrganizationTheme(organizationId);
    
    // Merge organization theme with page-specific overrides
    return {
      // Core brand colors
      primary_color: pageColors.primary_color || pageColors.p_color || organizationTheme.primary_color,
      secondary_color: pageColors.secondary_color || pageColors.s_color || organizationTheme.secondary_color,
      accent_color: pageColors.accent_color || organizationTheme.accent_color,
      
      // Background colors
      background_color: pageColors.background_color || pageColors.bg_color || organizationTheme.background_color,
      surface_color: pageColors.surface_color || pageColors.c_color || organizationTheme.surface_color,
      
      // Text colors
      text_primary_color: pageColors.text_primary_color || pageColors.p_color || organizationTheme.text_primary_color,
      text_secondary_color: pageColors.text_secondary_color || pageColors.s_color || organizationTheme.text_secondary_color,
      text_muted_color: pageColors.text_muted_color || organizationTheme.text_muted_color,
      
      // Button colors
      button_background_color: pageColors.button_background_color || pageColors.b_color || pageColors.b1_color || organizationTheme.button_background_color,
      button_text_color: pageColors.button_text_color || pageColors.bt_color || organizationTheme.button_text_color,
      button_hover_color: pageColors.button_hover_color || organizationTheme.button_hover_color,
      
      // UI colors
      border_color: pageColors.border_color || organizationTheme.border_color,
      divider_color: pageColors.divider_color || organizationTheme.divider_color,
      
      // Status colors
      success_color: pageColors.success_color || organizationTheme.success_color,
      error_color: pageColors.error_color || organizationTheme.error_color,
      warning_color: pageColors.warning_color || organizationTheme.warning_color
    };
  }

  /**
   * Delete organization theme (revert to defaults)
   * @param {number} organizationId - Organization ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteOrganizationTheme(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    try {
      const query = 'DELETE FROM organization_themes WHERE organization_id = ?';
      const result = await this.executeQuery(query, [organizationId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new DatabaseError('Failed to delete organization theme', error);
    }
  }

  /**
   * Get default theme colors
   * @returns {Object} Default theme object
   */
  getDefaultTheme() {
    return {
      primary_color: '#1F2937',
      secondary_color: '#6B7280',
      accent_color: '#3B82F6',
      background_color: '#FFFFFF',
      surface_color: '#F9FAFB',
      text_primary_color: '#111827',
      text_secondary_color: '#6B7280',
      text_muted_color: '#9CA3AF',
      button_background_color: '#3B82F6',
      button_text_color: '#FFFFFF',
      button_hover_color: '#2563EB',
      border_color: '#E5E7EB',
      divider_color: '#F3F4F6',
      success_color: '#10B981',
      error_color: '#EF4444',
      warning_color: '#F59E0B'
    };
  }

  /**
   * Validate theme data
   * @param {Object} themeData - Theme data to validate
   * @throws {ValidationError} If validation fails
   */
  validateThemeData(themeData) {
    const colorFields = [
      'primary_color', 'secondary_color', 'accent_color',
      'background_color', 'surface_color', 'text_primary_color',
      'text_secondary_color', 'text_muted_color', 'button_background_color',
      'button_text_color', 'button_hover_color', 'border_color',
      'divider_color', 'success_color', 'error_color', 'warning_color'
    ];

    for (const field of colorFields) {
      if (themeData[field] && !this.isValidHexColor(themeData[field])) {
        throw new ValidationError(`Invalid hex color format for ${field}: ${themeData[field]}`);
      }
    }
  }

  /**
   * Validate hex color format
   * @param {string} color - Color string to validate
   * @returns {boolean} True if valid hex color
   */
  isValidHexColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }
}
