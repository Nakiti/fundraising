"use client"
import { createContext, useState, useEffect } from "react"

export const DonationContext = createContext()

export const DonationContextProvider = ({children}) => {
   const [donations, setDonations] = useState(null)

   useEffect(() => {
      sessionStorage.setItem("donations", JSON.stringify(donations))
   }, [donations])

   return (
      <DonationContext.Provider value={{donations, setDonations}}>
         {children}
      </DonationContext.Provider>
   )
}

// for potential cart functionality