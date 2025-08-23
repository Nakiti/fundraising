"use client"
import { useContext, useState } from "react"
import { PageUpdateService } from "@/app/services/updateServices"
import { PageService } from "@/app/services/fetchService"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"
import { FaPalette, FaFont, FaSave, FaRuler, FaMousePointer, FaUndo } from "react-icons/fa";

const Design = () => {
   const {campaignId, thankPageInputs, handleThankInputsChange, thankPageSections, setThankPageInputs} = useContext(ThankYouPageContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const [isLoading, setIsLoading] = useState(false)
   const [isDiscarding, setIsDiscarding] = useState(false)
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

   const handleDiscard = async() => {
      setIsDiscarding(true)
      setError(false)
      setSuccessMessage("")
      
      try {
         const thankYouResponse = await PageService.getThankYouPage(campaignId)
         
         setThankPageInputs({
            // Basic Content
            headline: thankYouResponse.headline || "",
            description: thankYouResponse.description || "",
            
            // Images
            bg_image: thankYouResponse.bg_image || "",
            
            // Colors
            bg_color: thankYouResponse.bg_color || "#ffffff",
            p_color: thankYouResponse.p_color || "#1f2937",
            s_color: thankYouResponse.s_color || "#6b7280",
            b1_color: thankYouResponse.b1_color || "#3b82f6",
            bt_color: thankYouResponse.bt_color || "#ffffff",
            
            // Typography
            heroTitleSize: thankYouResponse.heroTitleSize || "36",
            bodyTextSize: thankYouResponse.bodyTextSize || "16",
            buttonTextSize: thankYouResponse.buttonTextSize || "14",
            
            // Layout
            cardRadius: thankYouResponse.cardRadius || "4",
            buttonRadius: thankYouResponse.buttonRadius || "4",
         })
         
         setSuccessMessage("Design reverted to last saved state!")
         setTimeout(() => setSuccessMessage(""), 3000)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      } finally {
         setIsDiscarding(false)
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
      },
      {
         title: "Button Styles",
         icon: <FaMousePointer className="w-4 h-4" />,
         colors: [
            { name: "b1_color", label: "Primary Button Color", description: "Background color for the primary action button" },
            { name: "bt_color", label: "Button Text Color", description: "Text color for button text" }
         ]
      }
   ]

   const typographyControls = [
      { name: "heroTitleSize", label: "Hero Title Size", description: "Size of the main thank you heading", min: "24", max: "64", step: "2", defaultValue: "36" },
      { name: "bodyTextSize", label: "Body Text Size", description: "Size of description and body text", min: "12", max: "18", step: "1", defaultValue: "16" },
      { name: "buttonTextSize", label: "Button Text Size", description: "Size of button text", min: "12", max: "18", step: "1", defaultValue: "14" }
   ]

   const layoutControls = [
      { name: "cardRadius", label: "Card Border Radius", description: "Border radius for cards and containers", min: "0", max: "16", step: "2", defaultValue: "4" },
      { name: "buttonRadius", label: "Button Border Radius", description: "Border radius for buttons", min: "0", max: "12", step: "2", defaultValue: "4" }
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
                  <div key={index} className="space-y-2">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                           {control.label}
                        </label>
                        <span className="text-xs font-mono text-gray-400">
                           {thankPageInputs[control.name] || control.defaultValue}px
                        </span>
                     </div>
                     <input 
                        type="range"
                        className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer"
                        style={{borderRadius: "2px"}}
                        name={control.name}
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={thankPageInputs[control.name] || control.defaultValue}
                        onChange={handleThankInputsChange}
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
                  <div key={index} className="space-y-2">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                           {control.label}
                        </label>
                        <span className="text-xs font-mono text-gray-400">
                           {thankPageInputs[control.name] || control.defaultValue}px
                        </span>
                     </div>
                     <input 
                        type="range"
                        className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer"
                        style={{borderRadius: "2px"}}
                        name={control.name}
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={thankPageInputs[control.name] || control.defaultValue}
                        onChange={handleThankInputsChange}
                     />
                     {/* <p className="text-xs text-gray-400">{control.description}</p> */}
                  </div>
               ))}
            </div>
         </div>

         {/* Save and Discard Actions */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-sm font-medium text-gray-900">Actions</h3>
                  {successMessage && (
                     <p className="text-xs text-green-600 mt-1">{successMessage}</p>
                  )}
               </div>
               <div className="flex items-center space-x-3">
                  <button 
                     className={`px-4 py-2 rounded-lg shadow-sm text-sm font-medium flex items-center space-x-2 transition-colors duration-200 ${
                        isDiscarding 
                           ? 'bg-gray-400 text-white cursor-not-allowed' 
                           : 'bg-gray-500 text-white hover:bg-gray-600'
                     }`}
                     onClick={handleDiscard}
                     disabled={isDiscarding || isLoading}
                  >
                     <FaUndo className="w-3 h-3" />
                     <span>{isDiscarding ? 'Discarding...' : 'Discard'}</span>
                  </button>
                  <button 
                     className={`px-6 py-2 rounded-lg shadow-sm text-sm font-medium flex items-center space-x-2 transition-colors duration-200 ${
                        isLoading 
                           ? 'bg-gray-400 text-white cursor-not-allowed' 
                           : 'bg-blue-600 text-white hover:bg-blue-700'
                     }`}
                     onClick={handleSave}
                     disabled={isLoading || isDiscarding}
                  >
                     <FaSave className="w-4 h-4" />
                     <span>{isLoading ? 'Saving...' : 'Save'}</span>
                  </button>
               </div>
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