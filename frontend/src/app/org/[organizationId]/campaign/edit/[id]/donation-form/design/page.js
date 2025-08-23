"use client"
import { useContext, useState } from "react"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext";
import { PageUpdateService } from "@/app/services/updateServices";
import { PageService } from "@/app/services/fetchService";
import { AuthContext } from "@/app/context/authContext";
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"
import { FaPalette, FaFont, FaMousePointer, FaRuler, FaSave, FaUndo } from "react-icons/fa";

const Design = () => {
   const {campaignId, donationFormInputs, handleDonationFormInputsChange, donationFormSections, donationFormId, setDonationFormInputs} = useContext(DonationFormContext)
   const {currentUser} = useContext(AuthContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const [isLoading, setIsLoading] = useState(false)
   const [isDiscarding, setIsDiscarding] = useState(false)
   const [successMessage, setSuccessMessage] = useState("")
   
   const handleSave = async() => {
      if (!donationFormId) {
         setErrorMessage("Donation form not found")
         setError(true)
         return
      }
      
      setIsLoading(true)
      setError(false)
      setSuccessMessage("")
      
      try {
         // Update donation form
         await PageUpdateService.updateDonationForm(donationFormId, donationFormInputs, currentUser.id)
         
         // Update all sections in parallel (only those with valid IDs)
         const validSections = donationFormSections.filter(section => section.id && section.id > 0)
         if (validSections.length > 0) {
            const sectionPromises = validSections.map(section => 
               PageUpdateService.updatePageSection(section.id, section.active)
            )
            await Promise.all(sectionPromises)
         }
         
         setSuccessMessage("Donation form updated successfully!")
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
         const donationResponse = await PageService.getDonationForm(campaignId)
         
         setDonationFormInputs({
            // Basic Content
            headline: donationResponse.headline || "",
            description: donationResponse.description || "",
            subtitle: donationResponse.subtitle || "Donation Form",
            
            // Colors
            bg_color: donationResponse.bg_color || "#ffffff",
            p_color: donationResponse.p_color || "#1f2937",
            s_color: donationResponse.s_color || "#6b7280",
            b1_color: donationResponse.b1_color || "#3b82f6",
            b2_color: donationResponse.b2_color || "#6b7280",
            b3_color: donationResponse.b3_color || "#10b981",
            bt_color: donationResponse.bt_color || "#ffffff",
            
            // Donation Amounts
            button1: donationResponse.button1 || 25,
            button2: donationResponse.button2 || 50,
            button3: donationResponse.button3 || 100,
            button4: donationResponse.button4 || 250,
            button5: donationResponse.button5 || 500,
            button6: donationResponse.button6 || 1000,
            
            // Typography
            heroTitleSize: donationResponse.heroTitleSize || "36",
            heroSubtitleSize: donationResponse.heroSubtitleSize || "16",
            sectionTitleSize: donationResponse.sectionTitleSize || "28",
            bodyTextSize: donationResponse.bodyTextSize || "16",
            buttonTextSize: donationResponse.buttonTextSize || "16",
            
            // Layout
            cardRadius: donationResponse.cardRadius || "4",
            buttonRadius: donationResponse.buttonRadius || "4",
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
            { name: "bg_color", label: "Background Color", description: "Main background color for the form" }
         ]
      },
      {
         title: "Button Styles",
         icon: <FaMousePointer className="w-4 h-4" />,
         colors: [
            { name: "b1_color", label: "Donate Button Color", description: "Background color for the main donate button" },
            { name: "bt_color", label: "Button Text Color", description: "Text color for button text" }
         ]
      }
   ]

   const layoutOptions = [
      {
         name: "cardRadius",
         label: "Card Border Radius",
         type: "range",
         min: "0",
         max: "16",
         step: "2",
         defaultValue: "4",
         description: "Rounded corners for form cards and containers"
      },
      {
         name: "buttonRadius",
         label: "Button Border Radius",
         type: "range",
         min: "0",
         max: "12",
         step: "2",
         defaultValue: "4",
         description: "Rounded corners for buttons and inputs"
      }
   ]

   const fontSizeOptions = [
      {
         name: "heroTitleSize",
         label: "Header Title Size",
         type: "range",
         min: "24",
         max: "48",
         step: "2",
         defaultValue: "36",
         description: "Size of the main form header title"
      },
      {
         name: "sectionTitleSize",
         label: "Section Title Size",
         type: "range",
         min: "16",
         max: "24",
         step: "1",
         defaultValue: "20",
         description: "Size of section headings"
      },
      {
         name: "bodyTextSize",
         label: "Body Text Size",
         type: "range",
         min: "12",
         max: "18",
         step: "1",
         defaultValue: "16",
         description: "Size of body text and descriptions"
      },
      {
         name: "buttonTextSize",
         label: "Button Text Size",
         type: "range",
         min: "12",
         max: "18",
         step: "1",
         defaultValue: "16",
         description: "Size of button text"
      }
   ]

   return (
      <div className="w-full space-y-4">
         {/* <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Design Customization</h2>
            <p className="text-xs text-gray-500">Customize the colors, layout, and typography of your donation form</p>
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
                                 value={donationFormInputs[color.name]}
                                 onChange={handleDonationFormInputsChange}
                              />
                              <div 
                                 className="w-6 h-6 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors duration-200" 
                                 style={{ 
                                    backgroundColor: donationFormInputs[color.name],
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
            <div className="flex items-center space-x-2 mb-4">
               <div className="p-1.5 bg-green-50" style={{borderRadius: "4px"}}>
                  <FaFont className="w-3 h-3 text-green-600" />
               </div>
               {/* <h3 className="text-sm font-medium text-gray-900">Typography & Font Sizes</h3> */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {fontSizeOptions.map((option, index) => (
                  <div key={index} className="space-y-2">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                           {option.label}
                        </label>
                        <span className="text-xs font-mono text-gray-400">
                           {donationFormInputs[option.name] || option.defaultValue}px
                        </span>
                     </div>
                     <input 
                        type={option.type}
                        className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer"
                        style={{borderRadius: "2px"}}
                        name={option.name}
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        value={donationFormInputs[option.name] || option.defaultValue}
                        onChange={handleDonationFormInputsChange}
                     />
                     {/* <p className="text-xs text-gray-400">{option.description}</p> */}
                  </div>
               ))}
            </div>
         </div>

         {/* Layout Customization */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-4">
               <div className="p-1.5 bg-blue-50" style={{borderRadius: "4px"}}>
                  <FaRuler className="w-3 h-3 text-blue-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Layout & Spacing</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {layoutOptions.map((option, index) => (
                  <div key={index} className="space-y-2">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                           {option.label}
                        </label>
                        <span className="text-xs font-mono text-gray-400">
                           {donationFormInputs[option.name] || option.defaultValue}px
                        </span>
                     </div>
                     <input 
                        type={option.type}
                        className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer"
                        style={{borderRadius: "2px"}}
                        name={option.name}
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        value={donationFormInputs[option.name] || option.defaultValue}
                        onChange={handleDonationFormInputsChange}
                     />
                     {/* <p className="text-xs text-gray-400">{option.description}</p> */}
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