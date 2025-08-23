"use client"
import { useContext } from "react"
import { FooterPageContext } from "@/app/context/organizationPages/footerPageContext"
import { FaPalette, FaFont, FaImage, FaMousePointer, FaRuler, FaLayerGroup, FaEye, FaToggleOn, FaToggleOff } from "react-icons/fa"

const FooterDesignPage = () => {
   const { inputs, handleInputsChange } = useContext(FooterPageContext)

   const colorGroups = [
      {
         title: "Background Colors",
         icon: <FaImage className="w-3 h-3" />,
         colors: [
            { name: "bgColor", label: "Background Color", description: "Main background color for the footer" },
            { name: "borderColor", label: "Border Color", description: "Color for footer borders and dividers" }
         ]
      },
      {
         title: "Text Colors",
         icon: <FaFont className="w-3 h-3" />,
         colors: [
            { name: "textColor", label: "Text Color", description: "Main text color for footer content" }
         ]
      }
   ]

   const typographyOptions = [
      {
         name: "fontSize",
         label: "Font Size",
         type: "range",
         min: "12",
         max: "20",
         step: "1",
         defaultValue: "14",
         description: "Base font size for footer text"
      }
   ]

   const toggleOptions = [
      {
         name: "borderTop",
         label: "Show Top Border",
         description: "Add a border at the top of the footer"
      },
      {
         name: "shadow",
         label: "Show Shadow",
         description: "Add a subtle shadow to the footer"
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
                                 value={inputs[color.name] || (color.name === "textColor" ? "#FFFFFF" : "#1F2937")}
                                 onChange={handleInputsChange}
                              />
                              <div 
                                 className="w-6 h-6 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors duration-200" 
                                 style={{ 
                                    backgroundColor: inputs[color.name] || (color.name === "textColor" ? "#FFFFFF" : "#1F2937"),
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
               {typographyOptions.map((option, index) => (
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

         {/* Element Toggles */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-4">
               <div className="p-1.5 bg-orange-50" style={{borderRadius: "4px"}}>
                  <FaToggleOn className="w-3 h-3 text-orange-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Visual Effects</h3>
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
      </div>
   )
}

export default FooterDesignPage
