import { api, validators, errorHandler } from './apiClient.js';

// Campaign Services
export class CampaignService {
   // Get campaign by ID
   static async getCampaign(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/campaign/get/${campaignId}`);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching campaign:', error);
         throw error;
      }
   }

   // Get campaign details
   static async getCampaignDetails(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/campaign_details/get/${campaignId}`);
         console.log("omg a response ", response)
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching campaign details:', error);
         throw error;
      }
   }

   // Get all campaigns by organization
   static async getAllCampaigns(organizationId) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/campaign/getByOrg/${organizationId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching campaigns:', error);
         throw error;
      }
   }

   // Search campaigns
   static async searchCampaigns(query, organizationId) {
      try {
         validators.required(query, 'Search Query');
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/campaign/search/${organizationId}?q=${encodeURIComponent(query)}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error searching campaigns:', error);
         throw error;
      }
   }

   // Get filtered campaigns
   static async getFilteredCampaigns(organizationId, status, type) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/campaign/getFiltered/${organizationId}`, {
            params: { status, type }
         });
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching filtered campaigns:', error);
         throw error;
      }
   }

   // Get campaigns by date range
   static async getCampaignsByDateRange(start, end, organizationId) {
      try {
         validators.date(start, 'Start Date');
         validators.date(end, 'End Date');
         validators.id(organizationId, 'Organization ID');

         const startFormatted = new Date(start).toISOString().slice(0, 19).replace('T', ' ');
         const endFormatted = new Date(end).toISOString().slice(0, 19).replace('T', ' ');

         const response = await api.get(`/campaign/getDateRange/${organizationId}`, {
            params: { start: startFormatted, end: endFormatted }
         });
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching campaigns by date range:', error);
         throw error;
      }
   }
}

// Page Services
export class PageService {
   // Get donation page
   static async getDonationPage(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/donationPage/get/${campaignId}`);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching donation page:', error);
         throw error;
      }
   }

   // Get ticket purchase page
   static async getTicketPurchasePage(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/ticket_purchase_page/get/${campaignId}`);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching ticket purchase page:', error);
         throw error;
      }
   }

   // Get thank you page
   static async getThankYouPage(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/thankYouPage/get/${campaignId}`);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching thank you page:', error);
         throw error;
      }
   }

   // Get ticket page
   static async getTicketPage(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/ticket_page/get/${campaignId}`);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching ticket page:', error);
         throw error;
      }
   }

   // Get peer landing page
   static async getPeerLandingPage(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/peer_landing_page/get/${campaignId}`);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching peer landing page:', error);
         throw error;
      }
   }

   // Get peer fundraising page
   static async getPeerFundraisingPage(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/peer_fundraising_page/get/${campaignId}`);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching peer fundraising page:', error);
         throw error;
      }
   }

   // Get donation form
   static async getDonationForm(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/donation_form/get/${campaignId}`);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching donation form:', error);
         throw error;
      }
   }

   // Get page sections
   static async getPageSections(pageId) {
      try {
         validators.id(pageId, 'Page ID');
         const response = await api.get(`/sections/getSectionsByPage/${pageId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching page sections:', error);
         throw error;
      }
   }

   // Get landing page
   static async getLandingPage(organizationId) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/landing_page/get/${organizationId}`);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching landing page:', error);
         throw error;
      }
   }

   // Get about page
   static async getAboutPage(organizationId) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/about_page/get/${organizationId}`);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching about page:', error);
         throw error;
      }
   }
}

// Organization Services
export class OrganizationService {
   // Get organization
   static async getOrganization(organizationId) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/organization/get/${organizationId}`);
         return response.success ? response.data[0] : null;
      } catch (error) {
         console.error('Error fetching organization:', error);
         throw error;
      }
   }
}

// Designation Services
export class DesignationService {
   // Get campaign designations
   static async getCampaignDesignations(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/campaign_designation/get/${campaignId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching campaign designations:', error);
         throw error;
      }
   }

   // Get single designation
   static async getSingleDesignation(id) {
      try {
         validators.id(id, 'Designation ID');
         const response = await api.get(`/designation/getSingle/${id}`);
         return response.success ? response.data[0] : null;
      } catch (error) {
         console.error('Error fetching designation:', error);
         throw error;
      }
   }

   // Get active designations
   static async getActiveDesignations(organizationId) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/designation/getActive/${organizationId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching active designations:', error);
         throw error;
      }
   }

   // Get all designations
   static async getAllDesignations(organizationId) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/designation/get/${organizationId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching designations:', error);
         throw error;
      }
   }
}

