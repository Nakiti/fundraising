"use client"

import { CampaignContext } from "@/app/context/campaignContext";
import { useState, useContext } from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { usePathname } from "next/navigation";


const Navbar = ({active, handleActiveChange, handlePublish, handleSave, handleDeactivate, title, links, mode}) => {
   const {status} = useContext(CampaignContext)
   const pathName = usePathname()

   return (
      <div className="border-b border-gray-100 shadow-sm bg-white text-black">
         <div className="flex flex-row py-2">
            <Link href="/org/dashboard/campaigns" className="px-4 flex items-center"> <IoMdArrowRoundBack className="text-xl"/></Link>
            {/* <div className="border-r h-8 border-gray-300"/> */}
         </div>
         <div className="flex items-center justify-between w-11/12 mx-auto py-4">
            <div className="flex flex-row items-center">
               <img 
                  src="404image"
                  className="h-16 w-16 mr-4"
               />
               <div className="flex flex-col">
                  <p className="text-sm text-gray-600">Donation Page</p>
                  <h1 className="text-3xl font-bold">{mode == "new" ? "New Campaign" : "Edit Campaign"}</h1>
               </div>
            </div>

            {/* Buttons on the right */} 
            <div className="flex space-x-4 text-md">
               {status == "inactive" ? 
                  <button 
                     className="border-2 border-blue-700 hover:bg-gray-100 py-1 px-8 rounded-md text-blue-700"
                     onClick={handleSave}
                  >
                     Save
                  </button> :
                  <button 
                     className="border-2 border-red-700 hover:bg-gray-100 py-1 px-8 rounded-md text-red-700"
                     onClick={handleDeactivate}
                  >
                     Deactivate
                  </button>
               }
               <button 
                  className="border-2 border-blue-700 hover:bg-gray-100 py-1 px-8 rounded-md text-blue-700"
                  onClick={handlePublish}
               >
                  Publish
               </button>
            </div>
         </div>

         <div className="flex flex-row space-x-8 w-11/12 mx-auto mt-8">
            {mode == "new" ? <Link
               className={`cursor-pointer text-md font-semibold border-b-2 ${pathName.split("/")[4] == links[0].split("/")[4] ? "border-blue-700" : "border-transparent"}`}
               href={links[0]}
            >
               Details
            </Link> 
            :
            <Link
               className={`cursor-pointer text-md font-semibold border-b-2 ${pathName.split("/")[5] == links[0].split("/")[5] ? "border-blue-700" : "border-transparent"}`}
               href={links[0]}
            >
               Details
            </Link> 
            }
            {mode == "new" ? <Link
               className={`cursor-pointer text-md font-semibold border-b-2 ${pathName.split("/")[4] == links[1].split("/")[4] ? "border-blue-700" : "border-transparent"}`}
               href={links[1]}
            >
               Pages
            </Link> :

            <Link
               className={`cursor-pointer text-md font-semibold border-b-2 ${pathName.split("/")[5] == links[1].split("/")[5] ? "border-blue-700" : "border-transparent"}`}
               href={links[1]}
            >
               Pages
            </Link>
            }
         </div>
      </div>
   )
}

export default Navbar;
