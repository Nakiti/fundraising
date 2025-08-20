// API Client and Utilities
import { api, validators, errorHandler, APIError, ValidationError } from './apiClient.js';

export { api, validators, errorHandler, APIError, ValidationError };

// React Hooks
import { useApi, useFormSubmit, useDataFetch } from '../hooks/useApi.js';
import { useFormValidation, validationRules, createValidationRules } from '../hooks/useFormValidation.js';
import { useToast } from '../components/Toast.js';

export { useApi, useFormSubmit, useDataFetch };
export { useFormValidation, validationRules, createValidationRules };
export { useToast };

// Authentication Services
import { 
   AuthService,
   loginUser, 
   logoutUser, 
   registerUser, 
   updatePassword, 
   getCurrentUser, 
   checkAuthStatus, 
   refreshToken 
} from './authService.js';

export { 
   AuthService,
   loginUser, 
   logoutUser, 
   registerUser, 
   updatePassword, 
   getCurrentUser, 
   checkAuthStatus, 
   refreshToken 
};

// Fetch Services
import {
   CampaignService,
   PageService,
   OrganizationService,
   DesignationService,
   UserService,
   TransactionService,
   ContentService,
   // Legacy exports
   getCampaign,
   getCampaignDetails,
   getAllCampaigns,
   getCampaignSearch,
   getCampaignsFiltered,
   getCampaignsDateRange,
   getDonationPage,
   getTicketPurchasePage,
   getThankYouPage,
   getTicketPage,
   getPeerLandingPage,
   getPeerFundraisingPage,
   getDonationForm,
   getPageSections,
   getLandingPage,
   getAboutPage,
   getOrganization,
   getCampaignDesignations,
   getSingleDesignation,
   getActiveDesignations,
   getAllDesignations,
   getAllUsers,
   getUserData,
   getUserOrganizations,
   getPendingUserOrganizations,
   getTransactionsByOrg,
   getTransactionsByCampaign,
   getTransactionsOverTime,
   getTransactionsDateRange,
   getTransactionsFiltered,
   getTransactionSearch,
   getCustomQuestions,
   getCampaignTickets,
   getFaqs
} from './fetchService.js';

export {
   CampaignService,
   PageService,
   OrganizationService,
   DesignationService,
   UserService,
   TransactionService,
   ContentService,
   // Legacy exports
   getCampaign,
   getCampaignDetails,
   getAllCampaigns,
   getCampaignSearch,
   getCampaignsFiltered,
   getCampaignsDateRange,
   getDonationPage,
   getTicketPurchasePage,
   getThankYouPage,
   getTicketPage,
   getPeerLandingPage,
   getPeerFundraisingPage,
   getDonationForm,
   getPageSections,
   getLandingPage,
   getAboutPage,
   getOrganization,
   getCampaignDesignations,
   getSingleDesignation,
   getActiveDesignations,
   getAllDesignations,
   getAllUsers,
   getUserData,
   getUserOrganizations,
   getPendingUserOrganizations,
   getTransactionsByOrg,
   getTransactionsByCampaign,
   getTransactionsOverTime,
   getTransactionsDateRange,
   getTransactionsFiltered,
   getTransactionSearch,
   getCustomQuestions,
   getCampaignTickets,
   getFaqs
};

// Create Services
import {
   OrganizationCreateService,
   CampaignCreateService,
   PageCreateService,
   UserCreateService,
   DesignationCreateService,
   // Legacy exports
   createOrganization,
   createLandingPage,
   createCampaign,
   createCampaignDetails,
   createCampaignDesignation,
   createCampaignTicket,
   createCustomQuestion,
   createFaq,
   createDonationPage,
   createThankYouPage,
   createTicketPurchasePage,
   createPeerLandingPage,
   createDonationForm,
   createPeerFundraisingPage,
   createTicketPage,
   createPageSection,
   initializeLandingPageSections,
   initializeAboutPageSections,
   createUser,
   createUserOrganizationRelation,
   createDesignation
} from './createServices.js';

export {
   OrganizationCreateService,
   CampaignCreateService,
   PageCreateService,
   UserCreateService,
   DesignationCreateService,
   // Legacy exports
   createOrganization,
   createLandingPage,
   createCampaign,
   createCampaignDetails,
   createCampaignDesignation,
   createCampaignTicket,
   createCustomQuestion,
   createFaq,
   createDonationPage,
   createThankYouPage,
   createTicketPurchasePage,
   createPeerLandingPage,
   createDonationForm,
   createPeerFundraisingPage,
   createTicketPage,
   createPageSection,
   initializeLandingPageSections,
   initializeAboutPageSections,
   createUser,
   createUserOrganizationRelation,
   createDesignation
};

