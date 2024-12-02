import { useState, useContext } from "react"
import TicketComponent from "./ticketComponent"
import { CampaignContext } from "@/app/context/campaignContext"
import { getCampaignTickets } from "@/app/services/fetchService"
import { createCampaignTicket } from "@/app/services/createServices"
import { deleteCampaignTicketsBatch } from "@/app/services/deleteService"
import useFormInput from "@/app/hooks/useFormInput"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Ticket = () => {
   const {tickets, setTickets, campaignId} = useContext(CampaignContext)
   const [newTicket, handleNewTicketChange, setNewTicket] = useFormInput(
      {id: new Date(), title: "", quantity: 0, value: 0, descritpion: "", attendees: 0, maxPurchase: 0, dateStart: null, dateEnd: null}
   )
   const [showDropdown, setShowDropdown] = useState(false)


   const handleAdd = () => {
      setTickets(prev => [
         ...prev, 
         newTicket
      ])

      setNewTicket(
         {id: new Date(), title: "", quantity: 0, value: 0, descritpion: "", attendees: 0, maxPurchase: 0, dateStart: null, dateEnd: null}
      )
   }

   const handleSave = async () => {
      try {
         const existingTickets = await getCampaignTickets(campaignId)
         const ticketsToAdd = tickets.filter(item => !existingTickets.includes(item))
         const ticketsToRemove = existingTickets.filter(item => !tickets.includes(item))

         console.log(ticketsToAdd)
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

         <div className="w-full mb-12">
            <h1 className="text-sm text-gray-700 mb-1">Add Custom Question</h1>
            <div className="border-b border-gray-600 mb-2"></div>
            
            <div className="bg-white p-6 border shadow-sm mb-4">
               <div className="flex flex-row space-x-4 w-full">
                  <div className="flex flex-col w-2/3">
                     <label className="text-gray-700 text-sm mb-2">
                        Ticket Title <span className="text-red-500">*</span>
                     </label>
                     <input
                        name="title"
                        type="text"
                        placeholder="Enter a Title"
                        className="p-2 border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newTicket.title}
                        onChange={handleNewTicketChange}
                     />
                  </div>
                  <div className="flex flex-col w-1/6">
                     <label className="text-gray-700 text-sm mb-2">
                        Quantity <span className="text-red-500">*</span>
                     </label>
                     <input
                        name="quantity"
                        type="number"
                        placeholder="0"
                        className="p-2 border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newTicket.quantity}
                        onChange={handleNewTicketChange}
                     />
                     <div className="flex flex-row items-center space-x-2 mt-2 px-2">
                        <input 
                           type="checkbox"
                           className="h-4 w-4"
                        />
                        <p className="text-sm text-gray-700">Unlimited</p>
                     </div>
                  </div>
                  <div className="flex flex-col w-1/6">
                     <label className="text-gray-700 text-sm mb-2">
                        Price <span className="text-red-500">*</span>
                     </label>
                     <input
                        name="value"
                        type="number"
                        placeholder="0"
                        className="p-2 border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newTicket.value}
                        onChange={handleNewTicketChange}
                     />
                     <div className="flex flex-row items-center space-x-2 mt-2 px-2">
                        <input 
                           type="checkbox"
                           className="h-4 w-4"
                        />
                        <p className="text-sm text-gray-700">Free</p>
                     </div>
                  </div>
               </div>

               <div className="border-t border-gray-200 text-gray-700 mt-12 flex flex-row justify-between px-4 pt-4">
                  <div className="flex flex-row items-center space-x-4" onClick={() => setShowDropdown(!showDropdown)}>
                     <p className="text-md">Edit Details</p>
                     {showDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </div>
                  <p className="text-md">Total: 0</p>
               </div>

               {showDropdown && <div className="bg-gray-150 p-4 space-x-4 flex flex-row">
                  <div className="w-3/4">
                     <div className="flex flex-col mb-4">
                        <label className="text-gray-700 text-sm mb-2">
                           Description
                        </label>
                        <textarea
                           name="description"
                           placeholder="Enter Description"
                           className="p-2 border text-sm border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                           value={newTicket.description}
                           onChange={handleNewTicketChange}
                           rows={6}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                           <label className="text-gray-700 text-sm mb-2">
                              Attendees Per Ticket
                           </label>
                           <input
                              name="attendees"
                              type="number"
                              placeholder="1"
                              className="p-2 text-sm border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newTicket.attendees}
                              onChange={handleNewTicketChange}
                           />
                        </div>
                        <div className="flex flex-col">
                           <label className="text-gray-700 text-sm mb-2">
                              Maximum Tickets Per Order
                           </label>
                           <input
                              name="maxPurchase"
                              type="number"
                              placeholder="1"
                              className="p-2 text-sm border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newTicket.maxPurchase}
                              onChange={handleNewTicketChange}
                           />
                        </div>
                        <div className="flex flex-col">
                           <label className="text-gray-700 text-sm mb-2">
                              Ticket Available From
                           </label>
                           <input
                              name="dateStart"
                              type="date"
                              className="p-2 text-sm border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newTicket.dateStart}
                              onChange={handleNewTicketChange}
                           />
                        </div>
                        <div className="flex flex-col">
                           <label className="text-gray-700 text-sm mb-2">
                              Ticket Available Until
                           </label>
                           <input
                              name="dateEnd"
                              type="date"
                              className="p-2 text-sm border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newTicket.dateEnd}
                              onChange={handleNewTicketChange}
                           />
                        </div>
                     </div>
                  </div>
                  <div className="w-1/4">
                     <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-2">
                           Fee Estiamte
                        </label>
                        <input
                           name="attendess"
                           type="text"
                           placeholder="$1.00"
                           className="p-2 text-sm border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                           value={newTicket.name}
                           onChange={handleNewTicketChange}
                           disabled
                        />
                     </div>
                  </div>
               </div>}
            </div>
            <button
               className="py-3 px-8 bg-blue-800 text-white rounded-md"
               onClick={handleAdd}
            >
               Add Ticket
            </button>
         </div>
         <h1 className="text-sm text-gray-700 mb-1">Manage Ticket(s)</h1>
         <div className="border-b border-gray-600 mb-2"></div>
         <div className="bg-gray-100 px-8 py-4">
            <div className="mb-4">
               <p>Tickets ({tickets.length})</p>
            </div>

            {tickets.map((item, index) => (
               <TicketComponent key={index} ticket={item} tickets={tickets} setTickets={setTickets}/>
            ))}
            
            {/* <button 
               className="w-full p-12 mt-8 bg-gray-200 border-2 border-gray-300 border-dashed flex justify-center items-center"
               onClick={handleAdd}
            >
               <p>Add a Ticket</p>
            </button> */}
         </div>
         <div className="w-full flex flex-row mt-6">
            <button 
               className="ml-auto bg-blue-600 px-6 py-3 w-40 rounded-md shadow-sm text-md text-white"
               onClick={handleSave}
            >
               Save
            </button>
         </div>
      </div>
   )
}

export default Ticket


