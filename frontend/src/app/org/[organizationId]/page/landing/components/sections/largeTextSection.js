import { useContext, useState } from "react";
import { LandingPageContext } from "@/app/context/organizationPages/landingPageContext"
import { FaFont } from "react-icons/fa";

const LargeTextSection = () => {

   const {inputs, handleInputsChange} = useContext(LandingPageContext)

   return (
      <div className="space-y-4">

         {/* Headline Input */}
         <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
               Headline <span className="text-red-500">*</span>
            </label>
            <textarea 
               className="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
               style={{borderRadius: "4px"}}
               rows={2}
               placeholder="Enter your main headline"
               name="mainHeadline"
               value={inputs.mainHeadline}
               onChange={handleInputsChange} 
            />
            <p className="text-xs text-gray-400">This will be the main heading for your content section</p>
         </div>

         {/* Main Text Input */}
         <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
               Main Text <span className="text-red-500">*</span>
            </label>
            <textarea 
               className="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
               style={{borderRadius: "4px"}}
               rows={8}
               placeholder="Enter your main content text"
               name="mainText"
               value={inputs.mainText}
               onChange={handleInputsChange} 
            />
            <p className="text-xs text-gray-400">This content will appear in the main section of your landing page</p>
         </div>
      </div>
   )
}

export default LargeTextSection