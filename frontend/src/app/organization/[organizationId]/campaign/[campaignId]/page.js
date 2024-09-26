"use client"
import { getCampaignDetails, getCampaignPreview } from "@/app/services/fetchService"
import { useState, useEffect } from "react"
import { CgProfile } from "react-icons/cg"
import { useRouter } from "next/navigation"
import Link from "next/link"

const CampaignPage = ({params}) => {
   const campaignId = params.campaignId
   const [campaign, setCampaign] = useState(null)
   const [display, setDisplay] = useState(null)
   const router = useRouter()
   const currentPath = router.asPath

   useEffect(() => {
      const fetchData = async() => {
         const campaignResponse = await getCampaignDetails(campaignId)
         setCampaign(campaignResponse)

         const displayResponse = await getCampaignPreview(campaignId)
         setDisplay(displayResponse)
      }

      fetchData()
   }, [])

   const handleDonate = () => {
      router.push("")
   }

   const handleShare = () => {

   }

   return (
      <div className="w-full h-full mx-auto bg-white rounded-lg shadow-md overflow-y-auto">

         {campaign && <div className="grid grid-cols-11 gap-4 mx-8 mt-4">
            <div className="flex flex-col px-6 py-4 col-start-1 col-end-8">
 
               <h1 className="text-3xl p-2 rounded-md mb-4 font-semibold ">
                  {campaign.title}
               </h1>


               <img
                  src={campaign.image}
                  alt="image"
                  className="w-full h-64 object-cover rounded-md bg-gray-50"
               />
               
               <div className="flex flex-row items-center px-4 py-2 border-b text-sm">
                  <CgProfile className="h-6 w-6"/>
                  <p className="text-gray-600 font-medium ml-4">Created by John Doe</p>
               </div>
               <div className="p-4 border-b">
                  <p 
                     className="text-gray-500 text-sm w-full h-full p-2 rounded-md"
                     name="description"
                  >
                  
                  </p>
               </div>
               <p className="text-gray-400 text-sm px-4 py-2">Created on {new Date(campaign.created_at).toLocaleDateString()}</p>
            </div>

            {/* Progress and Actions */}
            <div className="bg-gray-50 p-6 rounded-md shadow-md col-start-8 col-end-12 mt-6 mb-8">
               <p className="text-lg font-medium mb-2">{campaign.raised} of {campaign.goal} raised</p>

               {/* Progress Bar */}
               <div className="w-full bg-gray-300 rounded-full h-2 mb-4">
                  <div className="bg-blue-600 h-2 rounded-full w-1/12"></div>
               </div>

               <p className="text-sm text-gray-600 mb-4">{campaign.donations} donations</p>

               <div className="flex flex-col justify-center items-center">
                  <Link 
                     href={`${currentPath}/donate`}
                     className="w-3/4 px-4 py-3 mt-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700">
                     Donate
                  </Link>
                  <button className="w-3/4 px-4 py-3 mt-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                     Share
                  </button>
               </div>
            </div>
         </div>}
      </div>
   );
}



export default CampaignPage