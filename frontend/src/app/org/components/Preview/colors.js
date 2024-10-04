"use client"

import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { FaAngleDown, FaAngleUp } from "react-icons/fa";



const ColorInputs = () => {

   const {previewInputs, handlePreviewInputsChange} = useContext(CampaignContext)
   const [open, setOpen] = useState(true)

   const colors = [
      {value: "bg_color", label: "Background Color"},
      {value: "p_color", label: "Primary Text Color"},
      {value: "s_color", label: "Secondary Text Color"},
      {value: "h_color", label: "Header Color"},
      {value: "ht_color", label: "Header Text Color"},
      {value: "ht_color", label: "Donate Button Color"},
      {value: "ht_color", label: "Share Button Color"},
   ]

   return (
      <div className="bg-white shadow-md p-6 rounded-md w-full max-w-6xl mx-auto mt-4">
         <div className="flex flex-row justify-between">
            <h1 className="text-xl font-bold">Configure Display</h1>
            {/* <button onClick={() => setOpen(!open)}>
               {open ? <FaAngleDown /> : <FaAngleUp />}
            </button> */}
         </div>
         <p className="text-md mt-4">To style an element, simply click on it</p>

         {/* {open && <div className="w-full grid grid-cols-4 gap-4 mt-4">
            {colors.map((item, index) => {
               return (
                  <div className="flex items-center space-x-2 justify-center">
                     <label className="text-sm font-semibold">{item.label}:</label>
                     <div className="relative">
                        <input 
                           type="color" 
                           className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                           name={item.value}
                           value={previewInputs[item.value]}
                           onChange={handlePreviewInputsChange}
                        />
                        <div 
                           className="w-5 h-5 rounded-full border border-gray-300 cursor-pointer" 
                           style={{ backgroundColor: previewInputs[item.value] || '#ff0000' }} // Replace with the actual selected color state
                        />
                     </div>
                  </div>
               )
            })}

         </div>} */}
      </div>
   )

}

export default ColorInputs