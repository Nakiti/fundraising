"use client";
import { CgProfile } from "react-icons/cg";
import { useContext, useState } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import { IoIosClose } from "react-icons/io";
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext";
import { TicketPurchasePageContext } from "@/app/context/campaignPages/ticketPurchasePageContext";

const Display = () => {
   const {ticketPurchaseInputs, handleTicketPurchaseInputsChange} = useContext(TicketPurchasePageContext)
   
   return (
      <div className="w-full mb-4 max-w-6xl mx-auto bg-white rounded-sm shadow-md mt-6 overflow-hidden">
         <div className="w-full text-lg font-bold text-start text-gray-600 px-4 py-2 bg-white/70 backdrop-blur-sm z-10 border-b border-gray-200">
            <h1 className="px-2 py-1" name="heading">
               Header
            </h1>
         </div>
         <div className="flex flex-row w-full">
            <div className="px-6 py-8 w-2/3 bg-gray-50">
               <div className="mb-10">
                  <h1 className="text-xl font-semibold mb-2">{ticketPurchaseInputs.headline || "Purchase Tickets"}</h1>
                  <p className="text-sm text-gray-700">{ticketPurchaseInputs.description || "This is the instructions words words and more words are filling this up"}</p>
               </div>
               <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                     <input
                        type="checkbox"
                        className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                     />
                     <div className="w-full border border-gray-300 p-4 bg-white">
                        <div className="flex flex-row w-full mb-4">
                           <div className="w-5/6">
                              <h1 className="text-lg font-semibold mb-2">Concert Ticket</h1>
                              <p className="text-sm text-gray-700 mb-4">This is the description</p>
                           </div>
                           <div className="flex items-center w-1/5">
                              <div className="flex flex-col items-center">
                                 <p className="text-sm text-gray-700 mb-2">Quantity</p>
                                 <input
                                 className="border border-gray-300 py-1 px-2 w-full text-sm"
                                 type="number"
                                 min={0}
                                 placeholder="Max: 0"
                                 />
                              </div>
                           </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-300 pt-2">
                        <span className="text-md font-medium">$45.00</span>
                        <p className="text-sm text-gray-500">Available Until: 12/31/2024</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <input
                        type="checkbox"
                        className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                     />
                     <div className="w-full border border-gray-300 p-4 bg-white">
                        <div className="flex flex-row w-full mb-4">
                           <div className="w-5/6">
                              <h1 className="text-lg font-semibold mb-2">Concert Ticket</h1>
                              <p className="text-sm text-gray-700 mb-4">This is the description</p>
                           </div>
                           <div className="flex items-center w-1/5">
                              <div className="flex flex-col items-center">
                                 <p className="text-sm text-gray-700 mb-2">Quantity</p>
                                 <input
                                 className="border border-gray-300 py-1 px-2 w-full text-sm"
                                 type="number"
                                 min={0}
                                 placeholder="Max: 0"
                                 />
                              </div>
                           </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-300 pt-2">
                        <span className="text-md font-medium">$45.00</span>
                        <p className="text-sm text-gray-500">Available Until: 12/31/2024</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="w-1/3 flex flex-col justify-between py-4 px-4 border-l border-gray-300">
               <div className="flex flex-col justify-between h-96">
                  <h1 className="text-xl font-semibold text-center border-b border-gray-300 py-6">Your Purchase</h1>
                  <button className="bg-blue-700 w-3/4 mx-auto px-6 py-2 rounded-sm text-white">Checkout</button>
               </div>
            </div>
         </div>
         <div className="bg-gray-100 border-t border-gray-300 py-4">
            <div className="text-center text-gray-600 text-xs">
               <p>&copy; {new Date().getFullYear()} Your Organization. All rights reserved.</p>
               <p className="mt-1">
                  <a href="#" className="hover:underline">Privacy Policy</a> | 
                  <a href="#" className="hover:underline ml-2">Terms of Service</a>
               </p>
            </div>
         </div>
      </div>
   );
}

export default Display