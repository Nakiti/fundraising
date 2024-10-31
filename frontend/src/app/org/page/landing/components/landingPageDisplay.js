"use client";
import { CgProfile } from "react-icons/cg";
import { useContext, useState } from "react";
import { LandingPageContext } from "@/app/context/landingPageContext";

import { IoIosClose } from "react-icons/io";

const LandingPageDisplay = () => {

   const {inputs, sections} = useContext(LandingPageContext)

   const campaigns = ["Campaign One", "Campaign Two"]

   return (
      <div 
         className="bg-white max-w-6xl shadow-md overflow-y-auto"
         style={{backgroundColor: inputs.bg_color, height: "450px"}}
      >
         <div className="bg-black w-full p-3">
            <p className="text-white ml-4">Header</p>
         </div>

         <div className="relative w-full">
            <img
               className="w-full object-cover"
               style={{height: "300px"}}
               src={inputs.bgImage ? inputs.bgImage : "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"}
               alt="Organization"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 bg-black bg-opacity-50">
               <h1 className="text-3xl font-semibold text-white" style={{color: inputs.p_color}}>
                  {inputs.title || "Title"}
               </h1>
               <p className="text-sm text-gray-200 w-11/12 md:w-2/3 lg:w-1/2 mx-auto" style={{color: inputs.s_color}}>
                  {inputs.description ? inputs.description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
               </p>

               <div className="flex justify-center space-x-4">
                  <button disabled className="bg-blue-800 text-white py-2 px-6 text-sm rounded-md transition">
                     Donate
                  </button>
                  <button disabled className="bg-blue-800 text-white py-2 px-6 text-sm rounded-md transition">
                     Share
                  </button>
               </div>
            </div>
         </div>
         {sections[1].active && <div className="flex flex-col md:flex-row items-center space-x-4 justify-between w-full py-12 px-16">
            <div className="md:w-1/2 space-y-6">
               <h2 className="text-xl text-gray-800">
                  About Our Organization
               </h2>
               <p className="text-sm text-gray-600">
                  {inputs.about ? inputs.about : "Temporary text"}
               </p>
               <button 
                  disabled className="bg-blue-600 text-white py-2 text-xs px-6 rounded-sm">
                  Learn More
               </button>
            </div>

            <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
               <img
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                  src={inputs.aboutImage ? inputs.aboutImage : "https://via.placeholder.com/500x300"}
                  alt="About Us"
               />
            </div>
         </div>}
         {sections[2].active && <div className="flex flex-col md:flex-row items-center space-x-4 justify-between w-full py-12 px-16">
            <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
               <img
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                  src={inputs.aboutImage ? inputs.aboutImage : "https://via.placeholder.com/500x300"}
                  alt="About Us"
               />
            </div>
            <div className="md:w-1/2 space-y-6">
               <h2 className="text-xl text-gray-800">
                  Our Impact
               </h2>
               <p className="text-sm text-gray-600">
                  {inputs.about ? inputs.about : "Temporary text"}
               </p>
               <button 
                  disabled className="bg-blue-600 text-white py-2 text-xs px-6 rounded-sm">
                  Learn More
               </button>
            </div>
         </div>}
         <div className="container mx-auto px-12 pt-6 pb-12">
            {/* Active Campaigns */}
            <div id="campaigns" className="mt-4">
               <h2 className="text-xl mb-6 text-gray-800" style={{color: inputs.p_color}}>
                  Active Campaigns:
               </h2>
               <div className="grid grid-cols-2 gap-8 w-11/12 mx-auto">
                  {campaigns.map((item, index) => {
                     return (
                        <div 
                           className="shadow-lg rounded-lg w-full h-full" 
                           key={index}
                           style={{backgroundColor: inputs.c_color}}
                        >
                           <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
                              className="object-cover w-full rounded-t-lg"
                              style={{height: "150px"}}
                           />
                           <div className="px-6 py-4">
                              <div className="flex flex-row space-x-2 justify-between items-center">
                                 <div>
                                    <h1 className="text-md mb-2" style={{color: inputs.ct_color}}>{item}</h1>
                                    <p className="text-xs" style={{color: inputs.ct_color}}>This is the description...</p>
                                 </div>
                                 <div className="flex flex-col items-end space-y-1">
                                    <button disabled className="px-2 w-16 py-1 bg-blue-600 rounded-sm text-white text-xs text-center" >
                                       Donate
                                    </button>
                                    <button disabled className="px-4 w-16 py-1 bg-gray-200 rounded-sm text-xs">Share</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )})
                  }
               </div>
            </div>
         </div>
      </div>
   );
}

export default LandingPageDisplay