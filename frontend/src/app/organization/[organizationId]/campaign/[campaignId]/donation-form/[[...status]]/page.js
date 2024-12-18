"use client"
import { getCampaignDesignations, getCampaignDetails, getDonationForm } from "@/app/services/fetchService"
import { useState, useEffect } from "react"

const DonationForm = ({params}) => {
   const [display, setDisplay] = useState(null)
   const [designations, setDesignations] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)

   const status = params.status
   const campaignId = params.campaignId

   useEffect(() => {

      const fetchData = async() => {
         const campaignResponse = await getCampaignDetails(campaignId)
         
         if (campaignResponse.status == "active" || status == "preview") {
            setCampaignDetails(campaignResponse)

            const displayResponse = await getDonationForm(campaignId)
            setDisplay(displayResponse)

            const designationResponse = await getCampaignDesignations(campaignId)
            setDesignations(designationResponse)

            console.log(designationResponse)
         }
      }

      fetchData()
   }, [])

   return (
      <div 
         className="w-full mb-4 mx-auto bg-gray-700 rounded-sm shadow-md overflow-y-auto" 
      >
         {display && <div className="px-6 py-4">
            <div className="bg-white p-6 rounded-sm w-2/3 mx-auto">
               <div className="text-gray-700">
                  <h1 className="text-xl font-semibold mb-4">{display.headline || "This is the Heading Woo Hoo"}</h1>

                  <p className="text-xs">{display.description || "This is the description"}</p>
               </div>

               <div className="w-full border-gray-200 border my-6" />

               <div>
                  <h1 className="text-lg font-semibold mb-4">Giving Information</h1>
                  <div className="mt-2">
                     <h3 className="text-xs text-gray-700 font-semibold mb-2">I would like to give:</h3>
                     <div className="grid grid-cols-6 gap-2 w-full">
                           <button className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded-md">$100</button>
                           <button className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded-md">$100</button>
                           <button className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded-md">$100</button>
                           <button className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded-md">$100</button>
                           <button className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded-md">$100</button>

                        </div>
                     </div>
                  <div className="mt-4">
                     <h3 className="text-xs text-gray-700 font-semibold mb-1">I would like to give to:</h3>
                     <select 
                        className="w-3/4 border border-gray-300 rounded-sm p-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        defaultValue="Select"
                     >
                        {designations && designations.map(item => {
                           return <option key={item.id} value={item.id}>{item.title}</option>
                        })}
                     </select>
                  </div>

               </div>

               <div className="w-full border-gray-200 border my-6" />

               <div>
                  <h1 className="text-lg font-semibold mb-4">Your Information</h1>
                  
                  <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="First Name" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="Last Name" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-4" placeholder="Email Address" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-4" placeholder="Street Address" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="Zip Code" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="City" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="Phone Number" ></input>

                  </div>
               </div>

               <div className="w-full border-gray-200 border my-6" />

               <div className="text-center flex flex-col mb-6">
                  <p className="text-lg"> $100</p>
                  <p className="text-sm">Humanitarian Fund</p>
               </div>

               <div className="flex flex-col w-1/3 mx-auto space-y-2">
                  <button className="px-4 py-2 text-xs bg-yellow-400">Pay Pal</button>
                  <button className="px-4 py-2 text-xs bg-blue-700 text-white">Credit Card</button>
               </div>
            </div>
         </div>}
      </div>
   )
}

export default DonationForm

