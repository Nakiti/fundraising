/**
 * Page Validation Utilities
 * Validates form inputs based on active sections for page editors
 */

// Define required fields for each section type
const SECTION_FIELDS = {
  // Landing Page Sections
  landing: {
    banner: ['title', 'description', 'bgImage'],
    main: ['mainHeadline', 'mainText'],
    about: ['aboutText', 'aboutImage'],
    impact: ['impactText', 'textImage'],
    triple: ['headlineOne', 'descriptionOne', 'imageOne', 'headlineTwo', 'descriptionTwo', 'imageTwo', 'headlineThree', 'descriptionThree', 'imageThree']
  },
  
  // About Page Sections
  about: {
    banner: ['headline', 'bgImage'],
    story: ['aboutText', 'aboutImage'],
    what: ['whatText'],
    why: ['whyText'],
    team: ['teamText', 'teamImage']
  },
  
  // Header Page Sections
  header: {
    logo: ['organizationName', 'logo']
  },
  
  // Footer Page Sections
  footer: {
    contact: ['organizationName', 'address', 'phone', 'email'],
    social: ['socialLinks']
  },
  
  // Campaign Page Sections
  donation: {
    banner: ['headline', 'description', 'banner_image'],
    main: ['mainHeadline', 'mainText'],
    donate: ['donate_button_text']
  },
  
  thankYou: {
    message: ['message'],
    background: ['background_image']
  },
  
  ticket: {
    banner: ['headline', 'description', 'banner_image'],
    about: ['about_text', 'about_image'],
    event: ['event_details']
  },
  
  peerLanding: {
    banner: ['headline', 'description', 'banner_image'],
    description: ['about_text']
  },
  
  peerFundraising: {
    banner: ['headline', 'description', 'banner_image'],
    title: ['title_text'],
    desc: ['description_text']
  },
  
  donationForm: {
    header: ['header_text'],
    title: ['title_text'],
    desc: ['description_text']
  },
  
  ticketPurchase: {
    title: ['title_text']
  }
};

/**
 * Validates all active sections for a given page type
 * @param {string} pageType - The type of page (landing, about, donation, etc.)
 * @param {Array} sections - Array of section objects with active property
 * @param {Object} inputs - Form inputs object
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validateActiveSections = (pageType, sections, inputs) => {
  const errors = [];
  const pageFields = SECTION_FIELDS[pageType];
  
  if (!pageFields) {
    return {
      isValid: false,
      errors: [`Unknown page type: ${pageType}`]
    };
  }

  // Check each active section
  sections.forEach(section => {
    if (section.active && pageFields[section.name]) {
      const requiredFields = pageFields[section.name];
      
      requiredFields.forEach(fieldName => {
        const value = inputs[fieldName];
        
        // Check if field is empty or only whitespace
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          const sectionDisplayName = section.displayText || section.name;
          errors.push(`${sectionDisplayName}: ${fieldName} is required`);
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates specific fields for a section
 * @param {string} pageType - The type of page
 * @param {string} sectionName - The name of the section
 * @param {Object} inputs - Form inputs object
 * @returns {Object} - Validation result
 */
export const validateSection = (pageType, sectionName, inputs) => {
  const pageFields = SECTION_FIELDS[pageType];
  
  if (!pageFields || !pageFields[sectionName]) {
    return {
      isValid: false,
      errors: [`Unknown section: ${sectionName} for page type: ${pageType}`]
    };
  }

  const requiredFields = pageFields[sectionName];
  const errors = [];

  requiredFields.forEach(fieldName => {
    const value = inputs[fieldName];
    
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${fieldName} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Gets all required fields for a page type
 * @param {string} pageType - The type of page
 * @returns {Object} - Object with section names as keys and arrays of required fields as values
 */
export const getRequiredFields = (pageType) => {
  return SECTION_FIELDS[pageType] || {};
};

/**
 * Checks if a specific field is required for a section
 * @param {string} pageType - The type of page
 * @param {string} sectionName - The name of the section
 * @param {string} fieldName - The name of the field
 * @returns {boolean} - Whether the field is required
 */
export const isFieldRequired = (pageType, sectionName, fieldName) => {
  const pageFields = SECTION_FIELDS[pageType];
  
  if (!pageFields || !pageFields[sectionName]) {
    return false;
  }

  return pageFields[sectionName].includes(fieldName);
};
