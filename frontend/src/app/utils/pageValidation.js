/**
 * Page Validation Utilities
 * Validates form inputs based on active sections for page editors
 */

// Define required fields for each section type
const SECTION_FIELDS = {
  // Landing Page Sections
  landing: {
    banner: ['title', 'description', 'bg_image'],
    main: ['mainHeadline', 'mainText'],
    about: ['aboutText', 'about_image'],
    impact: ['impactText', 'text_image'],
    triple: ['headlineOne', 'descriptionOne', 'image_one', 'headlineTwo', 'descriptionTwo', 'image_two', 'headlineThree', 'descriptionThree', 'image_three']
  },
  
  // About Page Sections
  about: {
    banner: ['headline', 'bg_image'],
    story: ['aboutText', 'about_image'],
    what: ['whatText'],
    why: ['whyText'],
    team: ['teamText', 'team_image']
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
    // donate: ['donate_button_text']
  },
  
  thankYou: {
    message: ['description'],
    // background: ['background_image']
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
    header: ['headline', 'description'],
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
  
  console.log(`DEBUG - validateActiveSections called with:`)
  console.log(`pageType:`, pageType)
  console.log(`sections:`, sections)
  console.log(`inputs:`, inputs)
  console.log(`pageFields:`, pageFields)
  
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
      console.log(`Checking section "${section.name}" with required fields:`, requiredFields)
      
      requiredFields.forEach(fieldName => {
        const value = inputs[fieldName];
        console.log(`Field "${fieldName}" has value:`, value, `(type: ${typeof value})`)
        
        // Check if field is empty or only whitespace
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          const sectionDisplayName = section.displayText || section.name;
          console.log(`Field "${fieldName}" is empty, adding error`)
          errors.push(`${sectionDisplayName}: ${fieldName} is required`);
        }
      });
    }
  });

  console.log(`Final validation errors:`, errors)
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

/**
 * Validates donation form inputs
 * @param {Object} params
 * @param {number} params.amount - Donation amount
 * @param {boolean} params.isAnonymous - Whether the donation is anonymous
 * @param {Object} params.formData - Donor information fields
 * @param {Array} params.designations - Campaign designations
 * @param {number|null} params.selectedFund - Selected fund index or null
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateDonationForm = ({ amount, isAnonymous, formData, designations, selectedFund }) => {
  if (!amount || amount <= 0) {
    return { isValid: false, error: 'Please select a donation amount' };
  }

  // Require donor information when not anonymous
  if (!isAnonymous) {
    if (!formData?.firstName || !formData.firstName.trim()) {
      return { isValid: false, error: 'Please enter your first name' };
    }
    if (!formData?.lastName || !formData.lastName.trim()) {
      return { isValid: false, error: 'Please enter your last name' };
    }
    if (!formData?.email || !formData.email.trim()) {
      return { isValid: false, error: 'Please enter your email address' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
  } else {
    // For anonymous donations, require email for receipt
    if (!formData?.email || !formData.email.trim()) {
      return { isValid: false, error: 'Please enter your email address for donation receipt' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
  }

  // If campaign has designations, require fund selection
  if (Array.isArray(designations) && designations.length > 0 && selectedFund === null) {
    return { isValid: false, error: 'Please select a fund' };
  }

  return { isValid: true };
};
