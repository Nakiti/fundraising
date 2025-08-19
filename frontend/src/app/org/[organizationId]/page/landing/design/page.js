"use client"
import { useContext } from "react"
import { LandingPageContext } from "@/app/context/organizationPages/landingPageContext"
import { FaPalette, FaFont, FaImage, FaMousePointer, FaRuler, FaLayerGroup, FaEye, FaToggleOn, FaToggleOff } from "react-icons/fa"

const LandingPageDesign = () => {
   const {inputs, handleInputsChange} = useContext(LandingPageContext)

   const colorGroups = [
      {
         title: "Text Colors",
         icon: <FaFont className="w-4 h-4" />,
         colors: [
            { name: "p_color", label: "Primary Text Color", description: "Main text color for headings and important content" },
            { name: "s_color", label: "Secondary Text Color", description: "Color for body text and secondary content" },
            { name: "ct_color", label: "Card Text Color", description: "Text color used within cards and containers" }
         ]
      },
      {
         title: "Background Colors",
         icon: <FaImage className="w-4 h-4" />,
         colors: [
            { name: "bg_color", label: "Background Color", description: "Main background color for the page" },
            { name: "c_color", label: "Campaign Card Color", description: "Background color for campaign cards" }
         ]
      },
      {
         title: "Button Styles",
         icon: <FaMousePointer className="w-4 h-4" />,
         colors: [
            { name: "b_color", label: "Button Background Color", description: "Background color for buttons" },
            { name: "bt_color", label: "Button Text Color", description: "Text color for button text" }
         ]
      }
   ]

   const layoutOptions = [
      {
         name: "heroHeight",
         label: "Hero Section Height",
         type: "range",
         min: "300",
         max: "800",
         step: "50",
         defaultValue: "500",
         description: "Adjust the height of the main banner section"
      },
      {
         name: "sectionPadding",
         label: "Section Padding",
         type: "range",
         min: "40",
         max: "120",
         step: "20",
         defaultValue: "80",
         description: "Spacing between sections"
      },
      {
         name: "cardRadius",
         label: "Card Border Radius",
         type: "range",
         min: "0",
         max: "16",
         step: "2",
         defaultValue: "4",
         description: "Rounded corners for cards and containers"
      },
      {
         name: "buttonRadius",
         label: "Button Border Radius",
         type: "range",
         min: "0",
         max: "12",
         step: "2",
         defaultValue: "4",
         description: "Rounded corners for buttons"
      }
   ]

   const fontSizeOptions = [
      {
         name: "heroTitleSize",
         label: "Hero Title Size",
         type: "range",
         min: "24",
         max: "64",
         step: "2",
         defaultValue: "36",
         description: "Size of the main hero title"
      },
      {
         name: "heroSubtitleSize",
         label: "Hero Subtitle Size",
         type: "range",
         min: "14",
         max: "24",
         step: "1",
         defaultValue: "16",
         description: "Size of the hero subtitle/description"
      },
      {
         name: "sectionTitleSize",
         label: "Section Title Size",
         type: "range",
         min: "20",
         max: "48",
         step: "2",
         defaultValue: "28",
         description: "Size of section headings"
      },
      {
         name: "bodyTextSize",
         label: "Body Text Size",
         type: "range",
         min: "12",
         max: "18",
         step: "1",
         defaultValue: "14",
         description: "Size of body text and descriptions"
      },
      {
         name: "buttonTextSize",
         label: "Button Text Size",
         type: "range",
         min: "12",
         max: "18",
         step: "1",
         defaultValue: "14",
         description: "Size of button text"
      },
      {
         name: "cardTitleSize",
         label: "Card Title Size",
         type: "range",
         min: "14",
         max: "24",
         step: "1",
         defaultValue: "18",
         description: "Size of card titles"
      }
   ]

   const visualOptions = [
      {
         name: "overlayOpacity",
         label: "Hero Overlay Opacity",
         type: "range",
         min: "0.1",
         max: "0.8",
         step: "0.1",
         defaultValue: "0.3",
         description: "Darkness of the overlay on hero images"
      },
      {
         name: "accentColor",
         label: "Accent Color",
         type: "color",
         defaultValue: "#1F2937",
         description: "Primary accent color for highlights"
      }
   ]

   const toggleOptions = [
      {
         name: "showVideoButton",
         label: "Show Video Button",
         description: "Display the 'Watch Video' button in the hero section",
         defaultValue: true
      },
      {
         name: "showHeroIcons",
         label: "Show Hero Icons",
         description: "Display icons in the hero section buttons",
         defaultValue: true
      },
      {
         name: "showFeatureIcons",
         label: "Show Feature Icons",
         description: "Display icons in the features section",
         defaultValue: true
      },
      {
         name: "showCampaignBadges",
         label: "Show Campaign Badges",
         description: "Display status badges on campaign cards",
         defaultValue: true
      },
      {
         name: "showTrustBadge",
         label: "Show Trust Badge",
         description: "Display the trust badge on the about section image",
         defaultValue: true
      },
      {
         name: "showProgressIndicators",
         label: "Show Progress Indicators",
         description: "Display progress indicators on campaign cards",
         defaultValue: true
      },
      {
         name: "showStatistics",
         label: "Show Statistics",
         description: "Display statistics in the about and impact sections",
         defaultValue: true
      },
      {
         name: "showHoverEffects",
         label: "Show Hover Effects",
         description: "Enable hover animations and effects",
         defaultValue: true
      }
   ]

   const handleToggleChange = (name) => {
      handleInputsChange({
         target: {
            name,
            value: !inputs[name]
         }
      })
   }

   return (
      <div className="w-full space-y-4">
         <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Design Customization</h2>
            <p className="text-xs text-gray-500">Customize the colors, layout, typography, and styling of your landing page</p>
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

         {/* Typography Customization */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-4">
               <div className="p-1.5 bg-green-50" style={{borderRadius: "4px"}}>
                  <FaFont className="w-3 h-3 text-green-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Typography & Font Sizes</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {fontSizeOptions.map((option, index) => (
                  <div key={index} className="space-y-2">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                           {option.label}
                        </label>
                        <span className="text-xs font-mono text-gray-400">
                           {inputs[option.name] || option.defaultValue}px
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
                        value={inputs[option.name] || option.defaultValue}
                        onChange={handleInputsChange}
                     />
                     <p className="text-xs text-gray-400">{option.description}</p>
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
                           {inputs[option.name] || option.defaultValue}{option.type === 'range' ? 'px' : ''}
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
                        value={inputs[option.name] || option.defaultValue}
                        onChange={handleInputsChange}
                     />
                     <p className="text-xs text-gray-400">{option.description}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* Visual Effects */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-4">
               <div className="p-1.5 bg-purple-50" style={{borderRadius: "4px"}}>
                  <FaEye className="w-3 h-3 text-purple-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Visual Effects</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {visualOptions.map((option, index) => (
                  <div key={index} className="space-y-2">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                           {option.label}
                        </label>
                        {option.type === 'color' && (
                           <div className="relative">
                              <input 
                                 type="color" 
                                 className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                                 style={{borderRadius: "4px"}}
                                 name={option.name}
                                 value={inputs[option.name] || option.defaultValue}
                                 onChange={handleInputsChange}
                              />
                              <div 
                                 className="w-6 h-6 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors duration-200" 
                                 style={{ 
                                    backgroundColor: inputs[option.name] || option.defaultValue,
                                    borderRadius: "4px"
                                 }}
                              />
                           </div>
                        )}
                        {option.type === 'range' && (
                           <span className="text-xs font-mono text-gray-400">
                              {inputs[option.name] || option.defaultValue}
                           </span>
                        )}
                     </div>
                     {option.type === 'range' && (
                        <input 
                           type="range"
                           className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer"
                           style={{borderRadius: "2px"}}
                           name={option.name}
                           min={option.min}
                           max={option.max}
                           step={option.step}
                           value={inputs[option.name] || option.defaultValue}
                           onChange={handleInputsChange}
                        />
                     )}
                     <p className="text-xs text-gray-400">{option.description}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* Element Toggles */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-4">
               <div className="p-1.5 bg-orange-50" style={{borderRadius: "4px"}}>
                  <FaToggleOn className="w-3 h-3 text-orange-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Element Visibility</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {toggleOptions.map((option, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-200" style={{borderRadius: "4px"}}>
                     <div className="flex-1">
                        <label className="text-xs font-medium text-gray-700 cursor-pointer">
                           {option.label}
                        </label>
                        <p className="text-xs text-gray-400 mt-0.5">{option.description}</p>
                     </div>
                     <button
                        onClick={() => handleToggleChange(option.name)}
                        className="ml-3 p-1 hover:bg-gray-200 transition-colors duration-200"
                        style={{borderRadius: "4px"}}
                     >
                        {inputs[option.name] !== false ? (
                           <FaToggleOn className="w-4 h-4 text-green-500" />
                        ) : (
                           <FaToggleOff className="w-4 h-4 text-gray-400" />
                        )}
                     </button>
                  </div>
               ))}
            </div>
         </div>

         {/* Color Preview Section */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Color Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {Object.entries(inputs).filter(([key]) => key.includes('color')).map(([key, value]) => (
                  <div key={key} className="text-center">
                     <div 
                        className="w-full h-12 mb-1.5 border border-gray-200"
                        style={{ 
                           backgroundColor: value,
                           borderRadius: "4px"
                        }}
                     />
                     <p className="text-xs font-medium text-gray-700 capitalize">
                        {key.replace('_', ' ')}
                     </p>
                     <p className="text-xs text-gray-400 font-mono">{value}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* Layout Preview */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Layout Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {layoutOptions.map((option, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 border border-gray-100" style={{borderRadius: "4px"}}>
                     <div className="text-sm font-semibold text-blue-600 mb-1">
                        {inputs[option.name] || option.defaultValue}{option.type === 'range' ? 'px' : ''}
                     </div>
                     <div className="text-xs text-gray-500">{option.label}</div>
                  </div>
               ))}
            </div>
         </div>

         {/* Typography Preview */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Typography Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {fontSizeOptions.map((option, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 border border-gray-100" style={{borderRadius: "4px"}}>
                     <div className="text-sm font-semibold text-green-600 mb-1">
                        {inputs[option.name] || option.defaultValue}px
                     </div>
                     <div className="text-xs text-gray-500">{option.label}</div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default LandingPageDesign