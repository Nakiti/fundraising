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
      <div className="w-full p-8">
         <div className="flex flex-row space-x-4 w-full">
            <div className="w-3/4 bg-white rounded-lg shadow-sm">
               <div className="flex flex-row w-full justify-between items-center px-4 py-4 border-b border-gray-300">
                  <p className="text-2xl text-gray-800 font-semibold">Campaign Details:</p>
               </div>
               {campaign && (
                  <div className="grid grid-cols-2 w-full gap-8 px-4 pt-4 pb-6">
                     <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-500 mb-2">Campaign ID</label>
                        <p className="text-md text-gray-800">{campaignId}</p>
                     </div>
                     <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-500 mb-2">Status</label>
                        <p 
                           className={`px-3 py-1 rounded-sm text-white text-sm w-1/4 text-center 
                           ${campaign.status === "inactive" ? "bg-red-700" : "bg-green-700"}`}
                        >
                           {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1).toLowerCase()}
                        </p>
                     </div>
                     <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-500 mb-2">Last Updated At</label>
                        <p className="text-md text-gray-800">{new Date(campaign.updated_at).toLocaleDateString("en-us")}</p>
                     </div>
                     <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-500 mb-2">Last Updated By</label>
                        <p className="text-md text-gray-800">{campaign.updater_first_name} {campaign.updater_last_name}</p>
                     </div>
                     <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-500 mb-2">Created At</label>
                        <p className="text-md text-gray-800">{new Date(campaign.created_at).toLocaleDateString("en-us")}</p>
                     </div>
                     <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-500 mb-2">Created By</label>
                        <p className="text-md text-gray-800">{campaign.creator_first_name} {campaign.creator_last_name}</p>
                     </div>
                  </div>
               )}
            </div>
            <div className="bg-white rounded-lg shadow-sm w-1/4 space-y-4">
               <div className="px-4 py-4 border-b border-gray-300">
                  <p className="text-2xl text-gray-800 font-semibold">Quick Actions:</p>
               </div>
               <div className="px-4 pb-6 py-4 flex flex-col space-y-6">
                  <Link href={
                     campaignType && campaignType == "crowdfunding" ?
                     `/organization/${organizationId}/campaign/${campaignId}/donation-page/`
                     : campaignType == "peer-to-peer" ?
                     `/organization/${organizationId}/campaign/${campaignId}/peer-landing/`
                     : campaignType == "donation" ?
                     `/organization/${organizationId}/campaign/${campaignId}/donation-form/`
                     : `/organization/${organizationId}/campaign/${campaignId}/ticket/`
                  }>                     
                     <p className="flex items-center text-blue-800 hover:underline font-semibold text-md">
                        Open Campaign Page
                        <FaExternalLinkAlt className="ml-2 text-blue-800" />
                     </p>
                  </Link>
                  <Link href={
                     campaignType && campaignType == "crowdfunding" ?
                     `/organization/${organizationId}/campaign/${campaignId}/donation-page/preview`
                     : campaignType == "peer-to-peer" ?
                     `/organization/${organizationId}/campaign/${campaignId}/peer-landing-page/preview`
                     : campaignType == "donation" ?
                     `/organization/${organizationId}/campaign/${campaignId}/donation-form/preview`
                     : `/organization/${organizationId}/campaign/${campaignId}/ticket/preview`
                  }>
                     <p className="flex items-center text-blue-800 hover:underline font-semibold text-md">
                        Preview Campaign
                        <FaExternalLinkAlt className="ml-2 text-blue-800" />
                     </p>
                  </Link>
                  {/* {campaign && campaign.status === "active" && (
                     <button 
                        className="bg-red-800 text-white py-3 px-4 rounded-sm text-sm font-semibold w-full hover:bg-red-700 transition duration-300"
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