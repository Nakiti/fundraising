"use client"
import { getCampaignDesignations, getCampaignDetails, getDonationPage } from "@/app/services/fetchService"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { FaArrowLeft } from "react-icons/fa"

const DonationLandingPage = ({params}) => {
   const [display, setDisplay] = useState(null)
   const [designations, setDesignations] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)
   const router = useRouter()
   const parameters = useParams()

   const status = params.status
   const campaignId = params.campaignId

   useEffect(() => {
      const fetchData = async() => {
         const campaignResponse = await getCampaignDetails(campaignId)
         console.log(campaignResponse, parameters, campaignId)
         
         if (campaignResponse.status == "active" || status == "preview") {
            setCampaignDetails(campaignResponse)

            const displayResponse = await getDonationPage(campaignId)
            setDisplay(displayResponse)
            console.log("asdasd", displayResponse)

            const designationResponse = await getCampaignDesignations(campaignId)
            setDesignations(designationResponse)
            console.log(designationResponse)
      
         }
      }

      fetchData()
   }, [])

   return (
      <div 
         className="w-full mb-4 bg-white overflow-y-auto" 
         // style={{ backgroundColor: donationPageInputs.bg_color }}
      >
      <div className="p-3 bg-gray-700 text-white flex flex-row">
         <button className="ml-4 mr-2"><FaArrowLeft /></button>
         <p>Campaign is in Preview mode</p>
      </div>
      {display && <div>
         <div className="relative w-full">
            <img
               src={display.banner_image || "image1.jpg"}
               alt="image"
               className="w-full object-cover bg-gray-50"
               style={{height: "70vh"}}
            />
         </div>

         <div className="w-3/4 mx-auto relative flex flex-row mb-8 space-x-6 pt-2">
            <div className="w-full mt-8">
               <div className="flex flex-row justify-between mb-10 w-11/12">
                  <div>
                     <p className="text-gray-500 text-md">Fundraiser</p>
                     <h1 className="text-4xl font-semibold text-gray-800">{display.headline || "Headline"}</h1>
                  </div>
                  <button className="text-md text-blue-600 hover:underline">Share</button>
               </div>

               <div className="mb-12 flex flex-row w-full items-center space-x-8">
                  <div className="w-3/4">
                     <p className="text-xl mb-3 text-gray-700" >X raised</p>
                     <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                        <div className="bg-blue-600 h-3 rounded-full w-1/12"></div>
                     </div>
                  </div>
                  <div className="w-1/12">
                     <button className="px-10 py-2 text-lg bg-blue-700 text-white">Donate</button>
                  </div>
               </div>

               <div className="space-y-4 py-4 mt-8 border-t border-gray-200 pt-12">
                  <h2 className="text-3xl text-gray-700 text-center mb-6">About</h2>
                  <pre className="text-md text-gray-700 w-3/4 mx-auto text-wrap">
                     {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"}
                  </pre>
               </div>

            
               <div className="flex justify-center items-center mt-8 mx-auto">
                  <button 
                     className="w-1/4 py-3 text-white rounded-sm bg-blue-700 shadow-md hover:bg-blue-800 transition-colors duration-200"
                     // style={{ backgroundColor: donationPageInputs.b1_color }}
                  >
                     Donate
                  </button>
               </div>
            </div>
         </div>
      </div>}
   </div>
   )
}

export default DonationLandingPage