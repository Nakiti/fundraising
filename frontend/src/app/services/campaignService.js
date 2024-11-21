import axios from 'axios';

const API_BASE_URL = "https://e-hundi-node-avhydrhehccmauf3.westus-01.azurewebsites.net/api";

export const updateCampaignDetails = async (campaignId, inputs, status, currentUser) => {
   try {
      await axios.put(`${API_BASE_URL}/campaign_details/update/${campaignId}`, {
         defaultDesignation: inputs.defaultDesignation,
         externalName: inputs.campaignName,
         internalName: inputs.internalName,
         goal: inputs.goal,
         url: inputs.url,
         status: status,
         userId: currentUser.id
      });
   } catch (err) {
      console.error('Error updating campaign:', err);
      return err.response.data
   }
};

export const updateDonationPage = async (campaignId, inputs) => {
   const formData = new FormData()

   formData.append("headline", inputs.headline)
   formData.append("description", inputs.description)
   formData.append("image", inputs.image)
   formData.append("bg_color", inputs.bg_color)
   formData.append("p_color", inputs.p_color)
   formData.append("s_color", inputs.s_color)
   formData.append("b1_color", inputs.b1_color)
   formData.append("b2_color", inputs.b2_color)
   formData.append("b3_color", inputs.b3_color)
   formData.append("button1", inputs.button1);
   formData.append("button2", inputs.button2);
   formData.append("button3", inputs.button3);
   formData.append("button4", inputs.button4);
   formData.append("button5", inputs.button5);
   formData.append("button6", inputs.button6);

   try {
      await axios.put(`${API_BASE_URL}/donationPage/update/${campaignId}`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
      });
   } catch (err) {
      console.error('Error updating preview:', err);
      throw err;
   }
};

export const createCampaign = async(currentUser, organizationId) => {
   try {
      const campaignId = await axios.post(`${API_BASE_URL}/campaign/create`, {
         organization_id: organizationId,
         created_by: currentUser.id 
      })
      
      return campaignId.data
   } catch (err) {
      console.log(err)
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