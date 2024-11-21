"use client"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCampaignDetails } from "@/app/services/fetchService";
import { MdOutlineCampaign } from "react-icons/md";



const CampaignPageLayout = ({children, params}) => {
   const campaignId = params.campaignId
   const organizationId = params.organizationId
   const pathname = usePathname()
   const [campaign, setCampaign] = useState(null)

   const links = [
      {title: "Overview", pathName: `/org/${organizationId}/dashboard/campaigns/${campaignId}`},
      {title: "Insights", pathName: `/org/${organizationId}/dashboard/campaigns/${campaignId}/insights`},
      {title: "Transactions", pathName: `/org/${organizationId}/dashboard/campaigns/${campaignId}/transactions`},
      {title: "Share", pathName: `/org/${organizationId}/dashboard/campaigns/${campaignId}/share`}
   ]

   useEffect(() => {
      const fetchData = async() => {
         
         try {
            const response = await getCampaignDetails(campaignId)
            // console.log(response)
            setCampaign(response)
         } catch (err) {
            console.log(err)
         }

      }

      fetchData()
   }, [])

   return (
      <div className="overflow-y-auto h-screen">
         <div className="bg-gray-800 w-full px-4 pt-2 text-white">
            <Link href={`/org/${organizationId}/dashboard/campaigns`} className="flex flex-row px-4 py-2 items-center cursor-pointer hover:text-gray-200">
               <FaArrowLeft className="text-sm" />
               <p className="ml-2 text-sm font-semibold">Campaigns</p>
            </Link>

            <div className="flex flex-row px-6 py-4 w-full justify-between">
               <div className="flex flex-row items-center">
                  <MdOutlineCampaign className="h-12 w-12 p-1 border-2 border-white rounded-sm mr-4"/>
                  <div className="flex flex-col text-gray-100">
                     <h1 className="text-2xl font-semibold">{campaign && campaign.external_name}</h1>
                     <p className="text-sm mt-1 text-gray-400">{campaign && campaign.type}</p>
                  </div>
               </div>

               <div className="w-1/5 flex flex-row justify-between h-1/2">
                  <Link 
                     href={`/org/${organizationId}/campaign/edit/${campaignId}/details/about`} 
                     className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-md text-md font-semibold transition duration-200"
                  >
                     Edit Campaign
                  </Link>
                  <button className="text-gray-200 hover:text-gray-100">
                     <SlOptionsVertical className="h-6 w-6" />
                  </button>
               </div>
            </div>

            <div className="w-1/3 px-6 space-x-4 flex flex-row justify-between">
               {links.map((item, index) => (
                  <Link 
                     key={index} 
                     href={item.pathName} 
                     className={`px-8 py-2 text-md font-medium border-b-4 ${
                        pathname === item.pathName ? "border-blue-600 text-white" : "border-transparent text-gray-400"
                     } hover:border-blue-600 hover:text-white transition-all duration-200`}
                  >
                     {item.title}
                  </Link>
               ))}
            </div>
         </div>


         {children}
      </div>
   )
}

export default CampaignPageLayout