import axios from "axios"

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000/api';

export const updateOrganization = async(organizationId, data) => {
   try {
      await axios.put(`${API_BASE_URL}/organization/update/${organizationId}`, data)
      
   } catch (err) {
      console.log(err)
   }
}

export const updateDesignation = async(id, data) => {
   try {
      await axios.put(`${API_BASE_URL}/designation/update/${id}`, data)
   } catch (err) {
      console.log(err)
   }
}

export const updatePageSection = async(id, active) => {
   try {
      await axios.put(`${API_BASE_URL}/sections/update/${id}`, {active: active})
   } catch (err) {
      console.log(err)
   }
}

export const updateUser = async(id, data) => {
   try {
      await axios.put(`${API_BASE_URL}/user/update/${id}`, data)
   } catch (err) {
      console.log(err)
   }
}

export const updateLandingPage = async(id, data) => {
   const formData = new FormData()

   formData.append("title", data.title)
   formData.append("description", data.description)
   formData.append("bgImage", data.image)
   formData.append("aboutImage", data.bg_color)
   formData.append("about", data.bg_color)
   formData.append("p_color", data.p_color)
   formData.append("s_color", data.s_color)
   formData.append("c_color", data.b1_color)
   formData.append("ct_color", data.b2_color)
   formData.append("b_color", data.b3_color)
   formData.append("bt_color", data.b3_color)

   try {
      await axios.put(`${API_BASE_URL}/landing_page/update/${id}`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
      })
   } catch (err) {
      console.log(err)
   }
}

export const updateThankYouPage = async(campaignId, data) => {
   const formData = new FormData()

   formData.append("headline", data.title)
   formData.append("description", data.description)
   formData.append("bg_image", data.bg_image)
   formData.append("bg_color", data.bg_color)
   formData.append("p_color", data.p_color)
   formData.append("s_color", data.s_color)

   try {
      await axios.put(`${API_BASE_URL}/landing_page/update/${id}`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
      })
   } catch (err) {
      console.log(err)
   }
}

export const deactivateCampaign = async(campaignId, userId) => {
   try {
      await axios.put(`${API_BASE_URL}/campaign/deactivate/${campaignId}`, {updatedBy: userId})
   } catch (err) {
      console.log(err)
   }
}

export const updateUserOrganizationRelation = async(id) => {
   try {
      await axios.put(`${API_BASE_URL}/user_organization/update/${id}`)
   } catch (err) {
      console.log(err)
   }
}