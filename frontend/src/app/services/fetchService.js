import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

//Campaign

export const getCampaignDetails = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/campaign/get/${campaignId}`);
      return response.data[0];
   } catch (err) {
      console.error('Error fetching campaign details:', err);
      throw err;
   }
};

export const getCampaignPreview = async (campaignId) => {
   try {
      const response = await axios.get(`${API_BASE_URL}/preview/get/${campaignId}`)
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
      console.log(response.data)
      return response.data
   } catch (err) {
      console.log(err)
   }
}