"use client"
import Header from "./components/header"
import { DonationContextProvider } from "@/app/context/donationContext"


const OrganizationLayout = ({children, params}) => {
   const organizationId = params.organizationId

   return (
      <DonationContextProvider>
         {/* <Header organizationId={organizationId}/> */}
         <div style={{height: "100vh"}}>
            {children}
         </div>
      </DonationContextProvider>
   )
}

export default OrganizationLayout