"use client"
import { useContext } from "react"
import { updateThankYouPage } from "@/app/services/updateServices"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"

const DesignInputs = () => {
   const {thankPageInputs, handleThankInputsChange, campaignId} = useContext(ThankYouPageContext)

   const handleSave = async() => {
      try {
         await updateThankYouPage(campaignId, thankPageInputs)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Text Color</p>
            <div className="mb-6">
               <p className="text-xs font-bold text-gray-600 mb-2">Primary Text Color</p>
               <div className="relative">
                  <input 
                     type="color" 
                     className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                     name="p_color"
                     value={thankPageInputs.p_color}
                     onChange={handleThankInputsChange}
                     style={{ backgroundColor: thankPageInputs.p_color }}  
                  />
                  <div 
                     className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer" 
                     style={{ backgroundColor: thankPageInputs.p_color }}  
                  />
               </div>
            </div>

            <div className="mb-6">
               <p className="text-xs font-bold text-gray-600 mb-2">Secondary Text Color</p>
               <div className="relative">
                  <input 
                     type="color" 
                     className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                     name="s_color"
                     value={thankPageInputs.s_color}
                     onChange={handleThankInputsChange}
                  />
                  <div 
                     className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
                     style={{ backgroundColor: thankPageInputs.s_color }}  
                  />
               </div>
            </div>
         </div>

         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Background Colors</p>
            <div className="mb-6">
               <p className="text-xs font-bold text-gray-600 mb-2">Background Color</p>
               <div className="relative">
                  <input 
                     type="color" 
                     className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                     name="bg_color"
                     value={thankPageInputs.bg_color}
                     onChange={handleThankInputsChange}
                  />
                  <div 
                     className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
                     style={{ backgroundColor: thankPageInputs.bg_color }}  
                  />
               </div>
            </div>
         </div>

         <div className="w-full flex flex-row mt-6">
            <button 
               className="bg-blue-700 px-4 py-2 w-40 rounded-md shadow-sm text-md text-white"
               onClick={handleSave}
            >
               Save
            </button>
         </div>  
      </div>
   )
}

export default DesignInputs