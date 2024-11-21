"use client";
import { CgProfile } from "react-icons/cg";
import { useContext, useState } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import { IoIosClose } from "react-icons/io";

const Display = () => {
   const {donationPageInputs, handleDonationPageInputsChange} = useContext(CampaignContext)
   
   return (
      <div 
         className="w-full mb-4 max-w-6xl mx-auto bg-white rounded-sm shadow-md mt-6 overflow-y-auto" 
         style={{ backgroundColor: donationPageInputs.bg_color }}
      >
         <div className="relative w-full">
            {/* Header overlay */}
            <div 
               className="absolute top-0 left-0 w-full text-lg font-bold text-start text-gray-600 px-4 py-2 bg-white/70 backdrop-blur-sm z-10 border-b border-gray-200"
            >
               <h1 
               className="px-2 py-1"
               name="heading"
               >
               Header
               </h1>
            </div>

            {/* First Image */}
            <img
               src="https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630"
               alt="image"
               className="w-full h-72 object-cover bg-gray-50"
            />
         </div>

         <div className="w-5/6 mx-auto relative flex flex-row mb-8 border-t border-gray-200 pt-6">
            <div className="w-1/3">
               <img 
               src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
               className="h-48 w-48 object-cover border-4 border-white shadow-lg -mt-10 rounded-md"
               />
            </div>
            <div className="w-2/3 mt-4">
               <div className="flex flex-row justify-between mb-6">
                  <div>
                     <p className="text-gray-500 text-xs">Fundraiser</p>
                     <h1 className="text-2xl font-semibold text-gray-800">Fundraiser Name</h1>
                  </div>
                  <button className="text-xs text-blue-600 hover:underline">Share</button>
               </div>

               <div className="mb-6">
                  <p className="text-sm font-medium mb-1 text-gray-700" style={{ color: donationPageInputs.p_color }}>X of 1000 raised</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                     <div className="bg-blue-600 h-3 rounded-full w-1/12"></div>
                  </div>
               </div>

               <div className="space-y-4 py-4 border-t border-gray-200">
                  <h2 className="text-xl text-gray-800 font-semibold text-center">About</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                     {donationPageInputs.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"}
                  </p>
               </div>

               <div className="mt-6">
                  <h3 className="text-md text-gray-700 font-semibold mb-2">I would like to give to:</h3>
                  <select 
                     className="w-full border border-gray-300 rounded-sm p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                     defaultValue="Select"
                     disabled
                  >
                  </select>
               </div>

               <div className="mt-6">
                  <h3 className="text-md text-gray-700 font-semibold mb-2">I would like to give:</h3>
                  <div className="grid grid-cols-3 gap-4 max-w-sm">
                     {[donationPageInputs.button1, donationPageInputs.button2, donationPageInputs.button3, donationPageInputs.button4, donationPageInputs.button5, donationPageInputs.button6].map((amount, index) => (
                        <button
                        key={index}
                        className="w-full text-xs py-2 bg-blue-700 text-white rounded-sm shadow-md hover:bg-blue-800 transition-colors duration-200"
                        disabled
                        style={{ backgroundColor: donationPageInputs.b3_color }}
                        >
                        {amount}
                        </button>
                     ))}
                     <input 
                        placeholder="Enter Custom Amount" 
                        type="number" 
                        disabled
                        className="col-span-2 text-sm rounded-sm py-2 px-4 bg-white border border-blue-600 text-gray-700 shadow focus:outline-none " 
                     /> 
                  </div>
               </div>

               <div className="flex justify-center items-center mt-6">
                  <button 
                     disabled
                     className="w-1/2 py-2 text-white rounded-sm bg-blue-700 shadow-md hover:bg-blue-800 transition-colors duration-200"
                     style={{ backgroundColor: donationPageInputs.b1_color }}
                  >
                     Donate
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Display