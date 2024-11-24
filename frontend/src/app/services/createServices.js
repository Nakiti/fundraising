import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000/api';

export const createCampaign = async(currentUser, organizationId) => {
   try {
      const campaignId = await axios.post(`${API_BASE_URL}/campaign/create`, {
         organization_id: organizationId,
         created_by: currentUser.id,
      })
      console.log("camapignid", campaignId.data)
      return campaignId.data
   } catch (err) {
      console.log(err)
      return {id: null, error: err.response.data}
   }
}

export const createCampaignDetails = async (campaignId, currentUser, type, internalName) => {
   try {
      await axios.post(`${API_BASE_URL}/campaign_details/create`, {
         campaign_id: campaignId,
         user_id: currentUser.id,
         type: type,
         internalName: internalName
      })
   } catch (err) {
      console.log(err)
   }
}

export const createThankYouPage = async (campaignId, currentUser) => {
   try {
      const pageId = await axios.post(`${API_BASE_URL}/thankYouPage/create`, {
         campaign_id: campaignId,
         user_id: currentUser.id
      })

      return pageId.data
   } catch (err) {
      console.log(err)
   }
}

export const createPageSection = async(pageId, name, active, currentUser) => {
   try {
      await axios.post(`${API_BASE_URL}/sections/create`, {
         page_id: pageId,
         name: name,
         active: active, 
         user_id: currentUser.id
      })
   } catch (err) {
      console.log(err)
   }
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

// export const createCustomQuestion = async(data, campaignId) => {
//    try {
//       await axios.post(`${API_BASE_URL}/campaign_question/create/${campaignId}`, data)
//    } catch (err) {
//       console.log(err)
//    }
// }

export const createFaq = async(data, camapaignId) => {
   try {
      await axios.post(`${API_BASE_URL}/faq/create/${camapaignId}`, data)
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