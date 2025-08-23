"use client"
import { useState, useContext } from "react"
import { AboutPageContext } from "@/app/context/organizationPages/aboutPageContext"
import { PageUpdateService } from "@/app/services/updateServices"
import { PageService } from "@/app/services/fetchService"
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"
import { FaPalette, FaFont, FaRuler, FaEye, FaToggleOn, FaToggleOff, FaSave, FaUndo } from "react-icons/fa"

const AboutDesign = () => {
   const {inputs, handleInputsChange, setInputs} = useContext(AboutPageContext)
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
         await PageUpdateService.updateAboutPage(inputs.id, inputs)
         setSuccessMessage("About page updated successfully!")
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
         // Get the organization ID from the inputs or context
         const organizationId = inputs.organizationId || 1 // You may need to get this from a different source
         const response = await PageService.getAboutPage(organizationId)
         const aboutPageId = response.id
         
         setInputs({
            // Page ID for updates
            id: aboutPageId,
            
            // Content fields
            title: response.title || "",
            description: response.description || "",
            headline: response.headline || "",
            aboutText: response.aboutText || "",
            whatText: response.whatText || "",
            whyText: response.whyText || "",
            teamText: response.teamText || "",
            missionText: response.missionText || "",
            visionText: response.visionText || "",
            valuesText: response.valuesText || "",
            
            // Images
            bgImage: response.bgImage || "",
            aboutImage: response.aboutImage || "",
            teamImage: response.teamImage || "",
            missionImage: response.missionImage || "",
            visionImage: response.visionImage || "",
            valuesImage: response.valuesImage || "",
            
            // Color customization
            bg_color: response.bg_color || "#FFFFFF",
            p_color: response.p_color || "#000000",
            s_color: response.s_color || "#666666",
            c_color: response.c_color || "#FFFFFF",
            ct_color: response.ct_color || "#000000",
            b_color: response.b_color || "#1F2937",
            bt_color: response.bt_color || "#FFFFFF",
            
            // Font sizes
            heroTitleSize: response.hero_title_size || "36px",
            heroSubtitleSize: response.hero_subtitle_size || "16px",
            sectionTitleSize: response.section_title_size || "28px",
            bodyTextSize: response.body_text_size || "14px",
            buttonTextSize: response.button_text_size || "14px",
            cardTitleSize: response.card_title_size || "18px",
            
            // Layout & spacing
            heroHeight: response.hero_height || "500px",
            sectionPadding: response.section_padding || "80px",
            cardRadius: response.card_radius || "4px",
            buttonRadius: response.button_radius || "4px",
            
            // Visual effects
            overlayOpacity: response.overlay_opacity || "0.3",
            accentColor: response.accent_color || "#1F2937",
            
            // Element visibility toggles
            showVideoButton: response.show_video_button !== false,
            showHeroIcons: response.show_hero_icons !== false,
            showFeatureIcons: response.show_feature_icons !== false,
            showTeamPhotos: response.show_team_photos !== false,
            showMissionSection: response.show_mission_section !== false,
            showVisionSection: response.show_vision_section !== false,
            showValuesSection: response.show_values_section !== false,
            showHoverEffects: response.show_hover_effects !== false,
            
            // Status
            active: response.active || false
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

   // Color groups for organization
   const colorGroups = [
      {
         title: "Text Colors",
         icon: <FaPalette className="w-3 h-3 text-blue-600" />,
         colors: [
            { name: "p_color", label: "Primary Text", description: "Main text color for headings and important content" },
            { name: "s_color", label: "Secondary Text", description: "Secondary text color for descriptions and body text" },
            { name: "ct_color", label: "Card Text", description: "Text color for card content and overlays" }
         ]
      },
      {
         title: "Background Colors",
         icon: <FaPalette className="w-3 h-3 text-green-600" />,
         colors: [
            { name: "bg_color", label: "Page Background", description: "Main background color for the page" },
            { name: "c_color", label: "Card Background", description: "Background color for cards and sections" },
            { name: "b_color", label: "Button Background", description: "Background color for buttons and interactive elements" },
            { name: "bt_color", label: "Button Text", description: "Text color for buttons" }
         ]
      }
   ]

   // Layout options
   const layoutOptions = [
      { name: "heroHeight", label: "Hero Height", min: 300, max: 800, step: 10, unit: "px" },
      { name: "sectionPadding", label: "Section Padding", min: 40, max: 120, step: 10, unit: "px" },
      { name: "cardRadius", label: "Card Border Radius", min: 0, max: 16, step: 1, unit: "px" },
      { name: "buttonRadius", label: "Button Border Radius", min: 0, max: 12, step: 1, unit: "px" }
   ]

   // Visual effects options
   const visualOptions = [
      { name: "overlayOpacity", label: "Hero Overlay Opacity", min: 0, max: 0.8, step: 0.05, unit: "" },
      { name: "accentColor", label: "Accent Color", type: "color" }
   ]

   // Font size options
   const fontSizeOptions = [
      { name: "heroTitleSize", label: "Hero Title", min: 24, max: 64, step: 2, unit: "px" },
      { name: "heroSubtitleSize", label: "Hero Subtitle", min: 14, max: 24, step: 1, unit: "px" },
      { name: "sectionTitleSize", label: "Section Titles", min: 20, max: 48, step: 2, unit: "px" },
      { name: "bodyTextSize", label: "Body Text", min: 12, max: 18, step: 1, unit: "px" },
      { name: "buttonTextSize", label: "Button Text", min: 12, max: 18, step: 1, unit: "px" },
      { name: "cardTitleSize", label: "Card Titles", min: 14, max: 24, step: 1, unit: "px" }
   ]

   // Toggle options
   const toggleOptions = [
      { name: "showVideoButton", label: "Video Button", description: "Show video button in hero section" },
      { name: "showHeroIcons", label: "Hero Icons", description: "Show icons in hero section" },
      { name: "showFeatureIcons", label: "Feature Icons", description: "Show icons in feature sections" },
      { name: "showTeamPhotos", label: "Team Photos", description: "Show team member photos" },
      { name: "showMissionSection", label: "Mission Section", description: "Show mission statement section" },
      { name: "showVisionSection", label: "Vision Section", description: "Show vision statement section" },
      { name: "showValuesSection", label: "Values Section", description: "Show values section" },
      { name: "showHoverEffects", label: "Hover Effects", description: "Show hover animations and effects" }
   ]

   const handleToggleChange = (fieldName) => {
      handleInputsChange({
         target: {
            name: fieldName,
            value: !inputs[fieldName]
         }
      })
   }

   const getValueFromInput = (fieldName) => {
      const value = inputs[fieldName]
      if (typeof value === 'string' && value.includes('px')) {
         return parseInt(value)
      }
      if (typeof value === 'string' && value.includes('%')) {
         return parseFloat(value) * 100
      }
      return value
   }

   const setValueToInput = (fieldName, value, unit = '') => {
      handleInputsChange({
         target: {
            name: fieldName,
            value: value + unit
         }
      })
   }

   return (
      <div className="w-full space-y-4">
         <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Design Customization</h2>
            <p className="text-xs text-gray-500">Customize the colors, layout, typography, and styling of your about page</p>
         </div>

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
                                 value={inputs[color.name]}
                                 onChange={handleInputsChange}
                              />
                              <div 
                                 className="w-6 h-6 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors duration-200" 
                                 style={{ 
                                    backgroundColor: inputs[color.name],
                                    borderRadius: "4px"
                                 }}
                              />
                           </div>
                        </div>
                        <p className="text-xs text-gray-400">{color.description}</p>
                     </div>
                  ))}
               </div>
            </div>
         ))}

         {/* Layout & Spacing */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-3">
               <div className="p-1.5 bg-blue-50" style={{borderRadius: "4px"}}>
                  <FaRuler className="w-3 h-3 text-blue-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Layout & Spacing</h3>
            </div>
            
            <div className="space-y-3">
               {layoutOptions.map((option, index) => (
                  <div key={index} className="space-y-1.5">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                           {option.label}
                        </label>
                        <span className="text-xs text-gray-500">
                           {getValueFromInput(option.name)}{option.unit}
                        </span>
                     </div>
                     <input
                        type="range"
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        value={getValueFromInput(option.name)}
                        onChange={(e) => setValueToInput(option.name, e.target.value, option.unit)}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{borderRadius: "2px"}}
                     />
                  </div>
               ))}
            </div>
         </div>

         {/* Typography & Font Sizes */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-3">
               <div className="p-1.5 bg-purple-50" style={{borderRadius: "4px"}}>
                  <FaFont className="w-3 h-3 text-purple-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Typography & Font Sizes</h3>
            </div>
            
            <div className="space-y-3">
               {fontSizeOptions.map((option, index) => (
                  <div key={index} className="space-y-1.5">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                           {option.label}
                        </label>
                        <span className="text-xs text-gray-500">
                           {getValueFromInput(option.name)}{option.unit}
                        </span>
                     </div>
                     <input
                        type="range"
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        value={getValueFromInput(option.name)}
                        onChange={(e) => setValueToInput(option.name, e.target.value, option.unit)}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{borderRadius: "2px"}}
                     />
                  </div>
               ))}
            </div>
         </div>

         {/* Visual Effects */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-3">
               <div className="p-1.5 bg-orange-50" style={{borderRadius: "4px"}}>
                  <FaEye className="w-3 h-3 text-orange-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Visual Effects</h3>
            </div>
            
            <div className="space-y-3">
               {visualOptions.map((option, index) => (
                  <div key={index} className="space-y-1.5">
                     {option.type === 'color' ? (
                        <div className="flex items-center justify-between">
                           <label className="text-xs font-medium text-gray-700">
                              {option.label}
                           </label>
                           <div className="relative">
                              <input 
                                 type="color" 
                                 className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                                 style={{borderRadius: "4px"}}
                                 name={option.name}
                                 value={inputs[option.name]}
                                 onChange={handleInputsChange}
                              />
                              <div 
                                 className="w-6 h-6 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors duration-200" 
                                 style={{ 
                                    backgroundColor: inputs[option.name],
                                    borderRadius: "4px"
                                 }}
                              />
                           </div>
                        </div>
                     ) : (
                        <>
                           <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-gray-700">
                                 {option.label}
                              </label>
                              <span className="text-xs text-gray-500">
                                 {getValueFromInput(option.name)}
                              </span>
                           </div>
                           <input
                              type="range"
                              min={option.min}
                              max={option.max}
                              step={option.step}
                              value={getValueFromInput(option.name)}
                              onChange={(e) => setValueToInput(option.name, e.target.value, option.unit)}
                              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              style={{borderRadius: "2px"}}
                           />
                        </>
                     )}
                  </div>
               ))}
            </div>
         </div>

         {/* Element Visibility */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-3">
               <div className="p-1.5 bg-indigo-50" style={{borderRadius: "4px"}}>
                  <FaEye className="w-3 h-3 text-indigo-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Element Visibility</h3>
            </div>
            
            <div className="space-y-2">
               {toggleOptions.map((option, index) => (
                  <div key={index} className="flex items-center justify-between p-1 hover:bg-gray-50 transition-colors duration-200" style={{borderRadius: "4px"}}>
                     <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-400">{option.description}</div>
                     </div>
                     <button
                        onClick={() => handleToggleChange(option.name)}
                        className="p-1 hover:bg-gray-100 transition-colors duration-200"
                        style={{borderRadius: "4px"}}
                     >
                        {inputs[option.name] ? (
                           <FaToggleOn className="w-4 h-4 text-green-500" />
                        ) : (
                           <FaToggleOff className="w-4 h-4 text-gray-400" />
                        )}
                     </button>
                  </div>
               ))}
            </div>
         </div>

         {/* Preview Section */}
         <div className="bg-white border border-gray-100 p-3" style={{borderRadius: "4px"}}>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Design Preview</h3>
            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-2">
                  <div className="text-xs text-gray-500">Colors</div>
                  <div className="flex space-x-2">
                     <div className="w-4 h-4 border border-gray-200" style={{backgroundColor: inputs.p_color, borderRadius: "2px"}}></div>
                     <div className="w-4 h-4 border border-gray-200" style={{backgroundColor: inputs.s_color, borderRadius: "2px"}}></div>
                     <div className="w-4 h-4 border border-gray-200" style={{backgroundColor: inputs.bg_color, borderRadius: "2px"}}></div>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="text-xs text-gray-500">Typography</div>
                  <div className="text-xs font-medium text-gray-900" style={{fontSize: inputs.heroTitleSize}}>
                     Sample Title
                  </div>
               </div>
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

export default AboutDesign