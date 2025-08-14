import { api, validators, errorHandler } from './apiClient.js';

// Organization Services
export class OrganizationCreateService {
   // Create organization
   static async createOrganization(data, userId) {
      try {
         // Validate required fields
         validators.required(data.name, 'Organization Name');
         validators.minLength(data.name, 2, 'Organization Name');
         validators.id(userId, 'User ID');

         const response = await api.post('/organization/register', {
            ...data,
            userId: userId
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating organization:', error);
         throw error;
      }
   }

   // Create landing page
   static async createLandingPage(data, organizationId) {
      try {
         validators.required(data.title, 'Title');
         validators.minLength(data.title, 2, 'Title');
         validators.id(organizationId, 'Organization ID');

         const response = await api.post('/landing_pageRoutes/create', {
            organization_id: organizationId,
            ...data
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating landing page:', error);
         throw error;
      }
   }
}

// Campaign Services
export class CampaignCreateService {
   // Create campaign
   static async createCampaign(currentUser, organizationId) {
      try {
         validators.id(currentUser?.id, 'User ID');
         validators.id(organizationId, 'Organization ID');

         const response = await api.post('/campaign/create', {
            organization_id: organizationId,
            created_by: currentUser.id,
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating campaign:', error);
         return { id: null, error: error.message };
      }
   }

   // Create campaign details
   static async createCampaignDetails(campaignId, currentUser, type, internalName) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');
         validators.required(type, 'Type');
         validators.required(internalName, 'Internal Name');

         const response = await api.post('/campaign_details/create', {
            campaign_id: campaignId,
            user_id: currentUser.id,
            type: type,
            internalName: internalName
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating campaign details:', error);
         throw error;
      }
   }

   // Create campaign designation
   static async createCampaignDesignation(campaignId, designations) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(designations, 'Designations');

         const response = await api.post(`/campaign_designation/create/${campaignId}`, designations);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating campaign designation:', error);
         throw error;
      }
   }

   // Create campaign ticket
   static async createCampaignTicket(campaignId, data) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(data, 'Ticket Data');

         const response = await api.post(`/campaign_ticket/create/${campaignId}`, data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating campaign ticket:', error);
         throw error;
      }
   }

   // Create custom question
   static async createCustomQuestion(campaignId, questions) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(questions, 'Questions');

         const response = await api.post(`/campaign_question/create/${campaignId}`, questions);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating custom question:', error);
         throw error;
      }
   }

   // Create FAQ
   static async createFaq(data, campaignId) {
      try {
         validators.required(data, 'FAQ Data');
         validators.id(campaignId, 'Campaign ID');

         const response = await api.post(`/faq/create/${campaignId}`, data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating FAQ:', error);
         throw error;
      }
   }
}

// Page Services
export class PageCreateService {
   // Create donation page
   static async createDonationPage(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.user_id, 'User ID');

         const response = await api.post('/donationPage/create', {
            campaign_id: campaignId,
            user_id: currentUser.user_id
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating donation page:', error);
         throw error;
      }
   }

   // Create thank you page
   static async createThankYouPage(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/thankYouPage/create', {
            campaign_id: campaignId,
            user_id: currentUser.id
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating thank you page:', error);
         throw error;
      }
   }

   // Create ticket purchase page
   static async createTicketPurchasePage(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/ticket_purchase_page/create', {
            campaign_id: campaignId,
            user_id: currentUser.id
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating ticket purchase page:', error);
         throw error;
      }
   }

   // Create peer landing page
   static async createPeerLandingPage(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/peer_landing_page/create', {
            campaign_id: campaignId,
            user_id: currentUser.id
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating peer landing page:', error);
         throw error;
      }
   }

   // Create donation form
   static async createDonationForm(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/donation_form/create', {
            campaign_id: campaignId,
            user_id: currentUser.id
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating donation form:', error);
         throw error;
      }
   }

   // Create peer fundraising page
   static async createPeerFundraisingPage(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/peer_fundraising_page/create', {
            campaign_id: campaignId,
            user_id: currentUser.id
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating peer fundraising page:', error);
         throw error;
      }
   }

   // Create ticket page
   static async createTicketPage(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');

         const response = await api.post('/ticket_page/create', {
            campaignId: campaignId
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating ticket page:', error);
         throw error;
      }
   }

   // Create page section
   static async createPageSection(pageId, name, active, currentUser) {
      try {
         validators.id(pageId, 'Page ID');
         validators.required(name, 'Section Name');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/sections/create', {
            page_id: pageId,
            name: name,
            active: active,
            user_id: currentUser.id
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating page section:', error);
         throw error;
      }
   }
}

// User Services
export class UserCreateService {
   // Create user
   static async createUser(data) {
      try {
         // Validate user data
         validators.required(data.firstName, 'First Name');
         validators.minLength(data.firstName, 2, 'First Name');
         validators.required(data.lastName, 'Last Name');
         validators.minLength(data.lastName, 2, 'Last Name');
         validators.required(data.email, 'Email');
         validators.email(data.email);
         validators.required(data.password, 'Password');
         validators.password(data.password, 8);

         const response = await api.post('/user/create', data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating user:', error);
         throw error;
      }
   }

   // Create user organization relation
   static async createUserOrganizationRelation(userId, organizationId, status, role) {
      try {
         validators.id(userId, 'User ID');
         validators.id(organizationId, 'Organization ID');
         validators.required(status, 'Status');
         validators.required(role, 'Role');

         const response = await api.post('/user_organization/create', {
            userId: userId,
            organizationId: organizationId,
            status: status,
            role: role
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating user organization relation:', error);
         throw error;
      }
   }
}

// Designation Services
export class DesignationCreateService {
   // Create designation
   static async createDesignation(data) {
      try {
         validators.required(data.name, 'Designation Name');
         validators.minLength(data.name, 2, 'Designation Name');

         const response = await api.post('/designation/create', data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating designation:', error);
         throw error;
      }
   }
}

// Legacy function exports for backward compatibility
export const createOrganization = OrganizationCreateService.createOrganization;
export const createLandingPage = OrganizationCreateService.createLandingPage;

export const createCampaign = CampaignCreateService.createCampaign;
export const createCampaignDetails = CampaignCreateService.createCampaignDetails;
export const createCampaignDesignation = CampaignCreateService.createCampaignDesignation;
export const createCampaignTicket = CampaignCreateService.createCampaignTicket;
export const createCustomQuestion = CampaignCreateService.createCustomQuestion;
export const createFaq = CampaignCreateService.createFaq;

export const createDonationPage = PageCreateService.createDonationPage;
export const createThankYouPage = PageCreateService.createThankYouPage;
export const createTicketPurchasePage = PageCreateService.createTicketPurchasePage;
export const createPeerLandingPage = PageCreateService.createPeerLandingPage;
export const createDonationForm = PageCreateService.createDonationForm;
export const createPeerFundraisingPage = PageCreateService.createPeerFundraisingPage;
export const createTicketPage = PageCreateService.createTicketPage;
export const createPageSection = PageCreateService.createPageSection;

export const createUser = UserCreateService.createUser;
export const createUserOrganizationRelation = UserCreateService.createUserOrganizationRelation;

export const createDesignation = DesignationCreateService.createDesignation;