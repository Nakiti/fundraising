"use client"
import { getCampaignDetails } from "@/app/services/fetchService"

import { useState, useEffect, useContext } from "react"
import Link from "next/link"
import { AuthContext } from "@/app/context/authContext"
import { updateCampaign } from "@/app/services/campaignService"
import { deactivateCampaign } from "@/app/services/updateServices"

const CampaignPage = ({params}) => {
   const campaignId = params.campaignId

   const [campaign, setCampaign] = useState(null)
   const {currentUser} = useContext(AuthContext)
   const organizationId = currentUser.organization_id

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

   const fetchData = async() => {
      const campaignResponse = await getCampaignDetails(campaignId)
      setCampaign(campaignResponse)
      console.log(campaignResponse)
   }

   return (
      <div className="w-full p-8">
         <div className="flex flex-row space-x-6 w-full">
            <div className="w-3/4 bg-white rounded-lg  shadow-md ">
               <div className="flex flex-row w-full justify-between items-center px-6 py-4 border-b border-gray-300">
                  <p className="text-2xl  text-gray-800">Campaign Details:</p>
               </div>

               {campaign && <div className="grid grid-cols-2 w-full gap-8 px-6 pt-2 pb-6">
                  <div className="flex flex-col">
                     <label className="text-sm font-bold text-gray-500 mb-2">Camapign ID</label>
                     <p className="text-md text-gray-800">{campaignId}</p>
                  </div>
                  <div className="flex flex-col">
                     <label className="text-sm font-bold text-gray-500 mb-2">Status</label>
                     <p 
                        className={`px-2 py-1 rounded-sm text-white text-sm w-1/4 text-center 
                        ${campaign.status == "inactive" ? " bg-red-700" : "bg-green-700"}`}
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
                     <p className="text-md text-gray-800">{campaign.first_name} {campaign.last_name}</p>
                  </div>
                  <div className="flex flex-col">
                     <label className="text-sm font-bold text-gray-500 mb-2">Created At</label>
                     <p className="text-md text-gray-800">{new Date(campaign.created_at).toLocaleDateString("en-us")}</p>
                  </div>
                  <div className="flex flex-col">
                     <label className="text-sm font-bold text-gray-500 mb-2">Created By</label>
                     <p className="text-md text-gray-800">{campaign.created_by}</p>
                  </div>
               </div>}
            </div>
            <div className="bg-white rounded-lg shadow-md w-1/4 space-y-4">
               <div className="px-6 py-4 border-b border-gray-300">
                  <p className="text-2xl text-gray-800 ">Quick Actions:</p>
               </div>

               <div className="px-6 pb-6 py-2 space-y-4">
                  <Link href={`/organization/${organizationId}/campaign/${campaignId}`} >
                     <p className="bg-blue-800 text-center text-white py-3 px-4 rounded-sm text-sm font-semibold w-full">Open Campaign Page</p>
                  </Link>
                  <Link href={``} >
                     <p className="bg-blue-800 text-center text-white py-3 px-4 rounded-sm text-sm font-semibold w-full mt-4">Preview Campaign</p>
                  </Link>
                  {campaign && campaign.status == "active" && <button 
                     className="bg-red-800 text-white py-3 px-4 rounded-sm text-sm font-semibold w-full"
                     onClick={handleDeactivate}
                  >
                     Deactivate Campaign
                  </button>}
               </div>
            </div>
         </div>
      </div>
   )
}

export default CampaignPage