"use client"
import { getCampaignDetails, getPeerLandingPage } from "@/app/services/fetchService"
import { useState, useEffect } from "react"

const PeerLandingPage = ({params}) => {
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
               const response = await getPeerLandingPage(campaignId)
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
      <div className="w-full mb-4 mx-auto bg-white">
         {pageInputs && <div>
            <div className="relative w-full mb-8">
               <img
                  src={pageInputs.banner_image || "image1.jpg"}
                  alt="Banner"
                  className="w-full h-96 object-cover bg-gray-100 border-b border-gray-300"
               />

               <div 
                  className="absolute inset-0 flex flex-col items-center justify-center text-center  p-4"
               >
                  <h2 className="text-5xl font-semibold text-black mb-8" style={{color: pageInputs.p_color}}>
                     {pageInputs.headline || "Headline"}
                  </h2>
                  <div className="flex gap-4">
                     <button 
                        className="bg-blue-800 text-white px-8 py-3 text-sm rounded-sm hover:bg-blue-700 transition"
                     >
                        Fundraise
                     </button>
                     <button 
                        className="bg-green-800 text-white px-8 py-3 text-sm rounded-sm hover:bg-green-700 transition"
                     >
                        Donate
                     </button>
                  </div>
               </div>
            </div>

            <div className="p-6 text-gray-700 w-2/3 mx-auto ">
               <h3 className="text-3xl font-semibold mb-6 text-center">
                  {pageInputs.tagline || "About the Cause"}
               </h3>
               <pre className="text-center text-md text-wrap">
                  {pageInputs.description || 
                  "Your generous donations help us make a difference. Join us in supporting this important cause."}
               </pre>
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

export default PeerLandingPage