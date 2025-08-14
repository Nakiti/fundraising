"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"

const EditCampaign = ({params}) => {
   const campaignId = params.id
   const router = useRouter()
   const { fetchCampaignData, loading } = useContext(CampaignContext)

   useEffect(() => {
      if (campaignId) {
         fetchCampaignData(campaignId)
      }
   }, [campaignId, fetchCampaignData])

   useEffect(() => {
      // Redirect to details page after data is loaded
      if (!loading && campaignId) {
         router.replace(`/org/${params.organizationId}/campaign/edit/${campaignId}/details/about`)
      }
   }, [loading, campaignId, router, params.organizationId])

   if (loading) {
      return (
         <div className="w-full max-w-4xl mx-auto py-8 px-6">
            <div className="animate-pulse">
               <div className="h-8 bg-gray-200 rounded mb-4"></div>
               <div className="h-4 bg-gray-200 rounded mb-8"></div>
               <div className="space-y-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="w-full max-w-4xl mx-auto py-8 px-6">
         <div className="text-center">
            <h1 className="text-2xl font-light text-gray-900 mb-4">Loading Campaign...</h1>
            <p className="text-gray-600">Redirecting to campaign details...</p>
         </div>
      </div>
   )
}

export default EditCampaign