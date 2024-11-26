import { useState, useContext } from "react"
import TicketComponent from "./ticketComponent"
import { CampaignContext } from "@/app/context/campaignContext"
import { getCampaignTickets } from "@/app/services/fetchService"
import { createCampaignTicket } from "@/app/services/createServices"
import { deleteCampaignTicketsBatch } from "@/app/services/deleteService"

const Ticket = () => {
   const {tickets, setTickets} = useContext(CampaignContext)

   const handleAdd = () => {
      setTickets(prev => [
         ...prev, 
         {id: new Date(), title: "", quantity: 0, value: 0, descritpion: "", attendees: 0, maxPurchase: 0, dateStart: null, dateEnd: null}
      ])
   }

   const handleSave = async () => {
      try {
         const existingTickets = await getCampaignTickets(campaignId)
         const ticketsToAdd = tickets.filter(item => !existingTickets.includes(item))
         const ticketsToRemove = existingTickets.filter(item => !tickets.includes(item))

         if (ticketsToAdd.length > 0) {
            await createCampaignTicket(campaignId, ticketsToAdd)
         }
         if (ticketsToRemove.length > 0) {
            await deleteCampaignTicketsBatch(ticketsToRemove)
         }
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full  max-w-4xl mx-auto py-8 px-6">
         <h1 className="text-4xl font-light text-gray-900 mb-4">Tickets</h1>
         <h3 className="text-md text-gray-600 mb-10">Manage Tickets</h3>

         <div className="bg-gray-100 px-8 py-4">
            <div className="mb-4">
               <p>Tickets ({tickets.length})</p>
            </div>

            {tickets.map((item) => (
               <TicketComponent ticket={item} tickets={tickets} setTickets={setTickets}/>
            ))}
            
            <button 
               className="w-full p-12 mt-8 bg-gray-200 border-2 border-gray-300 border-dashed flex justify-center items-center"
               onClick={handleAdd}
            >
               <p>Add a Ticket</p>
            </button>
         </div>
         <div className="w-full flex flex-row mt-6">
            <button className="ml-auto bg-blue-600 px-6 py-3 w-40 rounded-md shadow-sm text-md text-white">
               Save
            </button>
         </div>
      </div>
   )
}

export default Ticket


