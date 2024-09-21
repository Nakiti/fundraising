"use client"
import { Bar } from "react-chartjs-2"
import { useState, useEffect } from "react"
import { getCampaignDetails } from "@/app/services/fetchService"


const View = ({params}) => {
   const campaignId = params.id
   const [campaign, setCampaign] = useState(null)

   useEffect(() => {
      const fetchData = async() => {
         const response = await getCampaignDetails(campaignId)
         setCampaign(response)
      }

      fetchData()
   }, [])

   return (
      <div className="w-full bg-gray-50 ">
         <div className="mt-4 mx-6 grid grid-cols-12 grid-rows-12 gap-4">
            <div className="bg-white rounded-md shadow-md col-start-1 col-end-6 p-6 row-start-1 row-end-2">
               <h1 className="text-2xl font-semibold">Campaign Title</h1>
               <p className="mt-2 text-sm">Created At:</p>
            </div>

            <div className="bg-white rounded-md shadow-md col-start-6 p-6 col-end-11 row-start-1 row-end-3">
               <h1 className="text-2xl font-semibold mb-4">Raised:</h1>
               <p className="text-md mb-2 font-bold">X Raised out of X</p>
               <div className="w-full bg-gray-300 rounded-full h-2 mb-8">
                  <div className="bg-green-600 h-2 rounded-full w-1/12"></div>
               </div>
               <div className="flex flex-row w-full justify-between items-center px-4">
                  <div className="flex flex-col items-center justify-center">
                     <p className="text-md font-semibold">Gross Raised:</p>
                     <p className="text-xl text-blue-700">$123,456</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <p className="text-md font-semibold">After Fees:</p>
                     <p className="text-xl text-blue-700">$1,123,456</p>
                  </div>               
               </div>
            </div>

            <div className="bg-white rounded-md shadow-md p-6 col-start-1 col-end-4 row-start-2 row-end-4">
               <h1 className="text-2xl font-semibold mb-4">Metrics</h1>

               <div>
                  <div className="flex flex-row items-center mb-2">
                     <p className="text-sm font-bold">Total Donations:</p>
                     <p className="text-lg ml-2">34</p>
                  </div>
                  <div className="flex flex-row items-center mb-2">
                     <p className="text-sm font-bold">Total Visits:</p>
                     <p className="text-lg ml-2">34</p>
                  </div>
                  <div className="flex flex-row items-center mb-2">
                     <p className="text-sm font-bold">Conversion Rate:</p>
                     <p className="text-lg ml-2">34</p>
                  </div>
                  <div className="flex flex-row items-center mb-2">
                     <p className="text-sm font-bold">Average Donation:</p>
                     <p className="text-lg ml-2">34</p>
                  </div>
               </div>
            </div>

         </div>
         
      </div>
   )
}

export default View