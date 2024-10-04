"use client"

import { CampaignContext } from "@/app/context/campaignContext";
import { useState, useContext } from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";


const Navbar = ({active, handleActiveChange, handlePublish, handleSave, handleDeactivate}) => {
   const {status} = useContext(CampaignContext)

   return (
      <div className="flex items-center justify-between p-2 border-b border-gray-100 shadow-sm bg-white text-black">
         {/* Button on the left */}
         <div className="flex flex-row">
            <Link href="/org/dashboard/campaigns" className="px-4 flex items-center"> <IoMdArrowRoundBack className="text-xl"/></Link>
            <div className="border-r h-8 border-gray-300"/>
            <h1 className="text-lg font-semibold px-4">New Campaign</h1>

         </div>

         {/* Title in the center */}
         <div className="flex flex-row space-x-8">
            <h1
               onClick={() => handleActiveChange('settings')}
               className={`cursor-pointer text-md font-semibold ${active === 'settings' ? 'border-b-2 border-blue-600': ''}`}
            >
               Settings
            </h1>
            <h1
               onClick={() => handleActiveChange('preview')}
               className={`cursor-pointer text-md font-semibold ${active === 'preview' ? 'border-b-2 border-blue-600': ''}`}
            >
               Preview
            </h1>
         </div>

         {/* Buttons on the right */} 
         <div className="flex space-x-4 text-sm">
            {status == "inactive" ? 
               <button 
                  className="border-2 border-blue-700 hover:bg-gray-100 py-1 px-4 rounded-md"
                  onClick={handleSave}
               >
                  Save
               </button> :
               <button 
                  className="border-2 border-red-700 hover:bg-gray-100 py-1 px-4 rounded-md"
                  onClick={handleDeactivate}
               >
                  Deactivate
               </button>
            }
            <button 
               className="border-2 border-blue-700 hover:bg-gray-100 py-1 px-4 rounded-md"
               onClick={handlePublish}
            >
               Publish
            </button>
         </div>
      </div>
   )
}

export default Navbar;
