import { api, validators, errorHandler } from './apiClient.js';

// FAQ Services
export class FaqDeleteService {
   // Delete single FAQ
   static async deleteFaq(id) {
      try {
         validators.id(id, 'FAQ ID');

         const response = await api.delete(`/faq/delete/${id}`);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error deleting FAQ:', error);
         throw error;
      }
   }

   // Delete FAQs batch
   static async deleteFaqsBatch(faqs) {
      try {
         validators.required(faqs, 'FAQs Array');

         const response = await api.delete('/faq/deleteBatch', { data: faqs });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error deleting FAQs batch:', error);
         throw error;
      }
   }
}

// Campaign Services
export class CampaignDeleteService {
   // Delete campaign designation batch
   static async deleteCampaignDesignationBatch(designations) {
      try {
         validators.required(designations, 'Designations Array');

         const response = await api.delete('/campaign_designation/deleteBatch', { data: designations });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error deleting campaign designation batch:', error);
         throw error;
      }
   }

   // Delete campaign designation
   static async deleteCampaignDesignation(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');

         const response = await api.delete(`/campaign_designation/delete/${campaignId}`);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error deleting campaign designation:', error);
         throw error;
      }
   }

   // Delete campaign questions batch
   static async deleteCampaignQuestionsBatch(questions) {
      try {
         validators.required(questions, 'Questions Array');

         const response = await api.delete('/campaign_question/deleteBatch', { data: questions });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error deleting campaign questions batch:', error);
         throw error;
      }
   }

   // Delete custom question
   static async deleteCustomQuestion(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');

         const response = await api.post(`/campaign_question/delete/${campaignId}`);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error deleting custom question:', error);
         throw error;
      }
   }

   // Delete campaign tickets batch
   static async deleteCampaignTicketsBatch(tickets) {
      try {
         validators.required(tickets, 'Tickets Array');

         const response = await api.delete('/campaign_ticket/deleteBatch', { data: tickets });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error deleting campaign tickets batch:', error);
         throw error;
      }
   }
}

// Legacy function exports for backward compatibility
export const deleteFaq = FaqDeleteService.deleteFaq;
export const deleteFaqsBatch = FaqDeleteService.deleteFaqsBatch;

export const deleteCampaignDesignationBatch = CampaignDeleteService.deleteCampaignDesignationBatch;
export const deleteCampaignDesignation = CampaignDeleteService.deleteCampaignDesignation;
export const deleteCampaignQuestionsBatch = CampaignDeleteService.deleteCampaignQuestionsBatch;
export const deleteCustomQuestion = CampaignDeleteService.deleteCustomQuestion;
export const deleteCampaignTicketsBatch = CampaignDeleteService.deleteCampaignTicketsBatch;


