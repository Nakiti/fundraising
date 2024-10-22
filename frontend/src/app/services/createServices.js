import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export const createDesignation = async (data) => {
   try {
      await axios.post("http://localhost:4000/api/designation/create", data)

   } catch (err) {
      console.log(err)
   }
}

export const createUser = async(data) => {
   try {
      await axios.post("http://localhost:4000/api/user/create", data)
   } catch (err) {
      console.log(err)
   }
}

export const createCustomQuestion = async(data) => {

   try {
      await axios.post(`${API_BASE_URL}/campaign_question/create`, data)
   } catch (err) {
      console.log(err)
   }
}

export const createLandingPage = async (data, organizationId) => {
   try {
      await axios.post(`${API_BASE_URL}/landing_pageRoutes/create`, {organization_id: organizationId, ...data})
   } catch (err) {
      console.log(err)
   }
}