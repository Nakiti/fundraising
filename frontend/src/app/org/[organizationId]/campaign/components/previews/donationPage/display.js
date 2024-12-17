"use client";
import { CgProfile } from "react-icons/cg";
import { useContext, useState } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import { IoIosClose } from "react-icons/io";
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";

const Display = () => {
   const {donationPageInputs, handleDonationPageInputsChange} = useContext(DonationPageContext)
   
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
            <div className="relative w-full h-72 bg-gray-50 flex items-center justify-center">
               {donationPageInputs.banner_image ? (
                  <img
                     src={donationPageInputs.banner_image || "image1.jpg"}
                     alt="image"
                     className="w-full h-72 object-cover"
                  />
               ) : (
                  <span className="text-gray-400 text-lg font-medium">Upload Image</span>
               )}
            </div>
         </div>

         <div className="w-5/6 mx-auto relative flex flex-row mb-8 pt-6" style={{ color: donationPageInputs.bg_color }}>
            <div className="w-full mt-4">
               <div className="flex flex-row justify-between mb-4">
                  <div>
                     <p className="text-gray-500 text-xs" style={{ color: donationPageInputs.p_color }}>Fundraiser</p>
                     <h1 className="text-2xl font-semibold text-gray-800" style={{ color: donationPageInputs.p_color }}>{donationPageInputs.headline || "Headline"}</h1>
                  </div>
                  <button className="text-xs text-blue-600 hover:underline">Share</button>
               </div>

               <div className="mb-6">
                  <p className="text-sm font-medium mb-1 text-gray-700" style={{ color: donationPageInputs.p_color }}>X of 1000 raised</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                     <div className="bg-blue-600 h-3 rounded-full w-1/12"></div>
                  </div>
               </div>

               <div className="space-y-4 pb-4 pt-8 border-t border-gray-200">
                  <h2 className="text-xl text-gray-800 font-semibold text-center">About</h2>
                  <pre className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                     {donationPageInputs.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"}
                  </pre>
               </div>

               <div className="flex justify-center items-center mt-6 border-t border-gray-200 pt-6">
                  <button 
                     disabled
                     className="w-1/4 cursor-pointer py-2 text-white rounded-sm bg-blue-700 shadow-md hover:bg-blue-800 transition-colors duration-200"
                     style={{ backgroundColor: donationPageInputs.b1_color }}
                  >
                     Donate
                  </button>
               </div>
            </div>
         </div>
         <div className="bg-gray-100 border-t border-gray-300 py-4 mt-12">
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

//TODO
/*
   design generic donation form that will be available for all campaigns
   create necessary pages on intialization of peer 2 peer
   add update/fetch/create services

*/