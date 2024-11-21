"use client"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"

const DesignInputs = () => {

   const {donationPageInputs, handleDonationPageInputsChange} = useContext(CampaignContext)

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
                     value={donationPageInputs.p_color}
                     onChange={handleDonationPageInputsChange}
                     style={{ backgroundColor: donationPageInputs.p_color }}  
                  />
                  <div 
                     className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer" 
                     style={{ backgroundColor: donationPageInputs.p_color }}  
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
                     value={donationPageInputs.s_color}
                     onChange={handleDonationPageInputsChange}
                  />
                  <div 
                     className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
                     style={{ backgroundColor: donationPageInputs.s_color }}  
                  />
               </div>
            </div>

            <div className="mb-6">
               <p className="text-xs font-bold text-gray-600 mb-2">Amount Button Text Color</p>
               <div className="relative">
                  <input 
                     type="color" 
                     className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                     name="b1_color"
                     value={donationPageInputs.b1_color}
                     onChange={handleDonationPageInputsChange}
                  />
                  <div 
                     className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
                     style={{ backgroundColor: donationPageInputs.b1_color }}  
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
                     value={donationPageInputs.bg_color}
                     onChange={handleDonationPageInputsChange}
                  />
                  <div 
                     className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
                     style={{ backgroundColor: donationPageInputs.bg_color }}  
                  />
               </div>
            </div>
         </div>

         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Button Colors</p>
            <div className="mb-6">
               <p className="text-xs font-bold text-gray-600 mb-2">Amount Buttons Color</p>
               <div className="relative">
                  <input 
                     type="color" 
                     className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                     name="b3_color"
                     value={donationPageInputs.b3_color}
                     onChange={handleDonationPageInputsChange}
                  />
                  <div 
                     className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer" 
                     style={{ backgroundColor: donationPageInputs.b3_color }}  
                  />
               </div>
            </div>

            <div className="mb-6">
               <p className="text-xs font-bold text-gray-600 mb-2">Share Button Color</p>
               <div className="relative">
                  <input 
                     type="color" 
                     className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                     name="b2_color"
                     value={donationPageInputs.b2_color}
                     onChange={handleDonationPageInputsChange}
                  />
                  <div 
                     className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
                     style={{ backgroundColor: donationPageInputs.b2_color }}  
                  />
               </div>
            </div>

            <div className="mb-6">
               <p className="text-xs font-bold text-gray-600 mb-2">Donate Button Color</p>
               <div className="relative">
                  <input 
                     type="color" 
                     className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                     name="b1_color"
                     value={donationPageInputs.b1_color}
                     onChange={handleDonationPageInputsChange}
                  />
                  <div 
                     className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
                     style={{ backgroundColor: donationPageInputs.b1_color }}  
                  />
               </div>
            </div>
         </div>

      </div>
   )
}

export default DesignInputs