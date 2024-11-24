import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000/api';

export const deleteFaq = async(id) => {
   try {
      await axios.delete(`${API_BASE_URL}/faq/delete/${id}`)
   } catch (err) {
      console.log(err)
   }

}