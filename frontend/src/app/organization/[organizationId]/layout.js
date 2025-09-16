"use client"
import Header from "./components/header"
import Footer from "./components/footer"
import InactiveMessage from "./components/InactiveMessage"
import { CartContextProvider } from "@/app/context/cartContext"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { getOrganizationService } from "@/app/services"

const OrganizationLayout = ({children, params}) => {
   const organizationId = params.organizationId
   const pathname = usePathname()
   const [organizationStatus, setOrganizationStatus] = useState(null)
   const [organizationData, setOrganizationData] = useState(null)
   const [loading, setLoading] = useState(true)
   
   // Check if current page is a donor page
   const isDonorPage = pathname?.includes('/donor/')

   useEffect(() => {
      const fetchOrganizationStatus = async () => {
         try {
            setLoading(true)
            
            // Get service instance
            const organizationService = getOrganizationService();
            
            // Fetch organization status
            const statusResponse = await organizationService.getOrganizationStatus(organizationId)
            console.log("statusResponse", statusResponse)
            setOrganizationStatus(statusResponse.data.currentStatus)
            
            // Also fetch basic organization data for name
            const orgResponse = await organizationService.getOrganization(organizationId)
            setOrganizationData(orgResponse.data)
            
         } catch (error) {
            console.error('Error fetching organization status:', error)
            // On error, assume inactive for safety
            setOrganizationStatus({ organization: { status: 'inactive' } })
         } finally {
            setLoading(false)
         }
      }

      if (organizationId) {
         fetchOrganizationStatus()
      }
   }, [organizationId])

   // Show loading state
   if (loading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Loading organization...</p>
            </div>
         </div>
      )
   }

   // Show inactive message if organization is not active
   if (organizationStatus !== 'active') {
      return (
         <InactiveMessage organizationName={organizationData?.name} />
      )
   }

   return (
      <CartContextProvider organizationId={organizationId}>
         <div className={isDonorPage ? "h-screen bg-gray-50" : "min-h-screen bg-gray-50 flex flex-col"}>
            {!isDonorPage && <Header organizationId={organizationId}/>}
            <main className={isDonorPage ? "h-full" : "flex-1"}>
               {children}
            </main>
            {!isDonorPage && <Footer organizationId={organizationId}/>}
         </div>
      </CartContextProvider>
   )
}

export default OrganizationLayout