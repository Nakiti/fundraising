// ===== NEW SERVICE ARCHITECTURE =====

// Base Services
export { BaseService } from './base/BaseService.js';
export { ValidationService } from './base/ValidationService.js';
export { serviceRegistry, initializeServices } from './base/ServiceRegistry.js';

// Domain Service Getters
export {
  getAuthService,
  getDashboardService,
  getDonorService,
  getCampaignService,
  getPageService,
  getOrganizationService,
  getUserService,
  getTransactionService,
  getDesignationService,
  getContentService,
  getStripeService,
  getCustomQuestionResponseService
} from './base/ServiceRegistry.js';

// Domain Service Classes (for direct import if needed)
export { AuthService } from './domain/AuthService.js';
export { DashboardService } from './domain/DashboardService.js';
export { DonorService } from './domain/DonorService.js';
export { CampaignService } from './domain/CampaignService.js';
export { PageService } from './domain/PageService.js';
export { OrganizationService } from './domain/OrganizationService.js';
export { UserService } from './domain/UserService.js';
export { TransactionService } from './domain/TransactionService.js';
export { DesignationService } from './domain/DesignationService.js';
export { ContentService } from './domain/ContentService.js';
export { StripeService } from './domain/StripeService.js';
export { CustomQuestionResponseService } from './domain/CustomQuestionResponseService.js';

// ===== LEGACY COMPATIBILITY =====

// API Client and Utilities (keep existing)
import { api, validators, errorHandler, APIError, ValidationError } from './apiClient.js';
export { api, validators, errorHandler, APIError, ValidationError };

// React Hooks (keep existing)
import { useApi, useFormSubmit, useDataFetch } from '../hooks/useApi.js';
import { useFormValidation, validationRules, createValidationRules } from '../hooks/useFormValidation.js';
import { useToast } from '../components/Toast.js';
export { useApi, useFormSubmit, useDataFetch };
export { useFormValidation, validationRules, createValidationRules };
export { useToast };

// Cart Service (keep existing)
import { CartService } from './cartService.js';
export { CartService };

// Guest Donor Service (keep existing)
import { GuestDonorService } from './guestDonorService.js';
export { GuestDonorService };

// Stripe Service (keep existing)
import { StripeService as LegacyStripeService } from './stripeService.js';
export { LegacyStripeService };

// ===== LEGACY FETCH SERVICES (DEPRECATED - Use new services instead) =====

// Import legacy services for backward compatibility
// import {
//    // Legacy class-based services
//    CampaignService as LegacyCampaignService,
//    PageService as LegacyPageService,
//    OrganizationService as LegacyOrganizationService,
//    DesignationService as LegacyDesignationService,
//    UserService as LegacyUserService,
//    TransactionService as LegacyTransactionService,
//    ContentService as LegacyContentService,
   
//    // Legacy function exports
//    getCampaign,
//    getCampaignDetails,
//    getAllCampaigns,
//    getCampaignSearch,
//    getCampaignsFiltered,
//    getCampaignsDateRange,
//    getDonationPage,
//    getTicketPurchasePage,
//    getThankYouPage,
//    getTicketPage,
//    getPeerLandingPage,
//    getPeerFundraisingPage,
//    getDonationForm,
//    getPageSections,
//    getLandingPage,
//    getAboutPage,
//    getOrganization,
//    getCampaignDesignations,
//    getSingleDesignation,
//    getActiveDesignations,
//    getAllDesignations,
//    getAllUsers,
//    getUserData,
//    getUserOrganizations,
//    getPendingUserOrganizations,
//    getTransactionsByOrg,
//    getTransactionsByCampaign,
//    getTransactionsOverTime,
//    getTransactionsDateRange,
//    getTransactionsFiltered,
//    getTransactionSearch,
//    getCustomQuestions,
//    getCampaignTickets,
//    getFaqs
// } from './fetchService.js';

// // Export legacy services with deprecation warnings
// export {
//    // Legacy class-based services (DEPRECATED)
//    LegacyCampaignService,
//    LegacyPageService,
//    LegacyOrganizationService,
//    LegacyDesignationService,
//    LegacyUserService,
//    LegacyTransactionService,
//    LegacyContentService,
   
//    // Legacy function exports (DEPRECATED)
//    getCampaign,
//    getCampaignDetails,
//    getAllCampaigns,
//    getCampaignSearch,
//    getCampaignsFiltered,
//    getCampaignsDateRange,
//    getDonationPage,
//    getTicketPurchasePage,
//    getThankYouPage,
//    getTicketPage,
//    getPeerLandingPage,
//    getPeerFundraisingPage,
//    getDonationForm,
//    getPageSections,
//    getLandingPage,
//    getAboutPage,
//    getOrganization,
//    getCampaignDesignations,
//    getSingleDesignation,
//    getActiveDesignations,
//    getAllDesignations,
//    getAllUsers,
//    getUserData,
//    getUserOrganizations,
//    getPendingUserOrganizations,
//    getTransactionsByOrg,
//    getTransactionsByCampaign,
//    getTransactionsOverTime,
//    getTransactionsDateRange,
//    getTransactionsFiltered,
//    getTransactionSearch,
//    getCustomQuestions,
//    getCampaignTickets,
//    getFaqs
// };

// ===== MIGRATION GUIDE =====

/**
 * MIGRATION GUIDE - How to use the new service architecture:
 * 
 * OLD WAY (deprecated):
 * import { getCampaign } from './services';
 * const campaign = await getCampaign(campaignId);
 * 
 * NEW WAY (recommended):
 * import { getCampaignService } from './services';
 * const campaignService = getCampaignService();
 * const campaign = await campaignService.getCampaign(campaignId);
 * 
 * BENEFITS:
 * - Better error handling and logging
 * - Consistent validation
 * - Easier testing
 * - Better TypeScript support
 * - Centralized service management
 * 
 * MIGRATION STEPS:
 * 1. Replace legacy function imports with service getters
 * 2. Update function calls to use service methods
 * 3. Remove legacy imports once migration is complete
 * 4. Update components to use new service pattern
 */

// ===== INITIALIZATION =====

// Services are now initialized by the ServiceInitializer component
// This ensures proper initialization order and error handling
