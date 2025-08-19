"use client"

import { CampaignContext } from "@/app/context/campaignContext";
import { useState, useContext, useRef, useEffect } from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { usePathname, useSearchParams } from "next/navigation";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineCampaign } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { FaPeopleArrows } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";


const Navbar = ({campaignId, organizationId, handlePublish, handleSave, handleDeactivate, detailsLink, pageLinks, mode, status, hasUnsavedChanges}) => {
   const {campaignDetails, campaignType} = useContext(CampaignContext)
   const pathName = usePathname()
   const [showDropdown, setShowDropdown] = useState(false)
   const [showLinks, setShowLinks] = useState(false)
   const dropdownRef = useRef(null);

   const toggleDropdown = (e) => {
      e.stopPropagation(); // Prevent immediate closure
      setShowLinks((prev) => !prev);
   };

   useEffect(() => {
      const handleOutsideClick = (e) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target)
         ) {
            setShowLinks(false);
         }
      };
      document.addEventListener("click", handleOutsideClick);
      return () => document.removeEventListener("click", handleOutsideClick);
   }, []);

   // Show loading state if campaignDetails is not loaded
   if (!campaignDetails) {
      return (
         <div className="border-b border-gray-200 bg-gray-800 text-white">
            <div className="flex flex-row py-2 px-6">
               <Link href={`/org/${organizationId}/dashboard/campaigns/${campaignId}`} className="flex items-center text-gray-200 hover:text-gray-100">
                  <IoMdArrowRoundBack className="text-2xl" />
               </Link>
            </div>
            <div className="flex items-center justify-between w-11/12 mx-auto py-2">
               <div className="flex items-center">
                  <div className="h-16 w-16 bg-gray-600 rounded-sm mr-4 animate-pulse"></div>
                  <div className="flex flex-col text-gray-100">
                     <p className="text-xs font-semibold">{"Edit Campaign"}</p>
                     <h1 className="text-2xl font-semibold animate-pulse bg-gray-600 h-8 w-48 rounded"></h1>
                     <p className="text-md font-semibold text-gray-400 mt-1 animate-pulse bg-gray-600 h-4 w-24 rounded"></p>
                  </div>
               </div>
               <div className="flex space-x-6 text-md">
                  <div className="bg-gray-600 h-12 w-24 rounded animate-pulse"></div>
                  <div className="bg-gray-600 h-12 w-24 rounded animate-pulse"></div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="border-b border-gray-200 bg-gray-800 text-white">
         <div className="flex flex-row py-2 px-6">
            <Link href={`/org/${organizationId}/dashboard/campaigns/${campaignId}`} className="flex items-center text-gray-200 hover:text-gray-100">
               <IoMdArrowRoundBack className="text-2xl" />
            </Link>
         </div>
         <div className="flex items-center justify-between w-11/12 mx-auto py-2">
            <div className="flex items-center">
               {
                  campaignType == "crowdfunding" ? <MdOutlineCampaign className="h-16 w-16 p-1 border-2 border-white rounded-sm mr-4"/> :
                  campaignType == "ticketed-event" ? <IoTicketOutline className="h-16 w-16 p-1 border-2 border-white rounded-sm mr-4"/> :
                  campaignType == "peer-to-peer" ? <FaPeopleArrows className="h-16 w-16 p-1 border-2 border-white rounded-sm mr-4"/> :
                  <IoDocumentTextOutline className="h-16 w-16 p-1 border-2 border-white rounded-sm mr-4"/>
               }
               <div className="flex flex-col text-gray-100">
                  <p className="text-xs font-semibold">{"Edit Campaign"}</p>
                  <h1 className="text-2xl font-semibold">{campaignDetails.internalName || "Internal Campaign Name"}</h1>
                  <div className="flex items-center mt-1">
                     <p className="text-md font-semibold text-gray-400">{campaignType}</p>
                     <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                        status === "active" ? "bg-green-100 text-green-800" :
                        status === "inactive" ? "bg-gray-100 text-gray-800" :
                        status === "draft" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                     }`}>
                        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
                     </span>
                  </div>
               </div>
            </div>
            <div className="flex space-x-6 text-md">
               {status === "inactive" ? 
                  <button 
                     className={`py-3 px-8 rounded-md text-white transition-all duration-200 ${hasUnsavedChanges ? "bg-blue-700 hover:bg-blue-500" : "bg-gray-300 cursor-not-allowed"}`}
                     onClick={handleSave}
                     disabled={!hasUnsavedChanges}
                  >
                     Save & Exit
                  </button> :
                  <button 
                     className="bg-blue-700 hover:bg-blue-500 py-3 px-8 rounded-md text-white transition-all duration-200"
                     onClick={handleDeactivate}
                  >
                     Deactivate
                  </button>
               }
               <button 
                  className={`py-3 px-8 rounded-md text-white transition-all duration-200 ${hasUnsavedChanges ? "bg-blue-700 hover:bg-blue-500" : "bg-gray-300 cursor-not-allowed"}`}
                  onClick={handlePublish}
                  disabled={!hasUnsavedChanges}
               >
                  Publish
               </button>
            </div>
         </div>
         <div className="flex flex-row justify-between w-11/12 mx-auto mt-6 text-white">
            <div className="flex space-x-10">
               <Link
                  className={`cursor-pointer text-md font-medium py-1 px-6 border-b-4 ${
                  pathName.split("/")[6] === detailsLink.split("/")[6] ? "border-blue-600" : "border-transparent"
                  } hover:text-blue-600`}
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
            <div className="relative inline-block" ref={dropdownRef}>
               <div
                  onClick={toggleDropdown}
                  className="cursor-pointer px-4 py-2 text-white text-sm flex flex-row justify-between items-center space-x-4"
               >
                  <p>Preview a Page</p>
                  {showLinks ? <IoIosArrowUp /> : <IoIosArrowDown />}
               </div>
               {showLinks && (
                  <div className="absolute left-0 bg-gray-800 border border-gray-200 shadow-xs w-48 z-50">
                     {pageLinks.filter(item => item != null).map((item, index) => (
                        <a
                           key={index}
                           href={`${item?.link}preview`}
                           className="block border-b border-gray-200 px-4 py-3 text-sm text-white hover:bg-gray-700"
                        >
                           {item?.title}
                        </a>
                     ))}
                  </div>
               )}
            </div>
         </div>
         {showDropdown && (
            <div className="border-t border-gray-300 px-6 w-11/12 mx-auto py-4">
               <div className="mx-auto flex flex-row justify-center space-x-8">
                  {pageLinks.filter(item => item != null).map(item => (
                     <div key={item.title} className="flex w-52 flex-col items-center">
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
