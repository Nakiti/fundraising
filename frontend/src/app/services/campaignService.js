import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export const updateCampaign = async (campaignId, settingsInputs, status, currentUser) => {
   try {
      await axios.put(`${API_BASE_URL}/campaign/update/${campaignId}`, {
         ...settingsInputs,
         status: status,
         updated_by: currentUser.id
      });
   } catch (err) {
      console.error('Error updating campaign:', err);
      throw err;
   }
};

export const updatePreview = async (campaignId, previewInputs) => {
   try {
      await axios.put(`${API_BASE_URL}/preview/update/${campaignId}`, previewInputs);
   } catch (err) {
      console.error('Error updating preview:', err);
      throw err;
   }
};

export const createCampaign = async(status, settingsInputs, currentUser) => {
   try {
      const campaignId = await axios.post(`${API_BASE_URL}/campaign/create`, {
         ...settingsInputs,
         status: status,
         organization_id: currentUser.organization_id,
         created_by: currentUser.id
      })

      return campaignId

   } catch (err) {
      console.log(err)
   }
}

export const createPreview =  async(campaignId, previewInputs) => {
   try {
      await axios.post(`${API_BASE_URL}/preview/create`, {
         ...previewInputs,
         campaign_id: campaignId
      })
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

export const createCampaignDesignation = async(campaignId, designations) => {
   try {
      await axios.post(`${API_BASE_URL}/campaign_designation/post/${campaignId}`, designations)
   } catch (err) {
      console.log(err)
   }
}