"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getCampaignService } from "@/app/services"

const Insights = () => {
   const params = useParams()
   const campaignId = params.campaignId
   const [insights, setInsights] = useState(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   useEffect(() => {
      const fetchInsights = async () => {
         try {
            setLoading(true)
            const campaignService = getCampaignService();
            const response = await campaignService.getCampaignInsights(campaignId)
            setInsights(response)
         } catch (err) {
            console.error('Error fetching campaign insights:', err)
            setError(err.message)
         } finally {
            setLoading(false)
         }
      }

      if (campaignId) {
         fetchInsights()
      }
   }, [campaignId])

   if (loading) {
      return (
         <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
               <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                     <h2 className="text-xl font-semibold text-gray-900">Fundraising Progress</h2>
                  </div>
                  <div className="p-6">
                     <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="h-12 bg-gray-200 rounded mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                     </div>
                  </div>
               </div>
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                     <h2 className="text-xl font-semibold text-gray-900">Performance</h2>
                  </div>
                  <div className="p-6 space-y-6">
                     {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                           <div className="h-4 bg-gray-200 rounded w-24"></div>
                           <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )
   }

   if (error) {
      return (
         <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
               <p className="text-red-800">Error loading campaign insights: {error}</p>
            </div>
         </div>
      )
   }

   if (!insights) {
      return (
         <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
               <p className="text-yellow-800">No insights data available</p>
            </div>
         </div>
      )
   }

   return (
      <div className="p-6 space-y-6">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Raised Section */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">Fundraising Progress</h2>
               </div>
               <div className="p-6">
                  <div className="mb-6">
                     <p className="text-sm text-gray-600 mb-2">Total Amount Raised</p>
                     <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-3xl font-bold text-gray-900">${insights.total_raised?.toLocaleString() || 0}</p>
                        <p className="text-lg text-gray-500">of ${insights.goal?.toLocaleString() || 0} goal</p>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div 
                           className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                           style={{ width: `${Math.min(insights.percentage_funded || 0, 100)}%` }}
                        ></div>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Gross Raised</p>
                        <p className="text-2xl font-bold text-gray-900">${insights.gross_amount?.toLocaleString() || 0}</p>
                     </div>
                     <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">After Fees</p>
                        <p className="text-2xl font-bold text-gray-900">${insights.net_amount?.toLocaleString() || 0}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Performance Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">Performance</h2>
               </div>
               <div className="p-6 space-y-6">
                  <div className="space-y-2">
                     <p className="text-sm font-medium text-gray-600">Total Donations</p>
                     <p className="text-2xl font-bold text-gray-900">{insights.donations?.toLocaleString() || 0}</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-sm font-medium text-gray-600">Total Visits</p>
                     <p className="text-2xl font-bold text-gray-900">{insights.visits?.toLocaleString() || 0}</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                     <p className="text-2xl font-bold text-gray-900">{insights.conversion_rate?.toFixed(1) || 0}%</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-sm font-medium text-gray-600">Average Donation</p>
                     <p className="text-2xl font-bold text-gray-900">${insights.average_donation?.toFixed(2) || 0}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Insights