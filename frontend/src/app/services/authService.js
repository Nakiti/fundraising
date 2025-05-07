import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;

export const loginUser = async (inputs) => {
   try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, inputs, {withCredentials: true});
      console.log(response)
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