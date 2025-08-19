"use client"
import { useContext } from "react";
import { AboutPageContext } from "@/app/context/organizationPages/aboutPageContext"
import { FaInfoCircle } from "react-icons/fa";

const WhySection = () => {
   const { inputs, handleInputsChange } = useContext(AboutPageContext);

   return (
      <div className="space-y-4">

         {/* Why Text */}
         <div className="space-y-2 mt-4">
            <label className="block text-xs font-medium text-gray-700">
               Why We Do It Text <span className="text-red-500">*</span>
            </label>
            <textarea 
               className="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
               style={{borderRadius: "4px"}}
               rows={4}
               placeholder="Explain why your organization exists and what drives your mission..."
               name="whyText"
               value={inputs.whyText}
               onChange={handleInputsChange} 
            />
            <p className="text-xs text-gray-400">This content will appear in the "Why We Do It" section</p>
         </div>
      </div>
   )
}

export default WhySection