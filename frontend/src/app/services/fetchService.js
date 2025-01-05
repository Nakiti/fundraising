import axios from 'axios';

const API_BASE_URL = "https://fundraising-d5a9gdc2d9ctehbt.canadacentral-01.azurewebsites.net/api";

//Campaign

export const getCampaign = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/campaign/get/${campaignId}`);
      return response.data[0];
   } catch (err) {
      console.log(err)
   }
};

export const getSingleDesignation = async(id) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/designation/getSingle/${id}`)
      return response.data[0]
   } catch (err) {
      console.log(err)
   }
}

export const getCampaignDetails = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/campaign_details/get/${campaignId}`)
      return response.data[0]
   } catch (err) {
      console.log(err)
   }
}

export const getPageSections = async (pageId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/sections/getSectionsByPage/${pageId}`)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

export const getDonationPage = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/donationPage/get/${campaignId}`)
      console.log(response)
      return response.data[0]
   } catch (err) {
      console.log(err)
   }
}

export const getTicketPurchasePage = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/ticket_purchase_page/get/${campaignId}`)
      return response.data[0]
   } catch (err) {
      console.log(err)
   }
}

export const getThankYouPage = async(campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/thankYouPage/get/${campaignId}`)
      return response.data[0]
   } catch (err) {
      console.log(err)
   }
}

export const getTicketPage = async(campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/ticket_page/get/${campaignId}`)
      return response.data[0]
   } catch (err) {
      console.log(err)
   }
}

export const getPeerLandingPage = async(campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/peer_landing_page/get/${campaignId}`)
      return response.data[0]
   } catch (err) {
      console.log(err)
   }
}

export const getPeerFundraisingPage = async(campaignId) =>{
   try {
      const response = await axios.get(`${API_BASE_URL}/peer_fundraising_page/get/${campaignId}`)
      return response.data[0]
   } catch (err) {
      console.log(err)
   }
}

export const getDonationForm = async(campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/donation_form/get/${campaignId}`)
      console.log("fonrted", response.data[0])
      return response.data[0]
   } catch (err) {
      console.log(err)
   }
}

export const getAllCampaigns = async(organizationId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/campaign/getByOrg/${organizationId}`)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

// export const getActiveCampaigns = async(organizationId) => {
//    try {
//       const response = await axios.get(`${API_BASE_URL}/campaign/getActive/${organizationId}`)
//       return response.data
//    } catch (err) {
//       console.log(err)
//    }
// }

export const getCampaignSearch = async (query, organizationId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/campaign/search/${organizationId}?q=${query}`)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

export const getCampaignsFiltered = async(organizationId, status, type) => {
   try {
      console.log(status, type)
      const response = await axios.get(`${API_BASE_URL}/campaign/getFiltered/${organizationId}`, {
         params: { status, type }
      });      
      return response.data
   } catch (err) {
      console.log("err", err)
   }
}

export const getCampaignsDateRange = async(start, end, organizationId) => {

   start = (new Date(start)).toISOString().slice(0, 19).replace('T', ' ')
   end = (new Date(end)).toISOString().slice(0, 19).replace('T', ' ')

   try {
      const response = await axios.get(`${API_BASE_URL}/campaign/getDateRange/${organizationId}`, {
         params: {
            start, 
            end
         }
      })
      return response.data
   } catch (err) {
      console.log(err)
   }
}

//Organization

export const getOrganization = async(organizationId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/organization/get/${organizationId}`)
      return response.data[0]
   } catch (err) {
      console.log(err)
   }
}

//Designations

export const getCampaignDesignations = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/campaign_designation/get/${campaignId}`);
      console.log(response.data)
      return response.data;
   } catch (err) {
      console.error('Error fetching campaign designations:', err);
      throw err;
   }
};

export const getActiveDesignations = async (organizationId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/designation/getActive/${organizationId}`);
      return response.data;
   } catch (err) {
      console.error('Error fetching active designations:', err);
      throw err;
   }
};

export const getAllDesignations = async (organizationId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/designation/get/${organizationId}`);
      return response.data;
   } catch (err) {
      console.error('Error fetching active designations:', err);
      throw err;
   }
};

// User

export const getAllUsers = async(organizationId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/user/getByOrg/${organizationId}`)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

export const getCurrentUser = async() => {
   try {
      const response = await axios.get(`${API_BASE_URL}/user/getCurrentUser`, {
         withCredentials: true,
      });
      console.log("data", response.data)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

export const getUserData = async(userId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/user/get/${userId}`)
      return response.data[0]
   } catch (err) {
      console.log(err)
   }
}

// Transactions
export const getTransactionsByOrg = async (organizationId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/transaction/getByOrg/${organizationId}`)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

export const getTransactionsByCampaign = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/transaction/getByCampaign/${campaignId}`)
      // console.log(response.data)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

export const getTransactionsOverTime = async(organizationId, start, end) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/transaction/getTimeframe/${organizationId}`, {params: {start, end}})
      return response.data
   } catch (err) {
      console.log(err)
   }
}

export const getTransactionsDateRange = async(start, end, organizationId) => {

   start = (new Date(start)).toISOString().slice(0, 19).replace('T', ' ')
   end = (new Date(end)).toISOString().slice(0, 19).replace('T', ' ')

   try {
      const response = await axios.get(`${API_BASE_URL}/campaign/getDateRange/${organizationId}`, {
         params: {
            start, 
            end
         }
      })
      return response.data
   } catch (err) {
      console.log(err)
   }
}

export const getTransactionsFiltered = async(organizationId, status) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/transaction/getFiltered/${organizationId}`, {
         params: { status }
      });      
      return response.data
   } catch (err) {
      console.log("err", err)
   }
}

export const getTransactionSearch = async (query, organizationId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/transaction/search/${organizationId}?q=${query}`)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

//Custom Questions

export const getCustomQuestions = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/campaign_question/get/${campaignId}`)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

//tickets
export const getCampaignTickets = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/campaign_ticket/get/${campaignId}`)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

//faqs
export const getFaqs = async(campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/faq/get/${campaignId}`)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

//landing page

export const getLandingPage = async(organizationId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/landing_page/get/${organizationId}`)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

//about page

export const getAboutPage = async(organizationId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/about_page/get/${organizationId}`)
      return response.data
   } catch (err) {
      console.log(err)
   }
}

// user organizations

export const getUserOrganizations = async(userId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/user_organization/get/${userId}`)
      return response.data 
   } catch (err) {
      console.log(err)
   }
}

export const getPendingUserOrganizations = async(userId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/user_organization/getPending/${userId}`)
      return response.data
   } catch (err) {
      console.log(err)
   }

}