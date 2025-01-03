"use client"
import { useContext } from "react";
import { CampaignContext } from "@/app/context/campaignContext";

const CampaignContact = () => {

   return (
      <div className="w-full max-w-4xl mx-auto py-8 px-6">
         <h1 className="text-4xl mb-2 font-light">Contact</h1>
         <h3 className="text-md text-gray-600 mb-8">Provide contact information for donors with questions</h3>
         <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
               <label className="text-gray-500 text-sm font-bold mb-1">
                  Email <span className="text-red-500">*</span>
               </label>
               <input
                  name="campaignName"
                  type="text"
                  placeholder="Enter Email Address"
                  className="p-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // value={aboutInputs.campaignName}
                  // onChange={handleAboutInputsChange}
               />
            </div>
            <div className="flex flex-col">
               <label className="text-gray-500 text-sm font-bold mb-1">
                  Phone Number <span className="text-red-500">*</span>
               </label>
               <input
                  name="internalName"
                  type="text"
                  placeholder="Enter Phone Number"
                  className="p-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // value={aboutInputs.internalName}
                  // onChange={handleAboutInputsChange}
               />
            </div>
         </div>
         <div className="w-full flex flex-row mt-6">
            <button className="ml-auto bg-blue-600 px-6 py-3 w-40 rounded-md shadow-sm text-md text-white">
               Save
            </button>
         </div>
      </div>
   )
}

export default CampaignContact