"use client"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"

const DesignInputs = () => {

   const {previewInputs, handlePreviewInputsChange} = useContext(CampaignContext)

   return (
<div className="w-full">

<div className="mb-8">
   <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Text Color</p>
   
   {/* Primary Text Color */}
   <div className="mb-6">
      <p className="text-xs font-bold text-gray-600 mb-2">Primary Text Color</p>
      <div className="relative">
         <input 
            type="color" 
            className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
            name="p_color"
            value={previewInputs.p_color}
            onChange={handlePreviewInputsChange}
            style={{ backgroundColor: previewInputs.p_color }}  
         />
         <div 
            className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer" 
            style={{ backgroundColor: previewInputs.p_color }}  
         />
      </div>
   </div>

   {/* Secondary Text Color */}
   <div className="mb-6">
      <p className="text-xs font-bold text-gray-600 mb-2">Secondary Text Color</p>
      <div className="relative">
         <input 
            type="color" 
            className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
            name="s_color"
            value={previewInputs.s_color}
            onChange={handlePreviewInputsChange}
         />
         <div 
            className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
            style={{ backgroundColor: previewInputs.s_color }}  
         />
      </div>
   </div>

   {/* Button Text Color */}
   <div className="mb-6">
      <p className="text-xs font-bold text-gray-600 mb-2">Amount Button Text Color</p>
      <div className="relative">
         <input 
            type="color" 
            className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
            name="b1_color"
            value={previewInputs.b1_color}
            onChange={handlePreviewInputsChange}
         />
         <div 
            className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
            style={{ backgroundColor: previewInputs.b1_color }}  
         />
      </div>
   </div>
</div>

{/* Manage Background Colors */}
<div className="mb-8">
   <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Background Colors</p>

   {/* Background Color */}
   <div className="mb-6">
      <p className="text-xs font-bold text-gray-600 mb-2">Background Color</p>
      <div className="relative">
         <input 
            type="color" 
            className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
            name="bg_color"
            value={previewInputs.bg_color}
            onChange={handlePreviewInputsChange}
         />
         <div 
            className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
            style={{ backgroundColor: previewInputs.bg_color }}  
         />
      </div>
   </div>
</div>

{/* Manage Button Colors */}
<div className="mb-8">
   <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Button Colors</p>

   {/* Amount Button Color */}
   <div className="mb-6">
      <p className="text-xs font-bold text-gray-600 mb-2">Amount Buttons Color</p>
      <div className="relative">
         <input 
            type="color" 
            className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
            name="b3_color"
            value={previewInputs.b3_color}
            onChange={handlePreviewInputsChange}
         />
         <div 
            className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer" 
            style={{ backgroundColor: previewInputs.b3_color }}  
         />
      </div>
   </div>

   {/* Share Button Color */}
   <div className="mb-6">
      <p className="text-xs font-bold text-gray-600 mb-2">Share Button Color</p>
      <div className="relative">
         <input 
            type="color" 
            className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
            name="b2_color"
            value={previewInputs.b2_color}
            onChange={handlePreviewInputsChange}
         />
         <div 
            className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
            style={{ backgroundColor: previewInputs.b2_color }}  
         />
      </div>
   </div>

   {/* Donate Button Color */}
   <div className="mb-6">
      <p className="text-xs font-bold text-gray-600 mb-2">Donate Button Color</p>
      <div className="relative">
         <input 
            type="color" 
            className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
            name="b1_color"
            value={previewInputs.b1_color}
            onChange={handlePreviewInputsChange}
         />
         <div 
            className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer"
            style={{ backgroundColor: previewInputs.b1_color }}  
         />
      </div>
   </div>
</div>

</div>

   )
}

export default DesignInputs