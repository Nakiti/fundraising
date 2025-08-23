"use client"
import Header from "./components/header"
import Footer from "./components/footer"
import { DonationContextProvider } from "@/app/context/organizationPages/donationContext"
import { LandingPageContextProvider } from "@/app/context/organizationPages/landingPageContext"
import { AboutPageContextProvider } from "@/app/context/organizationPages/aboutPageContext"
import { usePathname } from "next/navigation"

const OrganizationLayout = ({children, params}) => {
   const organizationId = params.organizationId
   const pathname = usePathname()
   
   // Check if current page is a donor page
   const isDonorPage = pathname?.includes('/donor/')

   return (
      <DonationContextProvider>
         <LandingPageContextProvider organizationId={organizationId}>
            <AboutPageContextProvider organizationId={organizationId}>
               <div className={isDonorPage ? "h-screen bg-gray-50" : "min-h-screen bg-gray-50 flex flex-col"}>
                  {!isDonorPage && <Header organizationId={organizationId}/>}
                  <main className={isDonorPage ? "h-full" : "flex-1"}>
                     {children}
                  </main>
                  {!isDonorPage && <Footer organizationId={organizationId}/>}
               </div>
            </AboutPageContextProvider>
         </LandingPageContextProvider>
      </DonationContextProvider>
   )
}

export default OrganizationLayout