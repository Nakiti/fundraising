"use client"
import { useContext } from "react"
import { updateThankYouPage } from "@/app/services/updateServices"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import ColorInputEdit from "@/app/components/colorInputEdit";

const Design = () => {
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
            <ColorInputEdit title={"Primary Text Color"} name={"p_color"} value={thankPageInputs.p_color} changeFunc={handleThankInputsChange}/>
            <ColorInputEdit title={"Secondary Text Color"} name={"s_color"} value={thankPageInputs.s_color} changeFunc={handleThankInputsChange}/>
         </div>
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Background Colors</p>
            <ColorInputEdit title={"Background Color"} name={"bg_color"} value={thankPageInputs.bg_color} changeFunc={handleThankInputsChange}/>
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

export default Design