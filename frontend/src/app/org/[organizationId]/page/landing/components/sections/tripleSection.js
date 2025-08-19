import { useContext, useState } from "react";
import { LandingPageContext } from "@/app/context/organizationPages/landingPageContext"
import useImageUpload from "@/app/hooks/useImageUpload";
import { FaUpload, FaLayerGroup } from "react-icons/fa";

const TripleSection = () => {
   const {inputs, handleInputsChange} = useContext(LandingPageContext)
   const {handleImageUpload} = useImageUpload()

   const renderSection = (sectionNumber) => {
      const headlineKey = `headline${sectionNumber === 1 ? 'One' : sectionNumber === 2 ? 'Two' : 'Three'}`
      const descriptionKey = `description${sectionNumber === 1 ? 'One' : sectionNumber === 2 ? 'Two' : 'Three'}`
      const imageKey = `image${sectionNumber === 1 ? 'One' : sectionNumber === 2 ? 'Two' : 'Three'}`

      return (
         <div key={sectionNumber} className="space-y-3 p-3 bg-gray-50 border border-gray-100" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-2">
               <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
               <h4 className="text-xs font-medium text-gray-700">Section {sectionNumber}</h4>
            </div>
            
            {/* Headline */}
            <div className="space-y-1">
               <label className="block text-xs font-medium text-gray-700">
                  Headline <span className="text-red-500">*</span>
               </label>
               <textarea 
                  className="w-full px-2 py-1.5 border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
                  style={{borderRadius: "4px"}}
                  rows={2}
                  placeholder="Enter headline"
                  name={headlineKey}
                  value={inputs[headlineKey]}
                  onChange={handleInputsChange} 
               />
            </div>

            {/* Description */}
            <div className="space-y-1">
               <label className="block text-xs font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
               </label>
               <textarea 
                  className="w-full px-2 py-1.5 border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
                  style={{borderRadius: "4px"}}
                  rows={3}
                  placeholder="Enter description"
                  name={descriptionKey}
                  value={inputs[descriptionKey]}
                  onChange={handleInputsChange} 
               />
            </div>

            {/* Image Upload */}
            <div className="space-y-1">
               <label className="block text-xs font-medium text-gray-700">
                  Image <span className="text-red-500">*</span>
               </label>
               <label className="flex flex-col items-center justify-center w-full h-16 border border-dashed border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200" style={{borderRadius: "4px"}}>
                  <div className="flex flex-col items-center justify-center">
                     <FaUpload className="w-3 h-3 text-gray-400 mb-0.5" />
                     <p className="text-xs text-gray-500">Click to upload</p>
                  </div>
                  <input 
                     type="file"
                     className="hidden" 
                     name={imageKey}
                     accept="image/*"
                     onChange={handleImageUpload}
                  />
               </label>
            </div>
         </div>
      )
   }

   return (
      <div className="space-y-4">

         {/* Sections */}
         <div className="space-y-3">
            {[1, 2, 3].map(sectionNumber => renderSection(sectionNumber))}
         </div>
      </div>
   )
}

export default TripleSection