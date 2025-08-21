"use client"
import { useContext } from "react"
import { FooterPageContext } from "@/app/context/organizationPages/footerPageContext"

const FooterDesignPage = () => {
   const { inputs, handleInputsChange, sections } = useContext(FooterPageContext)

   return (
      <div className="space-y-6">
         <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Design Settings</h3>
            <p className="text-gray-600">
               Customize the appearance and layout of your organization's footer. 
               Changes will be reflected in the preview on the right.
            </p>
         </div>
         
         {/* Layout Options */}
         <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout Options</h3>
            <div className="space-y-4">
               {/* Footer Layout */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Footer Layout
                  </label>
                  <select
                     name="footerLayout"
                     value={inputs.footerLayout || "three-column"}
                     onChange={handleInputsChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                     <option value="simple">Simple (Single Column)</option>
                     <option value="two-column">Two Column</option>
                     <option value="three-column">Three Column</option>
                     <option value="four-column">Four Column</option>
                  </select>
               </div>

               {/* Content Alignment */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Content Alignment
                  </label>
                  <select
                     name="contentAlignment"
                     value={inputs.contentAlignment || "left"}
                     onChange={handleInputsChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                     <option value="left">Left</option>
                     <option value="center">Center</option>
                     <option value="right">Right</option>
                  </select>
               </div>

               {/* Social Media Position */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Social Media Position
                  </label>
                  <select
                     name="socialPosition"
                     value={inputs.socialPosition || "bottom"}
                     onChange={handleInputsChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                     <option value="top">Top</option>
                     <option value="bottom">Bottom</option>
                     <option value="sidebar">Sidebar</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Styling Options */}
         <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Styling Options</h3>
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
                        value={inputs.bgColor || "#1F2937"}
                        onChange={handleInputsChange}
                        className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                     />
                     <input
                        type="text"
                        name="bgColor"
                        value={inputs.bgColor || "#1F2937"}
                        onChange={handleInputsChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#1F2937"
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
                        value={inputs.textColor || "#FFFFFF"}
                        onChange={handleInputsChange}
                        className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                     />
                     <input
                        type="text"
                        name="textColor"
                        value={inputs.textColor || "#FFFFFF"}
                        onChange={handleInputsChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#FFFFFF"
                     />
                  </div>
               </div>

               {/* Link Color */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Link Color
                  </label>
                  <div className="flex items-center space-x-3">
                     <input
                        type="color"
                        name="linkColor"
                        value={inputs.linkColor || "#60A5FA"}
                        onChange={handleInputsChange}
                        className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                     />
                     <input
                        type="text"
                        name="linkColor"
                        value={inputs.linkColor || "#60A5FA"}
                        onChange={handleInputsChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#60A5FA"
                     />
                  </div>
               </div>

               {/* Footer Height */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Footer Height
                  </label>
                  <input
                     type="text"
                     name="footerHeight"
                     value={inputs.footerHeight || "auto"}
                     onChange={handleInputsChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="e.g., auto, 300px"
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
                     value={inputs.fontSize || "14px"}
                     onChange={handleInputsChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="e.g., 14px"
                  />
               </div>

               {/* Border Top Toggle */}
               <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                     Show Border Top
                  </label>
                  <input
                     type="checkbox"
                     name="borderTop"
                     checked={inputs.borderTop !== false}
                     onChange={(e) => handleInputsChange({ target: { name: 'borderTop', value: e.target.checked } })}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
               </div>

               {/* Border Color */}
               {inputs.borderTop !== false && (
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Border Color
                     </label>
                     <div className="flex items-center space-x-3">
                        <input
                           type="color"
                           name="borderColor"
                           value={inputs.borderColor || "#374151"}
                           onChange={handleInputsChange}
                           className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <input
                           type="text"
                           name="borderColor"
                           value={inputs.borderColor || "#374151"}
                           onChange={handleInputsChange}
                           className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           placeholder="#374151"
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
      </div>
   )
}

export default FooterDesignPage
