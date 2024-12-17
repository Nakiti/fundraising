"use client";
import { useContext, useState } from "react";
import { PeerLandingPageContext } from "@/app/context/campaignPages/peerLandingPageContext";

const Display = () => {
   const {peerLandingPageInputs, handlePeerLandingPageInputsChange} = useContext(PeerLandingPageContext)
   
   return (
      <div 
         className="w-full mb-4 max-w-6xl mx-auto bg-white rounded-sm shadow-md mt-6 overflow-hidden"
         style={{ backgroundColor: peerLandingPageInputs.bg_color }}
      >
         {/* Header Section */}
         <div className="px-6 py-4 border-b border-gray-300 bg-white">
            <h1 className="text-2xl font-bold text-gray-800">
               Header
            </h1>
         </div>

         {/* Banner Section with Overlay */}
         <div className="relative w-full mb-8">
            {/* Banner Image */}
            <img
               src={peerLandingPageInputs.banner_image || "image1.jpg"}
               alt="Banner"
               className="w-full h-80 object-cover bg-gray-100"
            />

            {/* Overlay Content */}
            <div 
               className="absolute inset-0 flex flex-col items-center justify-center text-center  p-4"
            >
               <h2 className="text-5xl font-semibold text-black mb-8">
                  {peerLandingPageInputs.headline || "Headline"}
               </h2>
               <div className="flex gap-4">
                  <button 
                     className="bg-blue-800 text-white px-6 py-3 text-sm rounded-sm hover:bg-blue-700 transition"
                  >
                     Fundraise
                  </button>
                  <button 
                     className="bg-green-800 text-white px-6 py-3 text-sm rounded-sm hover:bg-green-700 transition"
                  >
                     Donate
                  </button>
               </div>
            </div>
         </div>

         {/* Description Section */}
         <div className="p-6 text-gray-700 w-11/12 mx-auto ">
            <h3 className="text-2xl font-semibold mb-6 text-center">
               {peerLandingPageInputs.tagline || "About the Cause"}
            </h3>
            <p className="text-center text-sm">
               {peerLandingPageInputs.description || 
               "Your generous donations help us make a difference. Join us in supporting this important cause."}
            </p>
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