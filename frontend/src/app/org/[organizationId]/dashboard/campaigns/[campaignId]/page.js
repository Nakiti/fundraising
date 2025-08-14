"use client"
import { getCampaign, getCampaignDetails } from "@/app/services/fetchService"
import { useState, useEffect, useContext } from "react"
import Link from "next/link"
import { AuthContext } from "@/app/context/authContext"
import { deactivateCampaign } from "@/app/services/updateServices"
import { FaExternalLinkAlt } from "react-icons/fa"

/*
   Component: Campaign Page
   Description: Renders campaign page
*/
const CampaignPage = ({params}) => {
   const campaignId = params.campaignId
   const [campaign, setCampaign] = useState(null)
   const [campaignType, setCampaignType] = useState(null)
   const {currentUser} = useContext(AuthContext)
   const organizationId = params.organizationId

   /*
      Description: deactivate campaign
   */
   const handleDeactivate = async () => {
      try {
         await deactivateCampaign(campaignId, currentUser.id)
         fetchData()
      } catch (err) {
         console.log(err)
      }
   }

   useEffect(() => {
      fetchData()
   }, [])

   /*
      Description: get campaign
   */
   const fetchData = async() => {
      const campaignResponse = await getCampaign(campaignId)
      setCampaign(campaignResponse)
      setCampaignType(campaignResponse.type)
   }

   return (
      <div className="w-full p-6 space-y-6">
         <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Campaign Details Section */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">Campaign Details</h2>
               </div>
               {campaign && (
                  <div className="p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-500">Campaign ID</label>
                           <p className="text-lg font-semibold text-gray-900">#{campaignId}</p>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-500">Status</label>
                           <span 
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                 campaign.status === "inactive" 
                                    ? "bg-red-100 text-red-800" 
                                    : "bg-green-100 text-green-800"
                              }`}
                           >
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1).toLowerCase()}
                           </span>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-500">Last Updated</label>
                           <p className="text-lg text-gray-900">
                              {new Date(campaign.updated_at).toLocaleDateString("en-US", {
                                 year: 'numeric',
                                 month: 'long',
                                 day: 'numeric'
                              })}
                           </p>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-500">Updated By</label>
                           <p className="text-lg text-gray-900">
                              {campaign.updater_first_name} {campaign.updater_last_name}
                           </p>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-500">Created</label>
                           <p className="text-lg text-gray-900">
                              {new Date(campaign.created_at).toLocaleDateString("en-US", {
                                 year: 'numeric',
                                 month: 'long',
                                 day: 'numeric'
                              })}
                           </p>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-500">Created By</label>
                           <p className="text-lg text-gray-900">
                              {campaign.creator_first_name} {campaign.creator_last_name}
                           </p>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Quick Actions Section */}
            <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
               </div>
               <div className="p-6 space-y-4">
                  <Link 
                     href={
                        campaignType && campaignType == "crowdfunding" ?
                        `/organization/${organizationId}/campaign/${campaignId}/donation-page/`
                        : campaignType == "peer-to-peer" ?
                        `/organization/${organizationId}/campaign/${campaignId}/peer-landing/`
                        : campaignType == "donation" ?
                        `/organization/${organizationId}/campaign/${campaignId}/donation-form/`
                        : `/organization/${organizationId}/campaign/${campaignId}/ticket/`
                     }
                     className="flex items-center justify-between p-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                  >                     
                     <span>Open Campaign Page</span>
                     <FaExternalLinkAlt className="w-4 h-4" />
                  </Link>
                  <Link 
                     href={
                        campaignType && campaignType == "crowdfunding" ?
                        `/organization/${organizationId}/campaign/${campaignId}/donation-page/preview`
                        : campaignType == "peer-to-peer" ?
                        `/organization/${organizationId}/campaign/${campaignId}/peer-landing-page/preview`
                        : campaignType == "donation" ?
                        `/organization/${organizationId}/campaign/${campaignId}/donation-form/preview`
                        : `/organization/${organizationId}/campaign/${campaignId}/ticket/preview`
                     }
                     className="flex items-center justify-between p-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                  >
                     <span>Preview Campaign</span>
                     <FaExternalLinkAlt className="w-4 h-4" />
                  </Link>
                  {/* {campaign && campaign.status === "active" && (
                     <button 
                        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all duration-200"
                        onClick={handleDeactivate}
                     >
                        Deactivate Campaign
                     </button>
                  )} */}
               </div>
            </div>
         </div>
      </div>
   )
}

export default CampaignPage