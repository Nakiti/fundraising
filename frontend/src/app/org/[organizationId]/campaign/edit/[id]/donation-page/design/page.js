"use client"
import { useContext } from "react"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";
import { updateDonationPage } from "@/app/services/updateServices";
import { FaPalette, FaFont, FaMousePointer, FaRuler, FaSave, FaImage } from "react-icons/fa";

const Design = () => {
   const {campaignId, donationPageInputs, handleDonationPageInputsChange} = useContext(DonationPageContext)
   
   const handleSave = async() => {
      try {
         await updateDonationPage(campaignId, donationPageInputs)
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
            { name: "bg_color", label: "Background Color", description: "Main background color for the page" }
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
      }
   ]

   return (
      <div className="w-full space-y-4">
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
                                 value={donationPageInputs[color.name]}
                                 onChange={handleDonationPageInputsChange}
                              />
                              <div 
                                 className="w-6 h-6 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors duration-200" 
                                 style={{ 
                                    backgroundColor: donationPageInputs[color.name],
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
                           {donationPageInputs[option.name] || option.defaultValue}px
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
                        value={donationPageInputs[option.name] || option.defaultValue}
                        onChange={handleDonationPageInputsChange}
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
                           {donationPageInputs[option.name] || option.defaultValue}{option.type === 'range' ? 'px' : ''}
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
                        value={donationPageInputs[option.name] || option.defaultValue}
                        onChange={handleDonationPageInputsChange}
                     />
                     {/* <p className="text-xs text-gray-400">{option.description}</p> */}
                  </div>
               ))}
            </div>
         </div>

         {/* Visual Effects */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-4">
               <div className="p-1.5 bg-purple-50" style={{borderRadius: "4px"}}>
                  <FaImage className="w-3 h-3 text-purple-600" />
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
                        <span className="text-xs font-mono text-gray-400">
                           {donationPageInputs[option.name] || option.defaultValue}
                        </span>
                     </div>
                     <input 
                        type="range"
                        className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer"
                        style={{borderRadius: "2px"}}
                        name={option.name}
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        value={donationPageInputs[option.name] || option.defaultValue}
                        onChange={handleDonationPageInputsChange}
                     />
                     {/* <p className="text-xs text-gray-400">{option.description}</p> */}
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