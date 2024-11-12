"use client"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCampaignDetails } from "@/app/services/fetchService";



const CampaignPageLayout = ({children, params}) => {
   const campaignId = params.campaignId
   const pathname = usePathname()
   const [campaign, setCampaign] = useState(null)

   const links = [
      {title: "Overview", pathName: `/org/dashboard/campaigns/${campaignId}`},
      {title: "Insights", pathName: `/org/dashboard/campaigns/${campaignId}/insights`},
      {title: "Transactions", pathName: `/org/dashboard/campaigns/${campaignId}/transactions`}
   ]

   useEffect(() => {
      const fetchData = async() => {
         
         try {
            const response = await getCampaignDetails(campaignId)
            console.log(response)
            setCampaign(response)
         } catch (err) {
            console.log(err)
         }

      }

      fetchData()
   }, [])

   return (
      <div className="overflow-y-auto h-screen">
         <div className="bg-gray-700 w-full px-6 pt-6 text-white">
            <Link href="/org/dashboard/campaigns" className="flex flex-row px-2 py-2 items-center cursor-pointer">
               <FaArrowLeft />
               <p className="ml-2 text-sm font-semibold">Campaigns</p>
            </Link>
            <div className="flex flex-row px-6 py-2 w-full justify-between items-center">
               <h1 className="text-3xl">{campaign && campaign.campaign_name}</h1>

               <div className="w-1/5 flex flex-row justify-between">
                  <Link href={`/org/campaign/edit/${campaignId}/details/about`} className="bg-white text-gray-700 py-3 px-6 rounded-md text-md font-semibold">Edit Campaign</Link>
                  <button>
                     <SlOptionsVertical className="h-6 w-6"/>
                  </button>
               </div>
            </div>

            <div className="w-1/3 px-6 flex flex-row justify-between">
               {links.map((item, index) => {
                  return (
                     <Link 
                        key={index} 
                        href={item.pathName} 
                        className={`px-8 py-1 text-md border-b-4 ${
                           pathname == item.pathName ? "border-white" : "border-transparent"
                        }`}
                     >                           
                         
                        {item.title}
                     </Link>
                  )
               })}
            
            </div>
         </div>

         {children}
      </div>
   )
}

export default CampaignPageLayout