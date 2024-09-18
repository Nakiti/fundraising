import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { FaAngleDown } from "react-icons/fa";


const ColorInputs = () => {

   const {previewInputs, handlePreviewInputsChange} = useContext(CampaignContext)

   const colors = [
      {value: "bg_color", label: "Background Color"},
      {value: "p_color", label: "Primary Color"},
      {value: "s_color", label: "Secondary Color"},
      {value: "h_color", label: "Header Color"},
   ]

   return (
      <div className="bg-white shadow-md p-6 rounded-md w-full max-w-6xl mx-auto mt-4">
         <div className="flex flex-row justify-between">
            <h1 className="text-xl font-bold">Configure Display</h1>
            <button>
               <FaAngleDown />
            </button>
         </div>

         <div className="w-full grid grid-cols-4 gap-4 mt-4">
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

         </div>
      </div>
   )

}

export default ColorInputs