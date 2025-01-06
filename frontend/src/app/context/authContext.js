"use client";
import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/fetchService";
import { loginUser, logoutUser } from "../services/authService";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
   const [currentUser, setCurrentUser] = useState(null);
 
   const login = async (inputs) => {
      const response = await loginUser(inputs)
      setCurrentUser(response)
   };

   const logout = async () => {
      await logoutUser()
      setCurrentUser(null)
   };

   useEffect(() => {
      // always checks that user is logged in
      const fetchData = async () => {
         const response = await getCurrentUser()
         console.log("response", window.location.href, response)
         setCurrentUser(response)
      }
      
      fetchData()
   }, []);

   return (
      <AuthContext.Provider value={{currentUser, login, logout}}>
         {children}
      </AuthContext.Provider>
   );
}
