import { BaseService } from '../base/BaseService.js';

/**
 * Theme Service - Handles all theme-related operations
 * Extends BaseService for common API operations and error handling
 */
export class ThemeService extends BaseService {
  constructor() {
    super('ThemeService');
  }

  // ===== THEME CRUD OPERATIONS =====

  /**
   * Get organization theme colors
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Theme colors object
   */
  async getOrganizationTheme(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/organizations/${organizationId}/theme`);
  }

  /**
   * Create or update organization theme colors
   * @param {number} organizationId - Organization ID
   * @param {Object} themeData - Theme color data
   * @returns {Promise<Object>} Updated theme object
   */
  async saveOrganizationTheme(organizationId, themeData) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(themeData, 'Theme data');
    this.validateThemeData(themeData);

    return await this.put(`/organizations/${organizationId}/theme`, themeData);
  }

  /**
   * Get merged theme colors (organization theme + page overrides)
   * @param {number} organizationId - Organization ID
   * @param {Object} pageColors - Page-specific color overrides
   * @returns {Promise<Object>} Merged theme object
   */
  async getMergedTheme(organizationId, pageColors = {}) {
    this.validateId(organizationId, 'Organization ID');
    
    const params = {};
    if (Object.keys(pageColors).length > 0) {
      params.pageColors = JSON.stringify(pageColors);
    }

    return await this.get(`/organizations/${organizationId}/theme/merged`, params);
  }

  /**
   * Delete organization theme (revert to defaults)
   * @param {number} organizationId - Organization ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteOrganizationTheme(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.delete(`/organizations/${organizationId}/theme`);
  }

  /**
   * Get default theme colors
   * @returns {Promise<Object>} Default theme object
   */
  async getDefaultTheme() {
    return await this.get('/theme/defaults');
  }

  /**
   * Validate theme color data
   * @param {Object} themeData - Theme data to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateTheme(themeData) {
    this.validateRequired(themeData, 'Theme data');
    return await this.post('/theme/validate', { themeData });
  }

  // ===== THEME UTILITY METHODS =====

  /**
   * Get theme colors with fallback to defaults
   * @param {number} organizationId - Organization ID
   * @param {Object} pageColors - Page-specific color overrides
   * @returns {Promise<Object>} Theme colors with fallbacks
   */
  async getThemeWithFallbacks(organizationId, pageColors = {}) {
    try {
      const mergedTheme = await this.getMergedTheme(organizationId, pageColors);
      return mergedTheme.data;
    } catch (error) {
      console.warn('Failed to load organization theme, using defaults:', error.message);
      try {
        const defaultTheme = await this.getDefaultTheme();
        return defaultTheme.data;
      } catch (defaultError) {
        console.error('Failed to load default theme:', defaultError.message);
        return this.getHardcodedDefaults();
      }
    }
  }

  /**
   * Get hardcoded default theme colors (fallback)
   * @returns {Object} Default theme object
   */
  getHardcodedDefaults() {
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
   * Convert theme colors to CSS custom properties
   * @param {Object} theme - Theme colors object
   * @returns {Object} CSS custom properties object
   */
  themeToCssProperties(theme) {
    const cssProperties = {};
    
    // Map theme colors to CSS custom properties
    const colorMappings = {
      primary_color: '--color-primary',
      secondary_color: '--color-secondary',
      accent_color: '--color-accent',
      background_color: '--color-background',
      surface_color: '--color-surface',
      text_primary_color: '--color-text-primary',
      text_secondary_color: '--color-text-secondary',
      text_muted_color: '--color-text-muted',
      button_background_color: '--color-button-background',
      button_text_color: '--color-button-text',
      button_hover_color: '--color-button-hover',
      border_color: '--color-border',
      divider_color: '--color-divider',
      success_color: '--color-success',
      error_color: '--color-error',
      warning_color: '--color-warning'
    };

    for (const [themeKey, cssProperty] of Object.entries(colorMappings)) {
      if (theme[themeKey]) {
        cssProperties[cssProperty] = theme[themeKey];
      }
    }

    return cssProperties;
  }

  /**
   * Apply theme colors to document root
   * @param {Object} theme - Theme colors object
   */
  applyThemeToDocument(theme) {
    if (typeof document === 'undefined') return;
    
    const cssProperties = this.themeToCssProperties(theme);
    const root = document.documentElement;
    
    for (const [property, value] of Object.entries(cssProperties)) {
      root.style.setProperty(property, value);
    }
  }

  /**
   * Get theme color with fallback
   * @param {Object} theme - Theme object
   * @param {string} colorKey - Color key to get
   * @param {string} fallback - Fallback color value
   * @returns {string} Color value
   */
  getThemeColor(theme, colorKey, fallback = '#000000') {
    return theme?.[colorKey] || fallback;
  }

  /**
   * Validate theme data structure
   * @param {Object} themeData - Theme data to validate
   * @throws {Error} If validation fails
   */
  validateThemeData(themeData) {
    if (!themeData || typeof themeData !== 'object') {
      throw new Error('Theme data must be an object');
    }

    const validColorFields = [
      'primary_color', 'secondary_color', 'accent_color',
      'background_color', 'surface_color', 'text_primary_color',
      'text_secondary_color', 'text_muted_color', 'button_background_color',
      'button_text_color', 'button_hover_color', 'border_color',
      'divider_color', 'success_color', 'error_color', 'warning_color'
    ];

    for (const field of validColorFields) {
      if (themeData[field] && !this.isValidHexColor(themeData[field])) {
        throw new Error(`Invalid hex color format for ${field}: ${themeData[field]}`);
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

  /**
   * Generate color variations (lighter/darker shades)
   * @param {string} hexColor - Base hex color
   * @param {number} amount - Amount to adjust (positive for lighter, negative for darker)
   * @returns {string} Adjusted hex color
   */
  adjustColorBrightness(hexColor, amount) {
    if (!this.isValidHexColor(hexColor)) return hexColor;
    
    // Remove # if present
    const color = hexColor.replace('#', '');
    
    // Convert to RGB
    const num = parseInt(color, 16);
    const r = (num >> 16) + amount;
    const g = (num >> 8 & 0x00FF) + amount;
    const b = (num & 0x0000FF) + amount;
    
    // Clamp values to 0-255
    const clamp = (val) => Math.max(0, Math.min(255, val));
    
    // Convert back to hex
    const newColor = (clamp(r) << 16) | (clamp(g) << 8) | clamp(b);
    return '#' + newColor.toString(16).padStart(6, '0');
  }

  /**
   * Get contrasting text color (black or white) for a background color
   * @param {string} backgroundColor - Background hex color
   * @returns {string} Contrasting text color
   */
  getContrastingTextColor(backgroundColor) {
    if (!this.isValidHexColor(backgroundColor)) return '#000000';
    
    // Remove # if present
    const color = backgroundColor.replace('#', '');
    
    // Convert to RGB
    const num = parseInt(color, 16);
    const r = num >> 16;
    const g = (num >> 8) & 0x00FF;
    const b = num & 0x0000FF;
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light backgrounds, white for dark backgrounds
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}
