import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;

export const createOrganization = async(data, userId) => {
   try {
      const organizationId = await axios.post(`${API_BASE_URL}/organization/register`, {
         ...data, 
         userId: userId
      })
      return organizationId
   } catch (err) {
      console.log(err)
   }
}

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


export const createDonationPage = async (campaignId, currentUser) => {
   try {
      const pageId = await axios.post(`${API_BASE_URL}/donationPage/create`, {
         campaign_id: campaignId,
         user_id: currentUser.user_id
      })

      return pageId.data
   } catch (err) {
      console.log(err)
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

export const createTicketPurchasePage = async (campaignId, currentUser) => {
   try {
      const pageId = await axios.post(`${API_BASE_URL}/ticket_purchase_page/create`, {
         campaign_id: campaignId,
         user_id: currentUser.id
      })

      return pageId.data
   } catch (err) {
      console.log(err)
   }
}

export const createPeerLandingPage = async (campaignId, currentUser) => {
   try {
      const pageId = await axios.post(`${API_BASE_URL}/peer_landing_page/create`, {
         campaign_id: campaignId,
         user_id: currentUser.id
      })

      return pageId.data
   } catch (err) {
      console.log(err)
   }
}

export const createCustomQuestion = async(campaignId, questions) => {

   console.log(questions)

   try {
      await axios.post(`${API_BASE_URL}/campaign_question/create/${campaignId}`, questions)
   } catch (err) {
      console.log(err)
   }
}

export const createCampaignDesignation = async(campaignId, designations) => {
   try {
      await axios.post(`${API_BASE_URL}/campaign_designation/create/${campaignId}`, designations)
   } catch (err) {
      console.log(err)
   }
}

export const createDonationForm = async(campaignId, currentUser) => {
   try {
      const pageId = await axios.post(`${API_BASE_URL}/donation_form/create`, {
         campaign_id: campaignId,
         user_id: currentUser.id
      })

      return pageId.data
   } catch (err) {
      console.log(err)
   }
}

export const createPeerFundraisingPage = async (campaignId, currentUser) => {
   try {
      const pageId = await axios.post(`${API_BASE_URL}/peer_fundraising_page/create`, {
         campaign_id: campaignId,
         user_id: currentUser.id
      })

      return pageId.data
   } catch (err) {
      console.log(err)
   }
}

export const createTicketPage = async(campaignId) => {
   try {
      const pageId = await axios.post(`${API_BASE_URL}/ticket_page/create`, {
         campaignId: campaignId
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

export const createCampaignTicket = async(campaignId, data) => {
   try {
      await axios.post(`${API_BASE_URL}/campaign_ticket/create/${campaignId}`, data)
   } catch (err) {
      console.log(err)
   }
}

export const createUser = async(data) => {
   try {
      const userId = await axios.post("http://localhost:4000/api/user/create", data)
      return userId
   } catch (err) {
      console.log(err)
   }
}

export const createUserOrganizationRelation = async(userId, organizationId, status, role) => {
   try {
      await axios.post(`${API_BASE_URL}/user_organization/create`, {
         userId: userId,
         organizationId: organizationId,
         status: status,
         role: role
      })
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