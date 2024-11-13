import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export const createCampaign = async(currentUser, type) => {
   try {
      const campaignId = await axios.post(`${API_BASE_URL}/campaign/create`, {
         defaultDesignation: 0,
         campaignName: "",
         internalName: "",
         goal: 0,
         url: "",
         status: "inactive",
         organization_id: currentUser.organization_id,
         created_by: currentUser.id,
         type: type
      })
      
      console.log("camapignid", campaignId.data)
      return campaignId.data
   } catch (err) {
      console.log(err)
      return {id: null, error: err.response.data}
   }

   // create campaign with just type and id
   // use update campaign on all future edits/changes to organization
}

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