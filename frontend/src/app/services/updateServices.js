import axios from "axios"

const API_BASE_URL = "https://fundraising-d5a9gdc2d9ctehbt.canadacentral-01.azurewebsites.net/api";

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

export const updatePeerLandingPage = async(id, data, userId) => {
   const formData = new FormData()

   formData.append("headline", data.headline)
   formData.append("tagline", data.tagline)
   formData.append("description", data.description)
   formData.append("banner_image", data.banner_image)
   formData.append("p_color", data.p_color)
   formData.append("s_color", data.s_color)
   formData.append("bg_color", data.bg_color)
   formData.append("t_color", data.t_color)
   formData.append("user_id", userId)

   try {
      await axios.put(`${API_BASE_URL}/peer_landing_page/update/${id}`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
      })
   } catch (err) {
      console.log(err)
   }
}

export const updateDonationForm = async(id, data, userId) => {
   const formData = new FormData()

   formData.append("headline", data.headline)
   formData.append("description", data.description)
   formData.append("bg_image", data.bg_image)
   formData.append("p_color", data.p_color)
   formData.append("s_color", data.s_color)
   formData.append("bg_color", data.b1_color)
   formData.append("t_color", data.b2_color)
   formData.append("button1", data.button1);
   formData.append("button2", data.button2);
   formData.append("button3", data.button3);
   formData.append("button4", data.button4);
   formData.append("button5", data.button5);
   formData.append("button6", data.button6);
   formData.append("user_id", userId)

   console.log(formData)

   try {
      await axios.put(`${API_BASE_URL}/donation_form/update/${id}`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
      })
   } catch (err) {
      console.log(err)
   }

}

export const updateTicketPurchasePage = async(id, data, userId) => {
   try {
      await axios.put(`${API_BASE_URL}/ticket_purchase_page/update/${id}`, 
         {
            ...data,
            userId: userId
         }
      )
   } catch (err) {
      console.log(err)
   }

}

export const updatePeerFundraisingPage = async(id, data, userId) => {
   const formData = new FormData()

   formData.append("headline", data.headline)
   formData.append("description", data.description)
   formData.append("banner_image", data.banner_image)
   formData.append("person_image", data.person_image)
   formData.append("p_color", data.p_color)
   formData.append("s_color", data.s_color)
   formData.append("bg_color", data.bg_color)
   formData.append("t_color", data.t_color)
   formData.append("user_id", userId)

   try {
      await axios.put(`${API_BASE_URL}/peer_fundraising_page/update/${id}`, formData, {
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

   formData.append("headline", data.headline)
   formData.append("description", data.description)
   formData.append("bg_image", data.bg_image)
   formData.append("bg_color", data.bg_color)
   formData.append("p_color", data.p_color)
   formData.append("s_color", data.s_color)
   

   try {
      await axios.put(`${API_BASE_URL}/thankyouPage/update/${campaignId}`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
      })
   } catch (err) {
      console.log(err)
   }
}

export const updateTicketPage = async (campaignId, data) => {
   const formData = new FormData()

   console.log(data)

   formData.append("title", data.title)
   formData.append("date", data.date)
   formData.append("address", data.address)
   formData.append("bgImage", data.bgImage)
   formData.append("aboutDescription", data.aboutDescription)
   formData.append("venueName", data.venueName)
   formData.append("instructions", data.instructions)
   formData.append("bg_color", data.bg_color)
   formData.append("bg_color2", data.bg_color2)
   formData.append("p_color", data.p_color)
   formData.append("s_color", data.s_color)
   formData.append("b1_color", data.b1_color)

   try {
      await axios.put(`${API_BASE_URL}/ticket_page/update/${campaignId}`, formData, {
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