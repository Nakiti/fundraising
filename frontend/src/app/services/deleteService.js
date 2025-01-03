import axios from 'axios';

const API_BASE_URL = "https://fundraising-d5a9gdc2d9ctehbt.canadacentral-01.azurewebsites.net/api";

export const deleteFaq = async(id) => {
   try {
      await axios.delete(`${API_BASE_URL}/faq/delete/${id}`)
   } catch (err) {
      console.log(err)
   }
}

export const deleteCampaignDesignationBatch = async(designations) => {
   try {
      console.log(designations)
      await axios.delete(`${API_BASE_URL}/campaign_designation/deleteBatch`, {data: designations})
   } catch (err) {
      console.log(err)
   }
}

export const deleteCampaignQuestionsBatch = async(questions) => {
   try {
      await axios.delete(`${API_BASE_URL}/campaign_question/deleteBatch`, {data: questions})
   } catch (err) {
      console.log(err)
   }
}

export const deleteCampaignTicketsBatch = async(tickets) => {
   try {
      await axios.delete(`${API_BASE_URL}/campaign_ticket/deleteBatch`, {data: tickets})
   } catch (err) {
      console.log(err)
   }
}

export const deleteFaqsBatch = async(faqs) => {
   try {
      await axios.delete(`${API_BASE_URL}/faq/deleteBatch`, {data: faqs})
   } catch (err) {
      console.log(err)
   }
} 

export const deleteCustomQuestion = async(campaignId) => {
   try {
      await axios.post(`${API_BASE_URL}/campaign_question/delete/${campaignId}`)
   } catch (err) {
      console.log(err)
   }
}

export const deleteCampaignDesignation = async(campaignId) => {
   try {
      await axios.delete(`${API_BASE_URL}/campaign_designation/delete/${campaignId}`)
   } catch (err) {
      console.log(err)
   }
}


