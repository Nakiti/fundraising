"use client"
import { useState, useContext } from "react"
import TicketComponent from "../../../../components/ticketComponent"
import { CampaignContext } from "@/app/context/campaignContext"
import { getCampaignTickets } from "@/app/services/fetchService"
import { createCampaignTicket } from "@/app/services/createServices"
import { deleteCampaignTicketsBatch } from "@/app/services/deleteService"
import useFormInput from "@/app/hooks/useFormInput"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Tickets = () => {
   const {tickets, setTickets, campaignId, loading} = useContext(CampaignContext)
   const [newTicket, handleNewTicketChange, setNewTicket] = useFormInput({id: new Date(), title: "", quantity: 0, price: 0, unlimited: false, free: false, description: "", attendees: 0, max_purchase: 0, start_date: null, end_date: null})
   const [showDropdown, setShowDropdown] = useState(false)

   const handleAdd = () => {
      const empty = Object.values(newTicket).some(value => value == "" || value == null || value == 0)
      if (empty) {
         alert("Fill in all required ticket fields")
         return
      }

      setTickets(prev => [...prev, newTicket])
      setNewTicket({id: new Date(), title: "", quantity: 0, price: 0, unlimited: false, free: false, description: "", attendees: 0, max_purchase: 0, start_date: null, end_date: null})
   }

   const handleSave = async () => { //not sure this works right
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

   // Show loading state while data is being fetched
   if (loading) {
      return (
         <div className="w-full max-w-4xl mx-auto py-8 px-6">
            <div className="animate-pulse">
               <div className="h-8 bg-gray-200 rounded mb-4"></div>
               <div className="h-4 bg-gray-200 rounded mb-8"></div>
               <div className="space-y-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="w-full  max-w-4xl mx-auto py-8 px-6">
         <h1 className="text-4xl font-light text-gray-900 mb-4">Tickets</h1>
         <h3 className="text-md text-gray-600 mb-10">Manage Tickets</h3>
         <div className="border-b border-gray-300 my-4"/>

         <div>
            <h1 className="text-xl font-semibold pt-4">Ticket Settings</h1>
            <p className="text-sm text-gray-600 mb-8">Manage settings regarding the purchase of tickets</p>

            <div className="flex flex-row space-x-10 pb-4">
               <div>
                  <h2 className="text-md text-gray-800">Tickets Per Purchase</h2>
                  <p className="text-xs text-gray-600">
                     Specify the number of tickets you would like to purchase in a single transaction.
                  </p>
               </div>
               
               <input
                  id="tickets"
                  type="number"
                  min={1}
                  placeholder="Enter a number"
                  className="text-sm mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
               />
            </div>
         </div>
         <div className="border-b border-gray-300 my-4"/>
         <h1 className="text-xl font-semibold mb-2 pt-4">Ticket Configuration</h1>
         <p className="text-sm text-gray-600 mb-8">Create and Manage the avaiable tickets for your customers to purchase.</p>

         <div className="w-full mb-12">
            <h1 className="text-sm text-gray-700 mb-1">Add Ticket</h1>
            <div className="border-b border-gray-600 mb-2" />
            
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
                        min={1}
                     />
                     <div className="flex flex-row items-center space-x-2 mt-2 px-2">
                        <input 
                           type="checkbox"
                           className="h-4 w-4"
                           name="unlimited"
                           checked={newTicket.unlimited}
                           onChange={handleNewTicketChange}
                        />
                        <p className="text-sm text-gray-700">Unlimited</p>
                     </div>
                  </div>
                  <div className="flex flex-col w-1/6">
                     <label className="text-gray-700 text-sm mb-2">
                        Price <span className="text-red-500">*</span>
                     </label>
                     <input
                        name="price"
                        type="decimal"
                        placeholder="0"
                        className="p-2 border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newTicket.price}
                        onChange={handleNewTicketChange}
                        min={0}
                     />
                     <div className="flex flex-row items-center space-x-2 mt-2 px-2">
                        <input 
                           type="checkbox"
                           className="h-4 w-4"
                           name="free"
                           checked={newTicket.free}
                           onChange={handleNewTicketChange}
                        />
                        <p className="text-sm text-gray-700">Free</p>
                     </div>
                  </div>
               </div>

               <div className="border-t border-gray-200 text-gray-700 mt-8 flex flex-row justify-between px-4 pt-4">
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
                           Description <span className="text-red-500">*</span>
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
                              Attendees Per Ticket <span className="text-red-500">*</span>
                           </label>
                           <input
                              name="attendees"
                              type="number"
                              placeholder="1"
                              className="p-2 text-sm border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newTicket.attendees}
                              onChange={handleNewTicketChange}
                              min={1}
                           />
                        </div>
                        <div className="flex flex-col">
                           <label className="text-gray-700 text-sm mb-2">
                              Maximum Tickets Per Order <span className="text-red-500">*</span>
                           </label>
                           <input
                              name="max_purchase"
                              type="number"
                              placeholder="1"
                              className="p-2 text-sm border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newTicket.max_purchase}
                              onChange={handleNewTicketChange}
                              min={1}
                           />
                        </div>
                        <div className="flex flex-col">
                           <label className="text-gray-700 text-sm mb-2">
                              Ticket Available From <span className="text-red-500">*</span>
                           </label>
                           <input
                              name="start_date"
                              type="date"
                              className="p-2 text-sm border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newTicket.start_date}
                              onChange={handleNewTicketChange}
                           />
                        </div>
                        <div className="flex flex-col">
                           <label className="text-gray-700 text-sm mb-2">
                              Ticket Available Until <span className="text-red-500">*</span>
                           </label>
                           <input
                              name="end_date"
                              type="date"
                              className="p-2 text-sm border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newTicket.end_date}
                              onChange={handleNewTicketChange}
                           />
                        </div>
                     </div>
                  </div>
                  <div className="w-1/4">
                     <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-2">
                           Fee Estimate
                        </label>
                        <input
                           name="fee_estimate"
                           type="text"
                           placeholder="$1.00"
                           className="p-2 text-sm border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                           value="$1.00"
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
         <div className="border-b border-gray-600 mb-2" />
         <div className="bg-gray-100 px-8 py-4">
            <div className="mb-4">
               <p>Tickets ({tickets && tickets.length})</p>
            </div>
            {tickets && tickets.map((item, index) => (
               <TicketComponent key={index} ticket={item} tickets={tickets} setTickets={setTickets}/>
            ))}
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

export default Tickets