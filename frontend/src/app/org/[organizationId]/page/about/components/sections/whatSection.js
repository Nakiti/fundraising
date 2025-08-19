"use client"
import { useContext } from "react";
import { AboutPageContext } from "@/app/context/organizationPages/aboutPageContext"
import { FaUpload, FaInfoCircle } from "react-icons/fa";

const WhatSection = () => {
   const { inputs, handleInputsChange } = useContext(AboutPageContext);

   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = (event) => {
            handleInputsChange({
               target: {
                  name: e.target.name,
                  value: event.target.result
               }
            });
         };
         reader.readAsDataURL(file);
      }
   };

   return (
      <div className="space-y-4">

         {/* What Text */}
         <div className="space-y-2 mt-4">
            <label className="block text-xs font-medium text-gray-700">
               What We Do Text <span className="text-red-500">*</span>
            </label>
            <textarea 
               className="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
               style={{borderRadius: "4px"}}
               rows={4}
               placeholder="Describe what your organization does and the services you provide..."
               name="whatText"
               value={inputs.whatText}
               onChange={handleInputsChange} 
            />
            <p className="text-xs text-gray-400">This content will appear in the "What We Do" section</p>
         </div>

         {/* About Image Upload */}
         <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
               About Image <span className="text-red-500">*</span>
            </label>
            <div className="relative">
               <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200" style={{borderRadius: "4px"}}>
                  <div className="flex flex-col items-center justify-center">
                     <FaUpload className="w-4 h-4 text-gray-400 mb-1" />
                     <p className="text-xs text-gray-500">
                        <span className="font-medium">Click to upload</span> or drag and drop
                     </p>
                     <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input 
                     type="file"
                     className="hidden" 
                     name="aboutImage"
                     accept="image/*"
                     onChange={handleImageUpload}
                  />
               </label>
               {inputs.aboutImage && (
                  <div className="mt-2">
                     <img 
                        src={inputs.aboutImage} 
                        alt="About Preview" 
                        className="w-full h-16 object-cover border border-gray-200"
                        style={{borderRadius: "4px"}}
                     />
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

export default WhatSection