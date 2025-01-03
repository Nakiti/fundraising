"use client";
import { useContext } from "react";
import { PeerFundraisingPageContext } from "@/app/context/campaignPages/peerFundraisingPageContext";

const Display = () => {
   const {peerFundraisingPageInputs} = useContext(PeerFundraisingPageContext)
   
   return (
      <div 
         className="w-full mb-4 max-w-6xl mx-auto bg-white rounded-sm shadow-md mt-6 overflow-y-auto" 
         style={{ backgroundColor: peerFundraisingPageInputs.bg_color }}
      >
         <div className="relative w-full">
            <div className=" w-full text-lg font-bold text-start text-gray-600 px-4 py-2 bg-white/70 backdrop-blur-sm z-10 border-b border-gray-200">
               <h1 className="px-2 py-1">Header</h1>
            </div>
            <img
               src={peerFundraisingPageInputs.banner_image || "image1.jpg"}
               alt="image"
               className="w-full h-80 object-cover bg-gray-50"
            />
         </div>
         <div className="w-5/6 mx-auto relative flex flex-row mb-8 border-t border-gray-200 pt-6" style={{ color: peerFundraisingPageInputs.bg_color }}>
            <div className="w-1/3">
               <img 
                  src={peerFundraisingPageInputs.person_image || "image1.jpg"}
                  className="h-48 w-48 object-cover border-4 border-white shadow-lg -mt-10 rounded-md"
                  alt="image"
               />
            </div>
            <div className="w-2/3 mt-4">
               <div className="flex flex-row justify-between mb-6">
                  <div>
                     <p className="text-gray-500 text-xs" style={{ color: peerFundraisingPageInputs.p_color }}>Fundraiser</p>
                     <h1 className="text-2xl font-semibold text-gray-800" style={{ color: peerFundraisingPageInputs.p_color }}>{peerFundraisingPageInputs.headline || "Headline"}</h1>
                  </div>
                  <button className="text-xs text-blue-600 hover:underline">Share</button>
               </div>
               <div className="mb-6">
                  <p className="text-sm font-medium mb-1 text-gray-700" style={{ color: peerFundraisingPageInputs.p_color }}>X of 1000 raised</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                     <div className="bg-blue-600 h-3 rounded-full w-1/12"></div>
                  </div>
               </div>
               <div className="space-y-4 py-8 mt-8 border-t border-gray-200">
                  <h2 className="text-xl text-gray-800 font-semibold text-center">About</h2>
                  <pre className="text-sm text-wrap text-gray-600 leading-relaxed">
                     {peerFundraisingPageInputs.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"}
                  </pre>
               </div>
               <div className="flex justify-center items-center mt-6">
                  <button 
                     disabled
                     className="w-1/3 py-2 text-white rounded-sm bg-blue-700 shadow-md hover:bg-blue-800 transition-colors duration-200"
                     style={{ backgroundColor: peerFundraisingPageInputs.p_color }}
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