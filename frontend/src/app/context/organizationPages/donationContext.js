"use client"
import { createContext, useState, useEffect } from "react";
import { DesignationService } from "@/app/services/fetchService";

export const DonationContext = createContext()

export const DonationContextProvider = ({organizationId, children}) => {
   const [designations, setDesignations] = useState([])

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await DesignationService.getActiveDesignations(organizationId)
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