"use client"
import { useContext } from "react"
import { HeaderPageContext } from "@/app/context/organizationPages/headerPageContext"

const StylingSection = () => {
   const { inputs, handleInputsChange } = useContext(HeaderPageContext)

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
         <h3 className="text-lg font-semibold text-gray-900 mb-4">Header Styling</h3>
         
         <div className="space-y-4">
            {/* Background Color */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
               </label>
               <div className="flex items-center space-x-3">
                  <input
                     type="color"
                     name="bgColor"
                     value={inputs.bgColor || "#FFFFFF"}
                     onChange={handleInputsChange}
                     className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                     type="text"
                     name="bgColor"
                     value={inputs.bgColor || "#FFFFFF"}
                     onChange={handleInputsChange}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="#FFFFFF"
                  />
               </div>
            </div>

            {/* Text Color */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
               </label>
               <div className="flex items-center space-x-3">
                  <input
                     type="color"
                     name="textColor"
                     value={inputs.textColor || "#000000"}
                     onChange={handleInputsChange}
                     className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                     type="text"
                     name="textColor"
                     value={inputs.textColor || "#000000"}
                     onChange={handleInputsChange}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="#000000"
                  />
               </div>
            </div>

            {/* Accent Color */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color (for buttons)
               </label>
               <div className="flex items-center space-x-3">
                  <input
                     type="color"
                     name="accentColor"
                     value={inputs.accentColor || "#3B82F6"}
                     onChange={handleInputsChange}
                     className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                     type="text"
                     name="accentColor"
                     value={inputs.accentColor || "#3B82F6"}
                     onChange={handleInputsChange}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="#3B82F6"
                  />
               </div>
            </div>

            {/* Header Height */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header Height
               </label>
               <input
                  type="text"
                  name="headerHeight"
                  value={inputs.headerHeight || "80px"}
                  onChange={handleInputsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 80px"
               />
            </div>

            {/* Font Size */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
               </label>
               <input
                  type="text"
                  name="fontSize"
                  value={inputs.fontSize || "16px"}
                  onChange={handleInputsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 16px"
               />
            </div>

            {/* Font Weight */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Weight
               </label>
               <select
                  name="fontWeight"
                  value={inputs.fontWeight || "500"}
                  onChange={handleInputsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                  <option value="300">Light (300)</option>
                  <option value="400">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semi Bold (600)</option>
                  <option value="700">Bold (700)</option>
               </select>
            </div>

            {/* Border Bottom Toggle */}
            <div className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700">
                  Show Border Bottom
               </label>
               <input
                  type="checkbox"
                  name="borderBottom"
                  checked={inputs.borderBottom !== false}
                  onChange={(e) => handleInputsChange({ target: { name: 'borderBottom', value: e.target.checked } })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
            </div>

            {/* Border Color */}
            {inputs.borderBottom !== false && (
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Border Color
                  </label>
                  <div className="flex items-center space-x-3">
                     <input
                        type="color"
                        name="borderColor"
                        value={inputs.borderColor || "#E5E7EB"}
                        onChange={handleInputsChange}
                        className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                     />
                     <input
                        type="text"
                        name="borderColor"
                        value={inputs.borderColor || "#E5E7EB"}
                        onChange={handleInputsChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#E5E7EB"
                     />
                  </div>
               </div>
            )}

            {/* Shadow Toggle */}
            <div className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700">
                  Show Shadow
               </label>
               <input
                  type="checkbox"
                  name="shadow"
                  checked={inputs.shadow !== false}
                  onChange={(e) => handleInputsChange({ target: { name: 'shadow', value: e.target.checked } })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
            </div>
         </div>
      </div>
   )
}

export default StylingSection
