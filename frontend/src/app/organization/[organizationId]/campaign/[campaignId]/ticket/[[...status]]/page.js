"use client"
import { getCampaignDetails, getTicketPage } from "@/app/services/fetchService"
import { useState, useEffect } from "react"
import Link from "next/link"

const TicketPage = ({params}) => {
   const [pageInputs, setPageInputs] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)
   const campaignId = params.campaignId
   const organizationId = params.organizationId
   const status = params.status

   useEffect(() => {
      const fetchData = async() => {
         try {
            const campaignResponse = await getCampaignDetails(campaignId)
            setCampaignDetails(campaignResponse)
            const campaignStatus = campaignResponse.status

            if (status == "preview" || campaignStatus == "active") {
               const response = await getTicketPage(campaignId)
               setPageInputs(response)
            }
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])


   return (
      <div className="w-full mb-4 bg-white overflow-y-auto" >
         {pageInputs && <div>
            <div class="relative w-full mb-12" style={{height: "75vh"}}>
               <img
                  src={pageInputs.bgImage}
                  alt="Nature"
                  class="w-full h-full object-cover"
               />
               <div 
                  class="absolute inset-0 flex flex-col justify-center items-start py-6 px-12 bg-black bg-opacity-50 text-white"
                  // style={{color: ticketsPageInputs.p_color}}
               >
                  <h1 class="mb-2" style={{fontSize: "60px"}}>{pageInputs.title || "Title"}</h1>
                  <h3 class="mb-2" style={{fontSize: "28px"}}>{pageInputs.date || "Date"}</h3>
                  <p class="mb-8" style={{fontSize: "28px"}}>{pageInputs.address || "Address"}</p>
                  <Link 
                     class="px-8 py-4 bg-blue-800 hover:bg-yellow-600 rounded-sm text-xl"
                     href={`/organization/${organizationId}/campaign/${campaignId}/ticket-purchase/${status ? status : ""}`}
                  >
                     Get Tickets
                  </Link>
               </div>
            </div>

            <div 
               className="mb-12 pt-6"
               // style={{backgroundColor: ticketsPageInputs.bg_color}}
            >
               <div className="">
                  <div className="space-y-6 w-2/3 mx-auto mb-16">
                     <h2 className="text-3xl font-semibold text-center">About the Event</h2>
                     <pre className="text-lg leading-relaxed text-wrap text-black">
                        {pageInputs.aboutDescription || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"}
                     </pre>
                  </div>

                  <div className="mt-16 border-t border-white">
                     <div className="flex flex-row w-1/2 mx-auto justify-between items-center">
                        <div className="">
                           <p className="text-3xl mb-6">{pageInputs.venue || "Venue Name"}</p>
                           <pre className="text-ml text-wrap">{pageInputs.instructions || "Instructions"}</pre>
                        </div>
                        <div>
                           <img 
                              className="w-56 h-48 border"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* <div 
               className="bg-white w-2/3 mx-auto pb-12"
               // style={{backgroundColor: ticketsPageInputs.bg_color2}}
            >
               <div className="">
                  <h2 className="text-4xl mb-4 text-gray-800 font-semibold text-center">Tickets</h2>
                  <p className="text-xl mb-4 text-gray-600 text-center">
                     Purchase Your Tickets
                  </p>
               </div>
               <div className="bg-gray-100 border p-4">
               </div>
            </div> */}
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

export default TicketPage