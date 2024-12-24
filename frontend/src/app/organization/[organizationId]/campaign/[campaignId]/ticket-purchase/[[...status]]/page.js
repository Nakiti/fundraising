"use client"
import { getCampaignDetails, getCampaignTickets, getTicketPurchasePage } from "@/app/services/fetchService"
import { useState, useEffect } from "react"
import Ticket from "./ticketComponent"
import Footer from "@/app/organization/[organizationId]/components/footer"

const TicketPurchasePage = ({params}) => {
   const [pageInputs, setPageInputs] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)
   const [tickets, setTickets] = useState(null)
   const campaignId = params.campaignId
   const status = params.status

   useEffect(() => {
      const fetchData = async() => {
         try {
            const campaignResponse = await getCampaignDetails(campaignId)
            setCampaignDetails(campaignResponse)
            const campaignStatus = campaignResponse.status

            if (status == "preview" || campaignStatus == "active") {
               const response = await getTicketPurchasePage(campaignId)
               setPageInputs(response)

               const ticketResponse = await getCampaignTickets(campaignId)
               setTickets(ticketResponse)

               console.log("tickets", ticketResponse)
            }

            
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])


   return (
      <div className="w-full min-h-screen flex flex-col">
         <div className="flex flex-row flex-grow w-full">
            <div className="px-12 py-8 w-2/3 bg-gray-50">
               <div className="mb-10 mt-8">
               <h1 className="text-3xl font-semibold mb-2">{"Purchase Tickets"}</h1>
               <p className="text-md text-gray-700">
                  {"This is the instructions words words and more words are filling this up"}
               </p>
               </div>
               <div className="space-y-6">
                  
                  {tickets && tickets.map((item, index) => (
                     <div className="flex items-center space-x-4" key={index}>
                        <input
                           type="checkbox"
                           className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <Ticket ticket={item} />
                     </div>
                  ))}
               </div>
            </div>
            <div className="w-1/3 shadow-md bg-white flex flex-col justify-between py-4 px-4 border-l border-gray-300">
               <div className="flex flex-col justify-between h-96">
               <h1 className="text-xl font-semibold text-center border-b border-gray-300 py-6">Your Purchase</h1>
               <button className="bg-blue-700 w-3/4 mx-auto px-6 py-2 rounded-sm text-white mt-24">Checkout</button>
               </div>
            </div>
         </div>
         <Footer />
      </div>
   )
}

export default TicketPurchasePage