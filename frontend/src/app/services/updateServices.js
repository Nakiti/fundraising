import axios from "axios"

const API_BASE_URL = 'http://localhost:4000/api';

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

export const updateUser = async(id, data) => {
   try {
      await axios.put(`${API_BASE_URL}/user/update/${id}`, data)
   } catch (err) {
      console.log(err)
   }
}