import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

//Campaign

export const getCampaignDetails = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/campaign/get/${campaignId}`);
      return response.data[0];
   } catch (err) {
      console.log(err)
   }
};

export const getCampaignPreview = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/preview/get/${campaignId}`)
      console.log(response)
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

export const getCampaignsFiltered = async(organizationId, status) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/campaign/getFiltered/${organizationId}`, {
         params: { status }
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

export const getUserOrganizations = async(userId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/user_organization/get/${userId}`)
      return response.data 
   } catch (err) {
      console.log(err)
   }
}