// Update Services
import {
   OrganizationUpdateService,
   CampaignUpdateService,
   PageUpdateService,
   UserUpdateService,
   DesignationUpdateService,
   // Legacy exports
   updateOrganization,
   updateCampaignDetails,
   deactivateCampaign,
   updateDonationPage,
   updateLandingPage,
   updatePeerLandingPage,
   updateDonationForm,
   updateTicketPurchasePage,
   updatePeerFundraisingPage,
   updateThankYouPage,
   updateTicketPage,
   updatePageSection,
   updateUser,
   updateUserOrganizationRelation,
   updateDesignation
} from './updateServices.js';

export {
   OrganizationUpdateService,
   CampaignUpdateService,
   PageUpdateService,
   UserUpdateService,
   DesignationUpdateService,
   // Legacy exports
   updateOrganization,
   updateCampaignDetails,
   deactivateCampaign,
   updateDonationPage,
   updateLandingPage,
   updatePeerLandingPage,
   updateDonationForm,
   updateTicketPurchasePage,
   updatePeerFundraisingPage,
   updateThankYouPage,
   updateTicketPage,
   updatePageSection,
   updateUser,
   updateUserOrganizationRelation,
   updateDesignation
};

// Delete Services
import {
   FaqDeleteService,
   CampaignDeleteService,
   // Legacy exports
   deleteFaq,
   deleteFaqsBatch,
   deleteCampaignDesignationBatch,
   deleteCampaignDesignation,
   deleteCampaignQuestionsBatch,
   deleteCustomQuestion,
   deleteCampaignTicketsBatch
} from './deleteService.js';

export {
   FaqDeleteService,
   CampaignDeleteService,
   // Legacy exports
   deleteFaq,
   deleteFaqsBatch,
   deleteCampaignDesignationBatch,
   deleteCampaignDesignation,
   deleteCampaignQuestionsBatch,
   deleteCustomQuestion,
   deleteCampaignTicketsBatch
};

