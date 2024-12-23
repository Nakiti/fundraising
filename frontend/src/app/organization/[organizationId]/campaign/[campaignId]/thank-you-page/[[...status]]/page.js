"use client"
import { useState, useEffect } from "react"
import { getCampaignDetails, getThankYouPage } from "@/app/services/fetchService"
import PreviewBar from "@/app/organization/[organizationId]/components/previewBar"

const ThankYouPage = ({params}) => {
   const [display, setDisplay] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)

   const status = params.status
   const campaignId = params.campaignId
   const organizationId = params.organizationId

   useEffect(() => {
      const fetchData = async() => {
         const campaignResponse = await getCampaignDetails(campaignId)
         
         if (campaignResponse.status == "active" || status == "preview") {
            setCampaignDetails(campaignResponse)

            const displayResponse = await getThankYouPage(campaignId)
            setDisplay(displayResponse)
            console.log("asdasd", displayResponse)
         }
      }

      fetchData()
   }, [])

   return (
      <div 
         className="min-h-screen bg-cover bg-center" 
         // style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80)' }}
      >
         {status == "preview" && <PreviewBar organizationId={organizationId} campaignId={campaignId}/>}

         {display && <div className="w-3/5 mx-auto py-8">
            <div className="bg-white shadow-md rounded-sm">
               <div className="pt-10 px-10 pb-2">
                  <h1 className="text-2xl text-gray-800">{display.headline || "Thank you"}</h1>
                  <p className="mt-4 text-sm text-gray-600">{display.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore"}</p>
                  <div className="flex flex-row text-sm mt-6 text-gray-600 space-x-4">
                     <p className="text-xs">Share</p>
                  </div>
               </div>

               <div className="bg-gray-100 p-10">
                  <h1 className="text-xl text-gray-800 border-b border-gray-400 py-2">Donation Information</h1>
                  <div className="mt-2 w-1/2">
                     <div className="flex flex-row justify-between text-sm text-gray-700 py-2">
                        <p>Amount</p>
                        <p>0</p>
                     </div>
                     <div className="flex flex-row justify-between text-sm text-gray-700 py-2">
                        <p>Amount</p>
                        <p>0</p>
                     </div>
                     <div className="flex flex-row justify-between text-sm text-gray-700 py-2">
                        <p>Amount</p>
                        <p>0</p>
                     </div>
                     <div className="flex flex-row justify-between text-sm text-gray-700 py-2">
                        <p>Amount</p>
                        <p>0</p>
                     </div>
                  </div>
               </div>

               <div className="px-10 py-10">
                  <h1 className="text-xl ">Questions/Comments?</h1>
                  <p className="text-sm text-gray-700 mt-4">Email us at ... </p>
               </div>
            </div>
         </div>}
         <div className="bg-gray-100 border-t border-gray-300 py-4 mt-12">
               <div className="text-center text-gray-600 text-xs">
                  <p>&copy; {new Date().getFullYear()} Your Organization. All rights reserved.</p>
                  <p className="mt-1">
                     <a href="#" className="hover:underline">Privacy Policy</a> | 
                     <a href="#" className="hover:underline ml-2">Terms of Service</a>
                  </p>
               </div>
            </div>
      </div>      
   )
}

export default ThankYouPage