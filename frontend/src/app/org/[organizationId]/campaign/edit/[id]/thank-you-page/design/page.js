"use client"
import { useContext } from "react"
import { updateThankYouPage } from "@/app/services/updateServices"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import { FaPalette, FaFont, FaSave, FaRuler, FaMousePointer } from "react-icons/fa";

const Design = () => {
   const {campaignId, thankPageInputs, handleThankInputsChange} = useContext(ThankYouPageContext)

   const handleSave = async() => {
      try {
         await updateThankYouPage(campaignId, thankPageInputs)
      } catch (err) {
         console.log(err)
      }
   }

   const colorGroups = [
      {
         title: "Text Colors",
         icon: <FaFont className="w-4 h-4" />,
         colors: [
            { name: "p_color", label: "Primary Text Color", description: "Main text color for headings and important content" },
            { name: "s_color", label: "Secondary Text Color", description: "Color for body text and secondary content" }
         ]
      },
      {
         title: "Background Colors",
         icon: <FaPalette className="w-4 h-4" />,
         colors: [
            { name: "bg_color", label: "Background Color", description: "Main background color for the thank you page" }
         ]
      }
   ]

   const typographyControls = [
      { name: "heroTitleSize", label: "Hero Title Size", description: "Size of the main thank you heading", defaultValue: "36" },
      { name: "bodyTextSize", label: "Body Text Size", description: "Size of description and body text", defaultValue: "16" },
      { name: "buttonTextSize", label: "Button Text Size", description: "Size of button text", defaultValue: "14" }
   ]

   const layoutControls = [
      { name: "cardRadius", label: "Card Border Radius", description: "Border radius for cards and containers", defaultValue: "4" },
      { name: "buttonRadius", label: "Button Border Radius", description: "Border radius for buttons", defaultValue: "4" }
   ]

   return (
      <div className="w-full space-y-4">
         {/* <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Design Customization</h2>
            <p className="text-xs text-gray-500">Customize the colors, typography, and layout of your thank you page</p>
         </div> */}

         {/* Color Customization */}
         {colorGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
               <div className="flex items-center space-x-2 mb-3">
                  <div className="p-1.5 bg-gray-50" style={{borderRadius: "4px"}}>
                     {group.icon}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{group.title}</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.colors.map((color, colorIndex) => (
                     <div key={colorIndex} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                           <label className="text-xs font-medium text-gray-700">
                              {color.label}
                           </label>
                           <div className="relative">
                              <input 
                                 type="color" 
                                 className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                                 style={{borderRadius: "4px"}}
                                 name={color.name}
                                 value={thankPageInputs[color.name]}
                                 onChange={handleThankInputsChange}
                              />
                              <div 
                                 className="w-6 h-6 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors duration-200" 
                                 style={{ 
                                    backgroundColor: thankPageInputs[color.name],
                                    borderRadius: "4px"
                                 }}
                              />
                           </div>
                        </div>
                        {/* <p className="text-xs text-gray-400">{color.description}</p> */}
                     </div>
                  ))}
               </div>
            </div>
         ))}

         {/* Typography Customization */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-3">
               <div className="p-1.5 bg-gray-50" style={{borderRadius: "4px"}}>
                  <FaFont className="w-4 h-4" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Typography</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               {typographyControls.map((control, index) => (
                  <div key={index} className="space-y-1.5">
                     <label className="text-xs font-medium text-gray-700">
                        {control.label}
                     </label>
                     <input
                        type="text"
                        name={control.name}
                        value={thankPageInputs[control.name] || control.defaultValue}
                        onChange={handleThankInputsChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                        style={{borderRadius: "4px"}}
                        placeholder={control.defaultValue}
                     />
                     {/* <p className="text-xs text-gray-400">{control.description}</p> */}
                  </div>
               ))}
            </div>
         </div>

         {/* Layout Customization */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-3">
               <div className="p-1.5 bg-gray-50" style={{borderRadius: "4px"}}>
                  <FaRuler className="w-4 h-4" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Layout</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {layoutControls.map((control, index) => (
                  <div key={index} className="space-y-1.5">
                     <label className="text-xs font-medium text-gray-700">
                        {control.label}
                     </label>
                     <input
                        type="text"
                        name={control.name}
                        value={thankPageInputs[control.name] || control.defaultValue}
                        onChange={handleThankInputsChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                        style={{borderRadius: "4px"}}
                        placeholder={control.defaultValue}
                     />
                     {/* <p className="text-xs text-gray-400">{control.description}</p> */}
                  </div>
               ))}
            </div>
         </div>

         {/* Save Button */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-sm font-medium text-gray-900">Save Changes</h3>
               </div>
               <button 
                  className="bg-blue-600 px-6 py-3 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  onClick={handleSave}
               >
                  <FaSave className="w-4 h-4" />
                  <span>Save</span>
               </button>
            </div>
         </div>
      </div>
   )
}

export default Design