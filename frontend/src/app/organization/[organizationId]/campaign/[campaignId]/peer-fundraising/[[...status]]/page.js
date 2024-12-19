"use client"
import { getCampaignDetails, getPeerFundraisingPage } from "@/app/services/fetchService"
import { useState, useEffect } from "react"

const PeerFundraisingPage = ({params}) => {
   const [pageInputs, setPageInputs] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)
   const campaignId = params.campaignId
   const status = params.status

   useEffect(() => {
      const fetchData = async() => {
         try {
            const campaignResponse = await getCampaignDetails(campaignId)
            setCampaignDetails(campaignResponse)
            const campaignStatus = campaignResponse.status

            if (status == "preview" || campaignStatus == "active") {
               const response = await getPeerFundraisingPage(campaignId)
               setPageInputs(response)

               console.log(response)
            }
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <div>
         {pageInputs && <div 
            className="w-full mb-4 mx-auto bg-white" 
            style={{ backgroundColor: pageInputs.bg_color }}
         >
            <div className="relative w-full">
               <img
                  src={pageInputs.banner_image || "image1.jpg"}
                  alt="image"
                  className="w-full h-96 object-cover bg-gray-50"
               />
            </div>

            <div className="w-3/4 mx-auto relative flex flex-row mb-8 border-t border-gray-200 pt-6" style={{ color: pageInputs.bg_color }}>
               <div className="w-1/3">
                  <img 
                     src={pageInputs.person_image || "image1.jpg"}
                     className="h-64 w-64 object-cover border-4 border-white shadow-lg -mt-16 rounded-md"
                     alt="image"
                  />
               </div>
               <div className="w-2/3 mt-4">
                  <div className="py-2">
                     <div className="flex flex-row justify-between mb-6">
                        <div>
                           <p className="text-gray-500 text-sm" style={{ color: pageInputs.p_color }}>Fundraiser</p>
                           <h1 className="text-3xl font-semibold text-gray-800" style={{ color: pageInputs.p_color }}>{pageInputs.headline || "Headline"}</h1>
                        </div>
                        <button className="text-sm text-blue-600 hover:underline">Share</button>
                     </div>

                     <div className="mb-6">
                        <p className="text-sm font-medium mb-1 text-gray-700" style={{ color: pageInputs.p_color }}>X of 1000 raised</p>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                           <div className="bg-blue-600 h-3 rounded-full w-1/12"></div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 py-8 mt-12 border-t border-gray-200">
                     <h2 className="text-2xl text-gray-800 font-semibold text-center mb-4">About</h2>
                     <pre className="text-md text-wrap text-gray-600 leading-relaxed">
                        {pageInputs.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"}
                     </pre>
                  </div>

                  <div className="flex justify-center items-center mt-6">
                     <button 
                        disabled
                        className="w-1/3 py-2 text-white rounded-sm bg-blue-700 shadow-md hover:bg-blue-800 transition-colors duration-200"
                        style={{ backgroundColor: pageInputs.p_color }}
                     >
                        Donate
                     </button>
                  </div>
               </div>
            </div>
            <div className="bg-gray-100 border-t border-gray-300 py-4 mt-12">
               <div className="text-center text-gray-600 text-xs">
                  <p>&copy; {new Date().getFullYear()} Your Organization. All rights reserved.</p>
                  <p className="mt-1">
                     <a href="#" className="hover:underline">Privacy Policy</a> | 
                     <a href="#" className="hover:underline ml-2">Terms of Service</a>
                  </p>
               </div>
            </div>
         </div>}
      </div>
   )
}

export default PeerFundraisingPage