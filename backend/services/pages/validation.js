// Validation and defaulting utilities for page data

export function isValidColor(color) {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/;
  const namedColors = ['transparent', 'inherit', 'currentColor'];
  return hexPattern.test(color) || rgbPattern.test(color) || namedColors.includes(color);
}

export function isValidSize(size) {
  const sizePattern = /^\d+(\.\d+)?(px|em|rem|%|vh|vw)$/;
  return sizePattern.test(size);
}

export function applyDefaultDesignSettings(schema, pageData) {
  const result = { ...pageData };
  for (const [key, defaultValue] of Object.entries(schema.designDefaults || {})) {
    if (result[key] === undefined || result[key] === null) {
      result[key] = defaultValue;
    }
  }
  for (const [key, defaultValue] of Object.entries(schema.booleanDefaults || {})) {
    if (result[key] === undefined || result[key] === null) {
      result[key] = defaultValue;
    } else {
      result[key] = result[key] !== false && result[key] !== 'false';
    }
  }
  return result;
}

export function validatePageData(pageType, pageData, schema) {
  if (pageType === 'about' || pageType === 'landing') {
    const colorFields = ['bg_color', 'p_color', 's_color', 'c_color', 'ct_color', 'b_color', 'bt_color'];
    for (const field of colorFields) {
      if (pageData[field] && !isValidColor(pageData[field])) {
        throw new Error(`Invalid color value for ${field}: ${pageData[field]}`);
      }
    }

    const sizeFields = ['hero_title_size', 'hero_subtitle_size', 'section_title_size', 'body_text_size'];
    for (const field of sizeFields) {
      if (pageData[field] && !isValidSize(pageData[field])) {
        throw new Error(`Invalid size value for ${field}: ${pageData[field]}`);
      }
    }
  }
  // Add additional per-pageType validations here as needed using schema
}


