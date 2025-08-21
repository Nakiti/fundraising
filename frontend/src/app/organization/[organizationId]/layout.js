"use client"
import Header from "./components/header"
import Footer from "./components/footer"
import { DonationContextProvider } from "@/app/context/organizationPages/donationContext"
import { LandingPageContextProvider } from "@/app/context/organizationPages/landingPageContext"
import { AboutPageContextProvider } from "@/app/context/organizationPages/aboutPageContext"

const OrganizationLayout = ({children, params}) => {
   const organizationId = params.organizationId

   return (
      <DonationContextProvider>
         <LandingPageContextProvider organizationId={organizationId}>
            <AboutPageContextProvider organizationId={organizationId}>
               <div className="min-h-screen bg-gray-50">
                  <Header organizationId={organizationId}/>
                  <main className="pb-16" style={{ minHeight: "calc(100vh - 80px)" }}>
                     {children}
                  </main>
                  <Footer organizationId={organizationId}/>
               </div>
            </AboutPageContextProvider>
         </LandingPageContextProvider>
      </DonationContextProvider>
   )
}

export default OrganizationLayout