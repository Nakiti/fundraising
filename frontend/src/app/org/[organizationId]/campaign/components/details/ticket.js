import { IoClose } from "react-icons/io5"
import { useState } from "react"
import TicketComponent from "./ticketComponent"
import useFormInput from "@/app/hooks/useFormInput"

const Ticket = () => {

   const [tickets, handleTicketsChange, setTickets] = useFormInput([
      {id: new Date(), title: "", quantity: 0, value: 0, descritpion: "", attendees: 0, maxPurchase: 0, dateStart: null, dateEnd: null}
   ])

   const handleAdd = () => {
      setTickets(prev => [
         ...prev, 
         {id: new Date(), title: "", quantity: 0, value: 0, descritpion: "", attendees: 0, maxPurchase: 0, dateStart: null, dateEnd: null}
      ])
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
               <TicketComponent ticket={item} tickets={tickets} setTickets={setTickets} handleTicketsChange={handleTicketsChange}/>
            ))}
            
            <button 
               className="w-full p-12 mt-8 bg-gray-200 border-2 border-gray-300 border-dashed flex justify-center items-center"
               onClick={handleAdd}
            >
               <p>Add a Ticket</p>
            </button>

         </div>
      </div>
   )
}

export default Ticket


