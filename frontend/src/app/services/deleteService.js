import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000/api';

export const deleteFaq = async(id) => {
   try {
      await axios.delete(`${API_BASE_URL}/faq/delete/${id}`)
   } catch (err) {
      console.log(err)
   }
}

export const deleteCampaignDesignationBatch = async(designations) => {
   try {
      await axios.delete(`${API_BASE_URL}/campaign_designation/deleteBatch`, designations)
   } catch (err) {
      console.log(err)
   }
}

export const deleteCampaignQuestionsBatch = async(questions) => {
   try {
      await axios.delete(`${API_BASE_URL}/campaign_question/deleteBatch`, questions)
   } catch (err) {
      console.log(err)
   }
}

export const deleteCampaignTicketsBatch = async(tickets) => {
   try {
      await axios.delete(`${API_BASE_URL}/campaign_ticket/deleteBatch`, tickets)
   } catch (err) {
      console.log(err)
   }
}