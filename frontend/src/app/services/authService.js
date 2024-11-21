import axios from 'axios';

const API_BASE_URL = "https://e-hundi-node-avhydrhehccmauf3.westus-01.azurewebsites.net/api";

export const loginUser = async (inputs) => {
   try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, inputs, {withCredentials: true});
      return response.data
   } catch (err) {
      console.log(err)
   }
};

export const logoutUser = async () => {
   try {
      await axios.post(`${API_BASE_URL}/user/logout`, {}, {withCredentials: true});
      return null
   } catch (e) {
      console.log(e)
   }
   setCurrentUser(null);
};