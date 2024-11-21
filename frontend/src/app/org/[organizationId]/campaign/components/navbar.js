"use client"

import { CampaignContext } from "@/app/context/campaignContext";
import { useState, useContext } from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { usePathname, useSearchParams } from "next/navigation";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


const Navbar = ({campaignId, organizationId, handlePublish, handleSave, handleDeactivate, detailsLink, pageLinks, mode}) => {
   const {status, campaignDetails, campaignType} = useContext(CampaignContext)
   const pathName = usePathname()
   const [showDropdown, setShowDropdown] = useState(false)

   return (
      <div className="border-b border-gray-200 bg-gray-800 text-white">
         <div className="flex flex-row py-2 px-6">
            <Link href={`/org/${organizationId}/dashboard/campaigns/${campaignId}`} className="flex items-center text-gray-200 hover:text-gray-100">
               <IoMdArrowRoundBack className="text-2xl" />
            </Link>
         </div>

         <div className="flex items-center justify-between w-11/12 mx-auto py-2">
            <div className="flex items-center">
               <img 
                  src="404image" 
                  className="h-16 w-16 rounded-lg mr-4 object-cover border border-dashed"
               />
               <div className="flex flex-col text-gray-100">
                  <p className="text-xs font-semibold">{mode === "new" ? "New Campaign" : "Edit Campaign"}</p>
                  <h1 className="text-2xl font-semibold">{campaignDetails.internalName || "Internal Campaign Name"}</h1>
                  <p className="text-md font-semibold text-gray-400 mt-1">{campaignType}</p>
               </div>
            </div>

            <div className="flex space-x-6 text-md">
               {status === "inactive" ? 
                  <button 
                     className="bg-blue-600 hover:bg-blue-500 py-3 px-8 rounded-md text-white transition-all duration-200"
                     onClick={handleSave}
                  >
                     Save
                  </button> :
                  <button 
                     className="bg-blue-600 hover:bg-blue-500 py-3 px-8 rounded-md text-white transition-all duration-200"
                     onClick={handleDeactivate}
                  >
                     Deactivate
                  </button>
               }
               <button 
                  className="bg-blue-600 hover:bg-blue-500 py-3 px-8 rounded-md text-white transition-all duration-200"
                  onClick={handlePublish}
               >
                  Publish
               </button>
            </div>
         </div>

         <div className="flex flex-row space-x-10 w-11/12 mx-auto mt-6 text-white">
            <Link
               className={`cursor-pointer text-md font-medium py-1 px-6 border-b-4 ${pathName.split("/")[6] === detailsLink.split("/")[6] ? "border-blue-600" : "border-transparent"} hover:text-blue-600`}
               href={detailsLink}
               onClick={() => setShowDropdown(false)}
            >
               Details
            </Link>

            <button 
               className="cursor-pointer text-md font-medium py-1 px-6 flex items-center border-b-4 border-transparent hover:text-blue-600"
               onClick={() => setShowDropdown(!showDropdown)}
            >
               Pages
               {showDropdown ? <IoIosArrowUp className="ml-2" /> : <IoIosArrowDown className="ml-2" />}
            </button>
         </div>

         {showDropdown && (
            <div className="border-t border-gray-300 px-6 w-11/12 mx-auto py-4">
               <div className="w-2/3 mx-auto grid grid-cols-3 gap-8">
                  {pageLinks.map(item => (
                     <div key={item.title} className="flex flex-col items-center">
                        <Link 
                           className={`w-full h-28 border-2 ${pathName.split("/")[6] === item.path.split("/")[6] ? "border-blue-600" : "border-gray-400"} rounded-md p-4 flex justify-center items-center hover:border-blue-600 transition-all duration-200`}
                           href={item.path}
                        />
                        <p className="text-center text-sm text-white mt-2">{item.title}</p>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>

   )
}

export default Navbar;
