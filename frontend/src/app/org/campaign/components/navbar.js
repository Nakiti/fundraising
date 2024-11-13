"use client"

import { CampaignContext } from "@/app/context/campaignContext";
import { useState, useContext } from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { usePathname, useSearchParams } from "next/navigation";
import { createCampaignDesignation, deleteCampaignDesignation, updateCampaign, updatePreview } from "@/app/services/campaignService"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


const Navbar = ({active, handleActiveChange, handlePublish, handleSave, handleDeactivate, title, detailsLink, pageLinks, mode}) => {
   const {status, aboutInputs, campaignType} = useContext(CampaignContext)
   const pathName = usePathname()
   const [showDropdown, setShowDropdown] = useState(false)

   return (
      <div className="border-b border-gray-100 bg-gray-700 shadow-sm text-black">
         <div className="flex flex-row py-2">
            <Link href="/org/dashboard/campaigns" className="px-4 flex items-center"> <IoMdArrowRoundBack className="text-xl text-gray-100"/></Link>
         </div>
         <div className="flex items-center justify-between w-11/12 mx-auto py-4">
            <div className="flex flex-row items-center">
               <img 
                  src="404image"
                  className="h-20 w-20 mr-4"
               />
               <div className="flex flex-col text-gray-100">
                  <p className="text-sm">{mode == "new" ? "New Campaign" : "Edit Campaign"}</p>
                  <h1 className="text-3xl ">{aboutInputs.internalName || "Internal Campaign Name"}</h1>
                  <p className="text-md font-semibold mt-1">{campaignType}</p>
               </div>
            </div>

            <div className="flex space-x-4 text-md">
               {status == "inactive" ? 
                  <button 
                     className="bg-blue-800 hover:bg-blue-600 py-2 px-10 rounded-sm text-gray-100"
                     onClick={handleSave}
                  >
                     Save
                  </button> :
                  <button 
                     className="bg-blue-800 hover:bg-blue-600 py-2 px-10 rounded-sm text-gray-100"
                     onClick={handleDeactivate}
                  >
                     Deactivate
                  </button>
               }
               <button 
                  className=" bg-blue-800 hover:bg-blue-600 py-1 px-8 rounded-sm text-gray-100"
                  onClick={handlePublish}
               >
                  Publish
               </button>
            </div>
         </div>

         <div className="flex flex-row space-x-8 w-11/12 mx-auto mt-4 text-white mb-1">
            <Link
               className={`cursor-pointer text-md border-b-2 py-1 px-8 ${pathName.split("/")[5] == detailsLink[0].split("/")[5] ? "border-blue-800" : "border-transparent"}`}
               href={detailsLink}
               onClick={() => setShowDropdown(false)}
            >
               Details
            </Link> 
         
            <button 
               className="cursor-pointer text-md py-1 px-8 flex flex-row items-center"
               onClick={() => setShowDropdown(!showDropdown)}
            >
               Pages
               {showDropdown ? <IoIosArrowUp className="ml-2"/> : <IoIosArrowDown className="ml-2"/>}
            </button>
         </div>
         {showDropdown && <div className="border-t border-gray-400 px-4 w-11/12 mx-auto mt-2 py-4 ">
            <div className="w-2/3 mx-auto flex flex-row justify-between">
               {pageLinks.map(item => (
                  <div className="flex flex-col w-48">
                     <Link 
                        className={`border-2 w-48 h-28 ${pathName.split("/")[5] == item.path.split("/")[5] ? "border-blue-800" : "border-gray-400"}`}
                        href={item.path}
                     >
                     </Link>
                     <p className="text-center text-white text-sm mt-1">{item.title}</p>
                  </div>
               ))}
            </div>
         </div>}
      </div>
   )
}

export default Navbar;
