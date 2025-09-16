/**
 * Theme Utilities - Helper functions for theme color management and manipulation
 */

/**
 * Validate hex color format
 * @param {string} color - Color string to validate
 * @returns {boolean} True if valid hex color
 */
export const isValidHexColor = (color) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color string
 * @returns {Object} RGB object with r, g, b properties
 */
export const hexToRgb = (hex) => {
  if (!isValidHexColor(hex)) return null;
  
  const color = hex.replace('#', '');
  const num = parseInt(color, 16);
  
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

/**
 * Convert RGB values to hex color
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color string
 */
export const rgbToHex = (r, g, b) => {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (val) => clamp(val).toString(16).padStart(2, '0');
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Adjust color brightness
 * @param {string} hexColor - Base hex color
 * @param {number} amount - Amount to adjust (positive for lighter, negative for darker)
 * @returns {string} Adjusted hex color
 */
export const adjustColorBrightness = (hexColor, amount) => {
  if (!isValidHexColor(hexColor)) return hexColor;
  
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;
  
  return rgbToHex(rgb.r + amount, rgb.g + amount, rgb.b + amount);
};

/**
 * Get contrasting text color (black or white) for a background color
 * @param {string} backgroundColor - Background hex color
 * @returns {string} Contrasting text color
 */
export const getContrastingTextColor = (backgroundColor) => {
  if (!isValidHexColor(backgroundColor)) return '#000000';
  
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';
  
  // Calculate luminance using relative luminance formula
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Generate color variations (lighter/darker shades)
 * @param {string} hexColor - Base hex color
 * @param {Object} options - Options for color generation
 * @returns {Object} Object with lighter and darker variations
 */
export const generateColorVariations = (hexColor, options = {}) => {
  const { lightAmount = 30, darkAmount = -30 } = options;
  
  return {
    base: hexColor,
    lighter: adjustColorBrightness(hexColor, lightAmount),
    darker: adjustColorBrightness(hexColor, darkAmount),
    lightest: adjustColorBrightness(hexColor, lightAmount * 1.5),
    darkest: adjustColorBrightness(hexColor, darkAmount * 1.5)
  };
};

/**
 * Convert theme colors to CSS custom properties
 * @param {Object} theme - Theme colors object
 * @returns {Object} CSS custom properties object
 */
export const themeToCssProperties = (theme) => {
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
};

/**
 * Apply theme colors to document root
 * @param {Object} theme - Theme colors object
 */
export const applyThemeToDocument = (theme) => {
  if (typeof document === 'undefined') return;
  
  const cssProperties = themeToCssProperties(theme);
  const root = document.documentElement;
  
  for (const [property, value] of Object.entries(cssProperties)) {
    root.style.setProperty(property, value);
  }
};

/**
 * Get theme color with fallback
 * @param {Object} theme - Theme object
 * @param {string} colorKey - Color key to get
 * @param {string} fallback - Fallback color value
 * @returns {string} Color value
 */
export const getThemeColor = (theme, colorKey, fallback = '#000000') => {
  return theme?.[colorKey] || fallback;
};

/**
 * Merge organization theme with page-specific overrides
 * @param {Object} organizationTheme - Organization theme colors
 * @param {Object} pageColors - Page-specific color overrides
 * @returns {Object} Merged theme object
 */
export const mergeThemeColors = (organizationTheme, pageColors = {}) => {
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
};

/**
 * Get default theme colors
 * @returns {Object} Default theme object
 */
export const getDefaultTheme = () => {
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
};

/**
 * Create inline styles object from theme colors
 * @param {Object} theme - Theme colors object
 * @param {Object} styleMappings - Mapping of style properties to theme keys
 * @returns {Object} Inline styles object
 */
export const createThemeStyles = (theme, styleMappings) => {
  const styles = {};
  
  for (const [styleProperty, themeKey] of Object.entries(styleMappings)) {
    const color = getThemeColor(theme, themeKey);
    if (color) {
      styles[styleProperty] = color;
    }
  }
  
  return styles;
};

/**
 * Common style mappings for theme colors
 */
export const COMMON_STYLE_MAPPINGS = {
  // Background styles
  backgroundColor: 'background_color',
  background: 'background_color',
  
  // Text styles
  color: 'text_primary_color',
  textColor: 'text_primary_color',
  
  // Border styles
  borderColor: 'border_color',
  border: 'border_color',
  
  // Button styles
  buttonBackground: 'button_background_color',
  buttonColor: 'button_text_color',
  buttonHover: 'button_hover_color'
};

/**
 * Generate a complete style object for common UI elements
 * @param {Object} theme - Theme colors object
 * @param {string} elementType - Type of element ('button', 'card', 'text', etc.)
 * @returns {Object} Complete style object
 */
export const getElementStyles = (theme, elementType) => {
  const baseStyles = {};
  
  switch (elementType) {
    case 'button':
      return {
        backgroundColor: getThemeColor(theme, 'button_background_color'),
        color: getThemeColor(theme, 'button_text_color'),
        borderColor: getThemeColor(theme, 'button_background_color'),
        ':hover': {
          backgroundColor: getThemeColor(theme, 'button_hover_color')
        }
      };
      
    case 'card':
      return {
        backgroundColor: getThemeColor(theme, 'surface_color'),
        borderColor: getThemeColor(theme, 'border_color'),
        color: getThemeColor(theme, 'text_primary_color')
      };
      
    case 'text':
      return {
        color: getThemeColor(theme, 'text_primary_color')
      };
      
    case 'textSecondary':
      return {
        color: getThemeColor(theme, 'text_secondary_color')
      };
      
    case 'textMuted':
      return {
        color: getThemeColor(theme, 'text_muted_color')
      };
      
    default:
      return baseStyles;
  }
};

/**
 * Validate theme data structure
 * @param {Object} themeData - Theme data to validate
 * @throws {Error} If validation fails
 */
export const validateThemeData = (themeData) => {
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
    if (themeData[field] && !isValidHexColor(themeData[field])) {
      throw new Error(`Invalid hex color format for ${field}: ${themeData[field]}`);
    }
  }
};
