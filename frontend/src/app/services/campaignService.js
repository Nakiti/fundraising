import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export const updateCampaign = async (campaignId, aboutInputs, status, currentUser) => {
   try {
      await axios.put(`${API_BASE_URL}/campaign/update/${campaignId}`, {
         campaignName: aboutInputs.campaignName,
         internalName: aboutInputs.internalName,
         goal: aboutInputs.goal,
         url: aboutInputs.shortUrl,
         defaultDesignation: aboutInputs.defaultDesignation,
         status: status,
         updated_by: currentUser.id
      });
   } catch (err) {
      console.error('Error updating campaign:', err);
      return err.response.data
   }
};

export const updatePreview = async (campaignId, previewInputs, buttonInputs) => {
   const formData = new FormData()

   formData.append("headline", previewInputs.headline)
   formData.append("description", previewInputs.description)
   formData.append("image", previewInputs.image)
   formData.append("bg_color", previewInputs.bg_color)
   formData.append("p_color", previewInputs.p_color)
   formData.append("s_color", previewInputs.s_color)
   formData.append("b1_color", previewInputs.b1_color)
   formData.append("b2_color", previewInputs.b2_color)
   formData.append("b3_color", previewInputs.b3_color)
   formData.append("button1", buttonInputs.button1);
   formData.append("button2", buttonInputs.button2);
   formData.append("button3", buttonInputs.button3);
   formData.append("button4", buttonInputs.button4);
   formData.append("button5", buttonInputs.button5);
   formData.append("button6", buttonInputs.button6);

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

export const createCampaign = async(status, aboutInputs, currentUser) => {
   try {
      const campaignId = await axios.post(`${API_BASE_URL}/campaign/create`, {
         campaignName: aboutInputs.campaignName,
         internalName: aboutInputs.internalName,
         goal: aboutInputs.goal,
         url: aboutInputs.shortUrl,
         status: status,
         organization_id: currentUser.organization_id,
         created_by: currentUser.id
      })
      
      console.log("camapignid", campaignId.data)
      return {id: campaignId.data, error: ""}
   } catch (err) {
      console.log(err)
      return {id: null, error: err.response.data}
   }
}

export const createPreview = async(campaignId, previewInputs, buttonInputs) => {
   const formData = new FormData()

   formData.append('campaign_id', campaignId)
   formData.append("headline", previewInputs.headline)
   formData.append("description", previewInputs.description)
   formData.append("image", previewInputs.image)
   // formData.append("heading", previewInputs.heading)
   formData.append("bg_color", previewInputs.bg_color)
   formData.append("p_color", previewInputs.p_color)
   formData.append("s_color", previewInputs.s_color)
   formData.append("b1_color", previewInputs.b1_color)
   formData.append("b2_color", previewInputs.b2_color)
   formData.append("b3_color", previewInputs.b3_color)
   formData.append("button1", buttonInputs.button1);
   formData.append("button2", buttonInputs.button2);
   formData.append("button3", buttonInputs.button3);
   formData.append("button4", buttonInputs.button4);
   formData.append("button5", buttonInputs.button5);
   formData.append("button6", buttonInputs.button6);
   
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

export const createCustomQuestion = async(campaignId, questions) => {

   console.log(questions)

   try {
      await axios.post(`${API_BASE_URL}/campaign_question/create/${campaignId}`, questions)
   } catch (err) {
      console.log(err)
   }
}

export const deleteCustomQuestion = async(campaignId) => {
   try {
      await axios.post(`${API_BASE_URL}/campaign_question/delete/${campaignId}`)
   } catch (err) {
      console.log(err)
   }
}