// User Services
export class UserService {
   // Get all users by organization
   static async getAllUsers(organizationId) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/user/getByOrg/${organizationId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching users:', error);
         throw error;
      }
   }

   // Get user data
   static async getUserData(userId) {
      try {
         validators.id(userId, 'User ID');
         const response = await api.get(`/user/get/${userId}`);
         console.log("da response for da user data ", response)
         return response.success ? response.data.user : null;
      } catch (error) {
         console.error('Error fetching user data:', error);
         throw error;
      }
   }

   // Get user organizations
   static async getUserOrganizations(userId) {
      try {
         validators.id(userId, 'User ID');
         const response = await api.get(`/user_organization/get/${userId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching user organizations:', error);
         throw error;
      }
   }

   // Get pending user organizations
   static async getPendingUserOrganizations(userId) {
      try {
         validators.id(userId, 'User ID');
         const response = await api.get(`/user_organization/getPending/${userId}`);
         return response.success ? response.data.data : [];
      } catch (error) {
         console.error('Error fetching pending user organizations:', error);
         throw error;
      }
   }
}

// Transaction Services
export class TransactionService {
   // Get transactions by organization
   static async getTransactionsByOrg(organizationId) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/transaction/getByOrg/${organizationId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching transactions by org:', error);
         throw error;
      }
   }

   // Get transactions by campaign
   static async getTransactionsByCampaign(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/transaction/getByCampaign/${campaignId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching transactions by campaign:', error);
         throw error;
      }
   }

   // Get transactions over time
   static async getTransactionsOverTime(organizationId, start, end) {
      try {
         validators.id(organizationId, 'Organization ID');
         validators.date(start, 'Start Date');
         validators.date(end, 'End Date');
         
         const response = await api.get(`/transaction/getTimeframe/${organizationId}`, {
            params: { start, end }
         });
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching transactions over time:', error);
         throw error;
      }
   }

   // Get transactions by date range
   static async getTransactionsByDateRange(start, end, organizationId) {
      try {
         validators.date(start, 'Start Date');
         validators.date(end, 'End Date');
         validators.id(organizationId, 'Organization ID');

         const startFormatted = new Date(start).toISOString().slice(0, 19).replace('T', ' ');
         const endFormatted = new Date(end).toISOString().slice(0, 19).replace('T', ' ');

         const response = await api.get(`/campaign/getDateRange/${organizationId}`, {
            params: { start: startFormatted, end: endFormatted }
         });
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching transactions by date range:', error);
         throw error;
      }
   }

   // Get filtered transactions
   static async getFilteredTransactions(organizationId, status) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/transaction/getFiltered/${organizationId}`, {
            params: { status }
         });
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching filtered transactions:', error);
         throw error;
      }
   }

   // Search transactions
   static async searchTransactions(query, organizationId) {
      try {
         validators.required(query, 'Search Query');
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/transaction/search/${organizationId}?q=${encodeURIComponent(query)}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error searching transactions:', error);
         throw error;
      }
   }
}

// Content Services
export class ContentService {
   // Get custom questions
   static async getCustomQuestions(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/campaign_question/get/${campaignId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching custom questions:', error);
         throw error;
      }
   }

   // Get campaign tickets
   static async getCampaignTickets(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/campaign_ticket/get/${campaignId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching campaign tickets:', error);
         throw error;
      }
   }

   // Get FAQs
   static async getFaqs(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         const response = await api.get(`/faq/get/${campaignId}`);
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching FAQs:', error);
         throw error;
      }
   }
}

// Legacy function exports for backward compatibility
export const getCampaign = CampaignService.getCampaign;
export const getCampaignDetails = CampaignService.getCampaignDetails;
export const getAllCampaigns = CampaignService.getAllCampaigns;
export const getCampaignSearch = CampaignService.searchCampaigns;
export const getCampaignsFiltered = CampaignService.getFilteredCampaigns;
export const getCampaignsDateRange = CampaignService.getCampaignsByDateRange;

export const getDonationPage = PageService.getDonationPage;
export const getTicketPurchasePage = PageService.getTicketPurchasePage;
export const getThankYouPage = PageService.getThankYouPage;
export const getTicketPage = PageService.getTicketPage;
export const getPeerLandingPage = PageService.getPeerLandingPage;
export const getPeerFundraisingPage = PageService.getPeerFundraisingPage;
export const getDonationForm = PageService.getDonationForm;
export const getPageSections = PageService.getPageSections;
export const getLandingPage = PageService.getLandingPage;
export const getAboutPage = PageService.getAboutPage;

export const getOrganization = OrganizationService.getOrganization;

export const getCampaignDesignations = DesignationService.getCampaignDesignations;
export const getSingleDesignation = DesignationService.getSingleDesignation;
export const getActiveDesignations = DesignationService.getActiveDesignations;
export const getAllDesignations = DesignationService.getAllDesignations;

export const getAllUsers = UserService.getAllUsers;
export const getUserData = UserService.getUserData;
export const getUserOrganizations = UserService.getUserOrganizations;
export const getPendingUserOrganizations = UserService.getPendingUserOrganizations;

export const getTransactionsByOrg = TransactionService.getTransactionsByOrg;
export const getTransactionsByCampaign = TransactionService.getTransactionsByCampaign;
export const getTransactionsOverTime = TransactionService.getTransactionsOverTime;
export const getTransactionsDateRange = TransactionService.getTransactionsByDateRange;
export const getTransactionsFiltered = TransactionService.getFilteredTransactions;
export const getTransactionSearch = TransactionService.searchTransactions;

export const getCustomQuestions = ContentService.getCustomQuestions;
export const getCampaignTickets = ContentService.getCampaignTickets;
export const getFaqs = ContentService.getFaqs;