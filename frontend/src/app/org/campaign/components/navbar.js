"use client"

import { CampaignContext } from "@/app/context/campaignContext";
import { useState, useContext } from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { usePathname } from "next/navigation";
import { createCampaignDesignation, deleteCampaignDesignation, updateCampaign, updatePreview } from "@/app/services/campaignService"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


const Navbar = ({active, handleActiveChange, handlePublish, handleSave, handleDeactivate, title, links, mode}) => {
   const {status, aboutInputs} = useContext(CampaignContext)
   const pathName = usePathname()
   const [showDropdown, setShowDropdown] = useState(false)

   return (
      <div className="border-b border-gray-100 bg-gray-700 shadow-sm text-black">
         <div className="flex flex-row py-2">
            <Link href="/org/dashboard/campaigns" className="px-4 flex items-center"> <IoMdArrowRoundBack className="text-xl text-gray-100"/></Link>
            {/* <div className="border-r h-8 border-gray-300"/> */}
         </div>
         <div className="flex items-center justify-between w-11/12 mx-auto py-4">
            <div className="flex flex-row items-center">
               <img 
                  src="404image"
                  className="h-16 w-16 mr-4"
               />
               <div className="flex flex-col text-gray-100">
                  <p className="text-sm">{mode == "new" ? "New Campaign" : "Edit Campaign"}</p>
                  <h1 className="text-3xl ">{aboutInputs.internalName || "Internal Campaign Name"}</h1>
               </div>
            </div>

            {/* Buttons on the right */} 
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
            {mode == "new" ? <Link
               className={`cursor-pointer text-md border-b-2 py-1 px-8 ${pathName.split("/")[4] == links[0].split("/")[4] ? "border-white" : "border-transparent"}`}
               href={links[0]}
               onClick={() => setShowDropdown(false)}
            >
               Details
            </Link> 
            :
            <Link
               className={`cursor-pointer text-md border-b-2 py-1 px-8 ${pathName.split("/")[5] == links[0].split("/")[5] ? "border-white" : "border-transparent"}`}
               href={links[0]}
               onClick={() => setShowDropdown(false)}
            >
               Details
            </Link> 
            }
               <button 
                  className="cursor-pointer text-md py-1 px-8 flex flex-row items-center"
                  onClick={() => setShowDropdown(!showDropdown)}
               >
                  Pages
                  {showDropdown ? <IoIosArrowUp className="ml-2"/> : <IoIosArrowDown className="ml-2"/>}
               </button>
            {/* {mode == "new" ? <Link
               className={`cursor-pointer text-md border-b-2 py-1 px-8 ${pathName.split("/")[4] == links[1].split("/")[4] ? "border-white" : "border-transparent"}`}
               href={links[1]}
            >
               Pages
            </Link> :

            <Link
               className={`cursor-pointer text-md border-b-2 py-1 px-8 ${pathName.split("/")[5] == links[1].split("/")[5] ? "border-white" : "border-transparent"}`}
               href={links[1]}
            >
               Pages
            </Link>
            } */}
         </div>
         {showDropdown && <div className="border-t border-gray-400 px-4 w-11/12 mx-auto mt-2 py-4 ">
            <div className="w-1/2 mx-auto flex flex-row justify-between">
               <div className="flex flex-col w-48">
                  {mode == "new" ? 
                  <Link 
                     className={`border-2 w-48 h-28 ${pathName.split("/")[4] == links[1].split("/")[4] ? "border-blue-800" : "border-gray-400"}`}
                     href={links[1]}
                  >

                  </Link> :
                  <Link 
                     className={`border-2 w-48 h-28 ${pathName.split("/")[5] == links[1].split("/")[5] ? "border-blue-800" : "border-gray-400"}`}
                     href={links[1]}
                  >

                  </Link>
                  }
                  <p className="text-center text-white text-sm mt-1">Donation Page</p>
               </div>

               <div className="flex flex-col w-48">
                  {mode == "new" ? <Link 
                     className={`border-2 w-48 h-28 ${pathName.split("/")[4] == links[2].split("/")[4] ? "border-blue-800" : "border-gray-400"}`}
                     href={links[2]}
                  >

                  </Link> :
                  <Link 
                     className={`border-2 w-48 h-28 ${pathName.split("/")[5] == links[2].split("/")[5] ? "border-blue-800" : "border-gray-400"}`}
                     href={links[2]}
                  >

                  </Link>
               }
                  <p className="text-center text-white text-sm mt-1">Thank You Page</p>
               </div>
            </div>
         </div>}
      </div>
   )
}

export default Navbar;