// Service Classes for easy access
export const Services = {
   // Authentication
   Auth: {
      loginUser: AuthService.loginUser,
      logoutUser: AuthService.logoutUser,
      registerUser: AuthService.registerUser,
      updatePassword: AuthService.updatePassword,
      getCurrentUser: AuthService.getCurrentUser,
      checkAuthStatus: AuthService.checkAuthStatus,
      refreshToken: AuthService.refreshToken
   },
   
   // Fetch Operations
   Campaign: {
      getCampaign: CampaignService.getCampaign,
      getCampaignDetails: CampaignService.getCampaignDetails,
      getAllCampaigns: CampaignService.getAllCampaigns,
      searchCampaigns: CampaignService.searchCampaigns,
      getFilteredCampaigns: CampaignService.getFilteredCampaigns,
      getCampaignsByDateRange: CampaignService.getCampaignsByDateRange
   },
   Page: {
      getDonationPage: PageService.getDonationPage,
      getTicketPurchasePage: PageService.getTicketPurchasePage,
      getThankYouPage: PageService.getThankYouPage,
      getTicketPage: PageService.getTicketPage,
      getPeerLandingPage: PageService.getPeerLandingPage,
      getPeerFundraisingPage: PageService.getPeerFundraisingPage,
      getDonationForm: PageService.getDonationForm,
      getPageSections: PageService.getPageSections,
      getPageSectionsByPage: PageService.getPageSectionsByPage,
      getLandingPage: PageService.getLandingPage,
      getAboutPage: PageService.getAboutPage
   },
   Organization: {
      getOrganization: OrganizationService.getOrganization
   },
   Designation: {
      getCampaignDesignations: DesignationService.getCampaignDesignations,
      getSingleDesignation: DesignationService.getSingleDesignation,
      getActiveDesignations: DesignationService.getActiveDesignations,
      getAllDesignations: DesignationService.getAllDesignations
   },
   User: {
      getAllUsers: UserService.getAllUsers,
      getUserData: UserService.getUserData,
      getUserOrganizations: UserService.getUserOrganizations,
      getPendingUserOrganizations: UserService.getPendingUserOrganizations
   },
   Transaction: {
      getTransactionsByOrg: TransactionService.getTransactionsByOrg,
      getTransactionsByCampaign: TransactionService.getTransactionsByCampaign,
      getTransactionsOverTime: TransactionService.getTransactionsOverTime,
      getTransactionsByDateRange: TransactionService.getTransactionsByDateRange,
      getFilteredTransactions: TransactionService.getFilteredTransactions,
      searchTransactions: TransactionService.searchTransactions
   },
   Content: {
      getCustomQuestions: ContentService.getCustomQuestions,
      getCampaignTickets: ContentService.getCampaignTickets,
      getFaqs: ContentService.getFaqs
   },
   
   // Create Operations
   Create: {
      Organization: {
         createOrganization: OrganizationCreateService.createOrganization,
         createLandingPage: OrganizationCreateService.createLandingPage,
         createAboutPage: OrganizationCreateService.createAboutPage,
         createPageSection: OrganizationCreateService.createPageSection,
         initializeLandingPageSections: OrganizationCreateService.initializeLandingPageSections,
         initializeAboutPageSections: OrganizationCreateService.initializeAboutPageSections
      },
      Campaign: {
         createCampaign: CampaignCreateService.createCampaign,
         createCampaignDetails: CampaignCreateService.createCampaignDetails,
         createCampaignDesignation: CampaignCreateService.createCampaignDesignation,
         createCampaignTicket: CampaignCreateService.createCampaignTicket,
         createCustomQuestion: CampaignCreateService.createCustomQuestion,
         createFaq: CampaignCreateService.createFaq
      },
      Page: {
         createDonationPage: PageCreateService.createDonationPage,
         createThankYouPage: PageCreateService.createThankYouPage,
         createTicketPurchasePage: PageCreateService.createTicketPurchasePage,
         createPeerLandingPage: PageCreateService.createPeerLandingPage,
         createDonationForm: PageCreateService.createDonationForm,
         createPeerFundraisingPage: PageCreateService.createPeerFundraisingPage,
         createTicketPage: PageCreateService.createTicketPage,
         createPageSection: PageCreateService.createPageSection,
         createPageSectionByPage: PageCreateService.createPageSectionByPage
      },
      User: {
         createUser: UserCreateService.createUser,
         createUserOrganizationRelation: UserCreateService.createUserOrganizationRelation
      },
      Designation: {
         createDesignation: DesignationCreateService.createDesignation
      }
   },
   
   // Update Operations
   Update: {
      Organization: {
         updateOrganization: OrganizationUpdateService.updateOrganization
      },
      Campaign: {
         updateCampaignDetails: CampaignUpdateService.updateCampaignDetails,
         deactivateCampaign: CampaignUpdateService.deactivateCampaign
      },
      Page: {
         updateDonationPage: PageUpdateService.updateDonationPage,
         updateLandingPage: PageUpdateService.updateLandingPage,
         updatePeerLandingPage: PageUpdateService.updatePeerLandingPage,
         updateDonationForm: PageUpdateService.updateDonationForm,
         updateTicketPurchasePage: PageUpdateService.updateTicketPurchasePage,
         updatePeerFundraisingPage: PageUpdateService.updatePeerFundraisingPage,
         updateThankYouPage: PageUpdateService.updateThankYouPage,
         updateTicketPage: PageUpdateService.updateTicketPage,
         updatePageSection: PageUpdateService.updatePageSection
      },
      User: {
         updateUser: UserUpdateService.updateUser,
         updateUserOrganizationRelation: UserUpdateService.updateUserOrganizationRelation
      },
      Designation: {
         updateDesignation: DesignationUpdateService.updateDesignation
      }
   },
   
   // Delete Operations
   Delete: {
      Faq: {
         deleteFaq: FaqDeleteService.deleteFaq,
         deleteFaqsBatch: FaqDeleteService.deleteFaqsBatch
      },
      Campaign: {
         deleteCampaignDesignationBatch: CampaignDeleteService.deleteCampaignDesignationBatch,
         deleteCampaignDesignation: CampaignDeleteService.deleteCampaignDesignation,
         deleteCampaignQuestionsBatch: CampaignDeleteService.deleteCampaignQuestionsBatch,
         deleteCustomQuestion: CampaignDeleteService.deleteCustomQuestion,
         deleteCampaignTicketsBatch: CampaignDeleteService.deleteCampaignTicketsBatch
      }
   }
};

// Utility functions for common operations
export const ServiceUtils = {
   // Validate and handle API responses
   handleResponse: (response) => {
      if (!response) return null;
      return response.success ? response.data : null;
   },
   
   // Create error message
   createErrorMessage: (operation, error) => {
      return `${operation} failed: ${error.message || 'Unknown error occurred'}`;
   },
   
   // Validate required fields
   validateRequired: (data, fields) => {
      const missing = [];
      fields.forEach(field => {
         if (!data[field]) {
            missing.push(field);
         }
      });
      
      if (missing.length > 0) {
         throw new Error(`Missing required fields: ${missing.join(', ')}`);
      }
      
      return true;
   },
   
   // Format form data for file uploads
   formatFormData: (data) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
         if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
         }
      });
      return formData;
   }
};

export default Services;
