"use client"
import { useState, useContext } from "react"
import { AboutPageContext } from "@/app/context/aboutPageContext"

const AboutDesign = () => {
   const {inputs, handleInputsChange} = useContext(AboutPageContext)

   return (
      <div className="w-full">
         <div className="mb-8">
            <p className="text-gray-800 text-md font-semibold py-1 border-b-2 border-gray-300 mb-2">Manage Text Color</p>
            <div className="mb-4">
               <p className="text-xs font-bold text-gray-600 mb-2">Primary Text Color</p>
               <div className="relative">
                  <input 
                     type="color" 
                     className="opacity-0 absolute inset-0 w-4 h-4 cursor-pointer"
                     name="p_color"
                     value={inputs.p_color}
                     onChange={handleInputsChange}
                     style={{ backgroundColor: inputs.p_color }}  
                  />
                  <div 
                     className="w-6 h-6 rounded-full border border-gray-800 cursor-pointer" 
                     style={{ backgroundColor: inputs.p_color }}  

                  />
               </div>
            </div>

            <div className="mb-4">
               <p className="text-xs font-bold text-gray-600 mb-2">Secondary Text Color</p>
               
               <div className="relative">
                  <input 
                     type="color" 
                     className="opacity-0 absolute inset-0 w-4 h-4 cursor-pointer"
                     name="s_color"
                     value={inputs.s_color}
                     onChange={handleInputsChange}
                  />
                  <div 
                     className="w-6 h-6 rounded-full border border-gray-800 cursor-pointer"
                     style={{ backgroundColor: inputs.s_color }}  
   
                  />
               </div>
            </div>

            <div className="mb-8">
               <p className="text-gray-800 text-md font-semibold py-1 border-b-2 border-gray-300 mb-2">Manage Background Colors</p>

               <div className="mb-4">
                  <p className="text-xs font-bold text-gray-600 mb-2">Background Color</p>
                  
                  <div className="relative">
                     <input 
                        type="color" 
                        className="opacity-0 absolute inset-0 w-4 h-4 cursor-pointer"
                        name="bg_color"
                        value={inputs.bg_color}
                        onChange={handleInputsChange}
                     />
                     <div 
                        className="w-6 h-6 rounded-full border border-gray-800 cursor-pointer"
                        style={{ backgroundColor: inputs.bg_color }}  
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default AboutDesign