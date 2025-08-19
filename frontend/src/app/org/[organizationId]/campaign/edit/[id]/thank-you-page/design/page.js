"use client"
import { useContext, useState } from "react"
import { PageUpdateService } from "@/app/services/updateServices"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"
import { FaPalette, FaFont, FaSave, FaRuler, FaMousePointer } from "react-icons/fa";

const Design = () => {
   const {campaignId, thankPageInputs, handleThankInputsChange, thankPageSections} = useContext(ThankYouPageContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const [isLoading, setIsLoading] = useState(false)
   const [successMessage, setSuccessMessage] = useState("")

   const handleSave = async() => {
      setIsLoading(true)
      setError(false)
      setSuccessMessage("")
      
      try {
         // Update thank you page
         await PageUpdateService.updateThankYouPage(campaignId, thankPageInputs)
         
         // Update all sections in parallel (only those with valid IDs)
         const validSections = thankPageSections.filter(section => section.id && section.id > 0)
         if (validSections.length > 0) {
            const sectionPromises = validSections.map(section => 
               PageUpdateService.updatePageSection(section.id, section.active)
            )
            await Promise.all(sectionPromises)
         }
         
         setSuccessMessage("Thank you page updated successfully!")
         setTimeout(() => setSuccessMessage(""), 3000)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      } finally {
         setIsLoading(false)
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
                  {successMessage && (
                     <p className="text-xs text-green-600 mt-1">{successMessage}</p>
                  )}
               </div>
               <button 
                  className={`px-6 py-3 rounded-lg shadow-sm text-sm font-medium flex items-center space-x-2 transition-colors duration-200 ${
                     isLoading 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={handleSave}
                  disabled={isLoading}
               >
                  <FaSave className="w-4 h-4" />
                  <span>{isLoading ? 'Saving...' : 'Save'}</span>
               </button>
            </div>
         </div>

         {/* Error Modal */}
         {error && (
            <ErrorModal
               isOpen={error}
               onClose={() => setError(false)}
               title="Error"
               message={errorMessage}
            />
         )}
      </div>
   )
}

export default Design