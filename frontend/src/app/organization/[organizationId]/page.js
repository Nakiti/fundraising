"use client"

import { getAllCampaigns, getOrganization } from "@/app/services/fetchService"
import { useEffect, useState, } from "react"
import Card from "./card"

const Organization = ({params}) => {
   const organizationId = params.organizationId
   const [organization, setOrganization] = useState(null)
   const [campaigns, setCampaigns] = useState(null)
   

   useEffect(() => {
      const fetchData = async() => {
         const organizationResponse = await getOrganization(organizationId)
         setOrganization(organizationResponse)

         const campaignResponse = await getAllCampaigns(organizationId)
         setCampaigns(campaignResponse)
      }

      fetchData()
   }), []

   return (
      <div class="p-12 bg-white min-h-screen shadow-md rounded-md">
         <div class="flex flex-col md:flex-row items-start justify-between py-4">
            <div class="md:w-1/2 space-y-16">
               <h1 class="text-3xl font-bold">Organization Name</h1>
               <h2 class="text-xl text-gray-800">Organization Description</h2>
            </div>
            <div class="md:w-1/2 mt-4 md:mt-0">
               <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s" 
                  alt="Organization Image" 
                  class="w-full h-auto object-cover" 
                  style={{width: "600px", height: "300px"}}
               />
            </div>
         </div>

         <h1 className="font-semibold text-xl">Active Campaigns:</h1>
         <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8">
            {campaigns && campaigns.map(campaign => {
               <Card title={campaign.title} description={campaign.description} raised={campaign.raised} 
                  goal={campaign.goal} donations={campaign.donations} date={campaign.date}
               />
            })}

         </div>
      </div>
   )
}

export default Organization