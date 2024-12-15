"use client";
import { CgProfile } from "react-icons/cg";
import { useContext, useState } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import { IoIosClose } from "react-icons/io";
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext";

const Display = () => {
   const {ticketsPageInputs, handleTicketsPageInputs} = useContext(TicketPageContext)
   
   return (
      <div 
         className="w-full mb-4 max-w-6xl mx-auto bg-white rounded-sm shadow-md mt-6 overflow-y-auto" 
      >
         <div className="w-full">
            {/* Header overlay */}
            <div 
               className="w-full text-lg font-bold text-start text-gray-600 px-4 py-2 bg-white/70 backdrop-blur-sm z-10 border-b border-gray-200"
            >
               <h1 
               className="px-2 py-1"
               name="heading"
               >
               Header
               </h1>
            </div>
         </div>

         <div class="relative w-full h-72">
            <img
               src={ticketsPageInputs.bgImage}
               alt="Nature"
               class="w-full h-full object-cover"
            />
            <div 
               class="absolute inset-0 flex flex-col justify-center items-start py-6 px-12 bg-black bg-opacity-50 text-white"
               style={{color: ticketsPageInputs.p_color}}
            >
               <h1 class="text-4xl mb-2">{ticketsPageInputs.title || "Title"}</h1>
               <h3 class="text-lg mb-2">{ticketsPageInputs.date || "Date"}</h3>
               <p class="text-sm mb-4">{ticketsPageInputs.address || "Address"}</p>
               <button class="px-4 py-2 bg-blue-800 hover:bg-yellow-600 rounded-sm text-sm">Get Tickets</button>
            </div>
         </div>


         <div 
            className="mb-8 pt-6"
            style={{backgroundColor: ticketsPageInputs.bg_color}}
         >
            <div className="">
               <div className="space-y-2 w-2/3 mx-auto">
                  <h2 className="text-xl font-semibold text-center">About the Event</h2>
                  <p className="text-sm leading-relaxed text-black">
                     {ticketsPageInputs.aboutDescription || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"}
                  </p>
               </div>

               <div className="mt-12 border-t border-white">
                  <div className="flex flex-row w-2/3 mx-auto justify-between items-center">
                     <div className="">
                        <p className="text-2xl mb-2">{ticketsPageInputs.venue}</p>
                        <p className="text-md">{ticketsPageInputs.instructions}</p>
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

         <div 
            className="bg-white w-2/3 mx-auto pb-12"
            style={{backgroundColor: ticketsPageInputs.bg_color2}}
         >
            <div className="">
               <h2 className="text-xl text-gray-800 font-semibold text-center">Tickets</h2>
               <p className="text-md text-gray-600 text-center">
                  Purchase Your Tickets
               </p>
            </div>

            <div className="bg-gray-100 border p-4">

            </div>
         </div>
      </div>
   );
}

export default Display