"use client";
import { getDesignationService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";

export const DonationContext = createContext()

export const DonationContextProvider = ({organizationId, children}) => {
   const [designations, setDesignations] = useState([])

   useEffect(() => {
      const fetchData = async() => { 
         try {
            const designationService = getDesignationService();
            const response = await designationService.getActiveDesignations(organizationId)
            setDesignations(response)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <DonationContext.Provider value={{designations, setDesignations}}>
         {children}
      </DonationContext.Provider>
   )
}

// for potential cart functionality