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
   const formData = new FormData()

   formData.append("title", previewInputs.title)
   formData.append("message", previewInputs.message)
   formData.append("image", previewInputs.image)
   formData.append("heading", previewInputs.heading)
   formData.append("bg_color", previewInputs.bg_color)
   formData.append("p_color", previewInputs.p_color)
   formData.append("s_color", previewInputs.s_color)
   formData.append("h_color", previewInputs.h_color)

   try {
      const response = await axios.put(`${API_BASE_URL}/preview/update/${campaignId}`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
      });
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
      
      return campaignId.data

   } catch (err) {
      console.log(err)
   }
}

export const createPreview = async(campaignId, previewInputs) => {
   const formData = new FormData()

   formData.append('campaign_id', campaignId)
   formData.append("title", previewInputs.title)
   formData.append("message", previewInputs.message)
   formData.append("image", previewInputs.image)
   formData.append("heading", previewInputs.heading)
   formData.append("bg_color", previewInputs.bg_color)
   formData.append("p_color", previewInputs.p_color)
   formData.append("s_color", previewInputs.s_color)
   formData.append("h_color", previewInputs.h_color)
   


   try {
      const response = await axios.post(`${API_BASE_URL}/preview/create`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
      });
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
      await axios.post(`${API_BASE_URL}/campaign_designation/create/${campaignId}`, designations)
   } catch (err) {
      console.log(err)
   }
}