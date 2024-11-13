"use client";

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/fetchService";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
   const [currentUser, setCurrentUser] = useState(null);
 
   const login = async (inputs) => {
      try {
         const response = await axios.post("http://localhost:4000/api/user/login", inputs, {withCredentials: true});
         setCurrentUser(response.data);
      } catch (err) {
         console.log(err)
      }
   };

   const logout = async () => {
      try {
         await axios.post("http://localhost:4000/api/user/logout", {}, {withCredentials: true});
         setCurrentUser(null)
      } catch (e) {
         console.log(e)
      }
      setCurrentUser(null);
   };

   useEffect(() => {
      
      const fetchData = async () => {
         const response = await getCurrentUser()
         setCurrentUser(response)
         console.log(response)
      }
      
      fetchData()
   }, []);

   return (
      <AuthContext.Provider value={{currentUser, login, logout}}>
         {children}
      </AuthContext.Provider>
   );
}
