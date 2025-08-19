"use client"
import Header from "./components/header"
import { DonationContextProvider } from "@/app/context/organizationPages/donationContext"
import { LandingPageContextProvider } from "@/app/context/organizationPages/landingPageContext"
import { AboutPageContextProvider } from "@/app/context/organizationPages/aboutPageContext"

const OrganizationLayout = ({children, params}) => {
   const organizationId = params.organizationId

   return (
      <DonationContextProvider>
         <LandingPageContextProvider organizationId={organizationId}>
            <AboutPageContextProvider organizationId={organizationId}>
               <Header organizationId={organizationId}/>
               <div className="min-h-screen">
                  {children} 
               </div>
            </AboutPageContextProvider>
         </LandingPageContextProvider>
      </DonationContextProvider>
   )
}

export default OrganizationLayout