"use client"
import { getCampaignDetails } from "@/app/services/fetchService"

import { useState, useEffect } from "react"
import Link from "next/link"

const CampaignPage = ({params}) => {
   const campaignId = params.campaignId

   const [campaign, setCampaign] = useState(null)

   useEffect(() => {
      const fetchData = async() => {
         const campaignResponse = await getCampaignDetails(campaignId)
         setCampaign(campaignResponse)
      }


      fetchData()
   }, [])

   return (
      <div className="w-full p-8">
         <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex flex-row w-full justify-between items-center mb-8">
               <p className="text-2xl  text-gray-800">Campaign Details:</p>
               <Link href="" className="bg-sky-800 text-white py-3 px-6 rounded-md text-sm font-semibold">Open Campaign Page</Link>
            </div>

            {campaign && <div className="grid grid-cols-2 w-full gap-8">
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
                  <p className="text-md text-gray-800">0</p>
               </div>
               <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-500 mb-2">Last Updated By</label>
                  <p className="text-md text-gray-800">Value</p>
               </div>
               <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-500 mb-2">Created At</label>
                  <p className="text-md text-gray-800">Value</p>
               </div>
               <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-500 mb-2">Created By</label>
                  <p className="text-md text-gray-800">Value</p>
               </div>
            </div>}
         </div>
      </div>
   )
}

export default CampaignPage