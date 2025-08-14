import { api, validators, errorHandler } from './apiClient.js';

// Organization Services
export class OrganizationUpdateService {
   // Update organization
   static async updateOrganization(organizationId, data) {
      try {
         validators.id(organizationId, 'Organization ID');
         validators.required(data, 'Organization Data');

         const response = await api.put(`/organization/update/${organizationId}`, data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating organization:', error);
         throw error;
      }
   }
}

// Campaign Services
export class CampaignUpdateService {
   // Update campaign details
   static async updateCampaignDetails(campaignId, inputs, status, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');
         validators.required(inputs, 'Campaign Inputs');

         const response = await api.put(`/campaign_details/update/${campaignId}`, {
            defaultDesignation: inputs.defaultDesignation,
            externalName: inputs.campaignName,
            internalName: inputs.internalName,
            goal: inputs.goal,
            url: inputs.url,
            status: status,
            userId: currentUser.id
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating campaign details:', error);
         throw error;
      }
   }

   // Deactivate campaign
   static async deactivateCampaign(campaignId, userId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(userId, 'User ID');

         const response = await api.put(`/campaign/deactivate/${campaignId}`, {
            updatedBy: userId
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error deactivating campaign:', error);
         throw error;
      }
   }
}

// Page Services
export class PageUpdateService {
   // Update donation page
   static async updateDonationPage(campaignId, inputs) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(inputs, 'Page Inputs');

         const formData = new FormData();
         formData.append("headline", inputs.headline);
         formData.append("description", inputs.description);
         formData.append("banner_image", inputs.banner_image);
         formData.append("small_image", inputs.small_image);
         formData.append("bg_color", inputs.bg_color);
         formData.append("p_color", inputs.p_color);
         formData.append("s_color", inputs.s_color);
         formData.append("b1_color", inputs.b1_color);
         formData.append("b2_color", inputs.b2_color);
         formData.append("b3_color", inputs.b3_color);
         formData.append("button1", inputs.button1);
         formData.append("button2", inputs.button2);
         formData.append("button3", inputs.button3);
         formData.append("button4", inputs.button4);
         formData.append("button5", inputs.button5);
         formData.append("button6", inputs.button6);

         const response = await api.put(`/donationPage/update/${campaignId}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating donation page:', error);
         throw error;
      }
   }

   // Update landing page
   static async updateLandingPage(id, data) {
      try {
         validators.id(id, 'Page ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         formData.append("title", data.title);
         formData.append("description", data.description);
         formData.append("bgImage", data.image);
         formData.append("aboutImage", data.bg_color);
         formData.append("about", data.bg_color);
         formData.append("p_color", data.p_color);
         formData.append("s_color", data.s_color);
         formData.append("c_color", data.b1_color);
         formData.append("ct_color", data.b2_color);
         formData.append("b_color", data.b3_color);
         formData.append("bt_color", data.b3_color);

         const response = await api.put(`/landing_page/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating landing page:', error);
         throw error;
      }
   }

   // Update peer landing page
   static async updatePeerLandingPage(id, data, userId) {
      try {
         validators.id(id, 'Page ID');
         validators.id(userId, 'User ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         formData.append("headline", data.headline);
         formData.append("tagline", data.tagline);
         formData.append("description", data.description);
         formData.append("banner_image", data.banner_image);
         formData.append("p_color", data.p_color);
         formData.append("s_color", data.s_color);
         formData.append("bg_color", data.bg_color);
         formData.append("t_color", data.t_color);
         formData.append("user_id", userId);

         const response = await api.put(`/peer_landing_page/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating peer landing page:', error);
         throw error;
      }
   }

   // Update donation form
   static async updateDonationForm(id, data, userId) {
      try {
         validators.id(id, 'Form ID');
         validators.id(userId, 'User ID');
         validators.required(data, 'Form Data');

         const formData = new FormData();
         formData.append("headline", data.headline);
         formData.append("description", data.description);
         formData.append("bg_image", data.bg_image);
         formData.append("p_color", data.p_color);
         formData.append("s_color", data.s_color);
         formData.append("bg_color", data.b1_color);
         formData.append("t_color", data.b2_color);
         formData.append("button1", data.button1);
         formData.append("button2", data.button2);
         formData.append("button3", data.button3);
         formData.append("button4", data.button4);
         formData.append("button5", data.button5);
         formData.append("button6", data.button6);
         formData.append("user_id", userId);

         const response = await api.put(`/donation_form/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating donation form:', error);
         throw error;
      }
   }

   // Update ticket purchase page
   static async updateTicketPurchasePage(id, data, userId) {
      try {
         validators.id(id, 'Page ID');
         validators.id(userId, 'User ID');
         validators.required(data, 'Page Data');

         const response = await api.put(`/ticket_purchase_page/update/${id}`, {
            ...data,
            userId: userId
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating ticket purchase page:', error);
         throw error;
      }
   }

   // Update peer fundraising page
   static async updatePeerFundraisingPage(id, data, userId) {
      try {
         validators.id(id, 'Page ID');
         validators.id(userId, 'User ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         formData.append("headline", data.headline);
         formData.append("description", data.description);
         formData.append("banner_image", data.banner_image);
         formData.append("person_image", data.person_image);
         formData.append("p_color", data.p_color);
         formData.append("s_color", data.s_color);
         formData.append("bg_color", data.bg_color);
         formData.append("t_color", data.t_color);
         formData.append("user_id", userId);

         const response = await api.put(`/peer_fundraising_page/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating peer fundraising page:', error);
         throw error;
      }
   }

   // Update thank you page
   static async updateThankYouPage(campaignId, data) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         formData.append("headline", data.headline);
         formData.append("description", data.description);
         formData.append("bg_image", data.bg_image);
         formData.append("bg_color", data.bg_color);
         formData.append("p_color", data.p_color);
         formData.append("s_color", data.s_color);

         const response = await api.put(`/thankyouPage/update/${campaignId}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating thank you page:', error);
         throw error;
      }
   }

   // Update ticket page
   static async updateTicketPage(campaignId, data) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         formData.append("title", data.title);
         formData.append("date", data.date);
         formData.append("address", data.address);
         formData.append("bgImage", data.bgImage);
         formData.append("aboutDescription", data.aboutDescription);
         formData.append("venueName", data.venueName);
         formData.append("instructions", data.instructions);
         formData.append("bg_color", data.bg_color);
         formData.append("bg_color2", data.bg_color2);
         formData.append("p_color", data.p_color);
         formData.append("s_color", data.s_color);
         formData.append("b1_color", data.b1_color);

         const response = await api.put(`/ticket_page/update/${campaignId}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating ticket page:', error);
         throw error;
      }
   }

   // Update page section
   static async updatePageSection(id, active) {
      try {
         validators.id(id, 'Section ID');

         const response = await api.put(`/sections/update/${id}`, { active: active });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating page section:', error);
         throw error;
      }
   }
}

// User Services
export class UserUpdateService {
   // Update user
   static async updateUser(id, data) {
      try {
         validators.id(id, 'User ID');
         validators.required(data, 'User Data');

         const response = await api.put(`/user/update/${id}`, data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating user:', error);
         throw error;
      }
   }

   // Update user organization relation
   static async updateUserOrganizationRelation(id) {
      try {
         validators.id(id, 'Relation ID');

         const response = await api.put(`/user_organization/update/${id}`);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating user organization relation:', error);
         throw error;
      }
   }
}

// Designation Services
export class DesignationUpdateService {
   // Update designation
   static async updateDesignation(id, data) {
      try {
         validators.id(id, 'Designation ID');
         validators.required(data, 'Designation Data');

         const response = await api.put(`/designation/update/${id}`, data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating designation:', error);
         throw error;
      }
   }
}

// Legacy function exports for backward compatibility
export const updateOrganization = OrganizationUpdateService.updateOrganization;

export const updateCampaignDetails = CampaignUpdateService.updateCampaignDetails;
export const deactivateCampaign = CampaignUpdateService.deactivateCampaign;

export const updateDonationPage = PageUpdateService.updateDonationPage;
export const updateLandingPage = PageUpdateService.updateLandingPage;
export const updatePeerLandingPage = PageUpdateService.updatePeerLandingPage;
export const updateDonationForm = PageUpdateService.updateDonationForm;
export const updateTicketPurchasePage = PageUpdateService.updateTicketPurchasePage;
export const updatePeerFundraisingPage = PageUpdateService.updatePeerFundraisingPage;
export const updateThankYouPage = PageUpdateService.updateThankYouPage;
export const updateTicketPage = PageUpdateService.updateTicketPage;
export const updatePageSection = PageUpdateService.updatePageSection;

export const updateUser = UserUpdateService.updateUser;
export const updateUserOrganizationRelation = UserUpdateService.updateUserOrganizationRelation;

export const updateDesignation = DesignationUpdateService.updateDesignation;