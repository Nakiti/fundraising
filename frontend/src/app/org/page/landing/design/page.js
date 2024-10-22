"use client"
import { useContext } from "react"
import { LandingPageContext } from "@/app/context/landingPageContext"

const LandingPageDesign = () => {
   const {inputs, handleInputsChange} = useContext(LandingPageContext)

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

            
            <div className="mb-4">
               <p className="text-xs font-bold text-gray-600 mb-2">Card Text Color</p>
               
               <div className="relative">
                  <input 
                     type="color" 
                     className="opacity-0 absolute inset-0 w-4 h-4 cursor-pointer"
                     name="ct_color"
                     value={inputs.ct_color}
                     onChange={handleInputsChange}
                  />
                  <div 
                     className="w-6 h-6 rounded-full border border-gray-800 cursor-pointer"
                     style={{ backgroundColor: inputs.ct_color }}  
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

               <div className="mb-4">
                  <p className="text-xs font-bold text-gray-600 mb-2">Campaign Card Color</p>
                  
                  <div className="relative">
                     <input 
                        type="color" 
                        className="opacity-0 absolute inset-0 w-4 h-4 cursor-pointer"
                        name="c_color"
                        value={inputs.c_color}
                        onChange={handleInputsChange}
                     />
                     <div 
                        className="w-6 h-6 rounded-full border border-gray-800 cursor-pointer"
                        style={{ backgroundColor: inputs.c_color }}  
                     />
                  </div>
               </div>
            </div>

            <div className="mb-8">
               <p className="text-gray-800 text-md font-semibold py-1 border-b-2 border-gray-300 mb-2">Manage Button Styles</p>

               <div className="mb-4">
                  <p className="text-xs font-bold text-gray-600 mb-2">Button Background Color</p>
                  
                  <div className="relative">
                     <input 
                        type="color" 
                        className="opacity-0 absolute inset-0 w-4 h-4 cursor-pointer"
                        name="b_color"
                        value={inputs.b_color}
                        onChange={handleInputsChange}
                     />
                     <div 
                        className="w-6 h-6 rounded-full border border-gray-800 cursor-pointer"
                        style={{ backgroundColor: inputs.b_color }}  
                     />
                  </div>
               </div>

               <div className="mb-4">
                  <p className="text-xs font-bold text-gray-600 mb-2">Button Text Color</p>
                  
                  <div className="relative">
                     <input 
                        type="color" 
                        className="opacity-0 absolute inset-0 w-4 h-4 cursor-pointer"
                        name="bt_color"
                        value={inputs.bt_color}
                        onChange={handleInputsChange}
                     />
                     <div 
                        className="w-6 h-6 rounded-full border border-gray-800 cursor-pointer"
                        style={{ backgroundColor: inputs.bt_color }}  
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default LandingPageDesign