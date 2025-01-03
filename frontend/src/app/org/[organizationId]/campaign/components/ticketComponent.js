import { useState } from "react"
import { IoClose } from "react-icons/io5"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const TicketComponent = ({tickets, setTickets, handleTicketsChange, ticket}) => {
   const handleDelete = (id) => {
      setTickets(tickets.filter(item => item.id !== id))
   }

   const handleChange = (e) => {
      setTickets(tickets.map((item) => {
         if (item.id == ticket.id) {
            return {...item, [e.target.name]: e.target.value}
         }
         return item
      }))

      console.log(tickets)
   }

   const [showDropdown, setShowDropdown] = useState(false)

   return (
      <div className="bg-white p-6 shadow-md mb-8">
         <div className="w-full flex flex-row justify-end">
            <button onClick={() => handleDelete(ticket.id)}>
               <IoClose className="text-gray-700 w-4 h-4"/>
            </button>
         </div>
         <div className="flex flex-row space-x-4 w-full">
            <div className="flex flex-col w-2/3">
               <label className="text-gray-700 text-sm mb-2">
                  Ticket Name <span className="text-red-500">*</span>
               </label>
               <p
                  className="p-2 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                  {ticket.title}
               </p>
            </div>
            <div className="flex flex-col w-1/6">
               <label className="text-gray-700 text-sm mb-2">
                  Quantity <span className="text-red-500">*</span>
               </label>
               <p
                  className="p-2 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                  {ticket.quantity}
               </p>
               {ticket.unlimited && <div className="flex flex-row items-center space-x-2 mt-2 px-2">
                  <p className="text-sm text-gray-700">Unlimited</p>
               </div>}
            </div>
            <div className="flex flex-col w-1/6">
               <label className="text-gray-700 text-sm mb-2">
                  Price <span className="text-red-500">*</span>
               </label>
               <p
                  className="p-2 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                  {ticket.price}
               </p>
               {ticket.free && <div className="flex flex-row items-center space-x-2 mt-2 px-2">
                  <p className="text-sm text-gray-700">Free</p>
               </div>}
            </div>
         </div>

         <div className="border-t border-gray-200 text-gray-700 mt-6 flex flex-row justify-between px-4 pt-4">
            <div className="flex flex-row items-center space-x-4" onClick={() => setShowDropdown(!showDropdown)}>
               <p className="text-md">Show Details</p>
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
                  <p
                     className="p-2 text-sm rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                     {ticket.description}
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                     <label className="text-gray-700 text-sm mb-2">
                        Attendees Per Ticket
                     </label>
                     <p
                        className="p-2 text-sm rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                        {ticket.attendees}
                     </p>
                  </div>
                  <div className="flex flex-col">
                     <label className="text-gray-700 text-sm mb-2">
                        Maximum Tickets Per Order
                     </label>
                     <p
                        className="p-2 text-sm rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                        {ticket.max_purchase}
                     </p>
                  </div>
                  <div className="flex flex-col">
                     <label className="text-gray-700 text-sm mb-2">
                        Ticket Available From
                     </label>
                     <p
                        className="p-2 text-sm rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                        {ticket.start_date}
                     </p>
                  </div>
                  <div className="flex flex-col">
                     <label className="text-gray-700 text-sm mb-2">
                        Ticket Available Until
                     </label>
                     <p
                        className="p-2 text-sm rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                        {ticket.end_date}
                     </p>
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
                     value={ticket.name}
                     onChange={handleChange}
                     disabled
                  />
               </div>
            </div>
         </div>}
      </div>
   )
}

export default TicketComponent