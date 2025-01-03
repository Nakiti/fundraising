"use client"
import { useContext } from "react"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";
import ColorInputEdit from "@/app/components/colorInputEdit";

const Design = () => {
   const {donationPageInputs, handleDonationPageInputsChange} = useContext(DonationPageContext)
   
   const handleSave = async() => {
      try {
         await updateDonationPage(campaignId, donationPageInputs)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         <div className="mb-8">
            <p className="text-gray-800 text-md font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Text Color</p>
            <ColorInputEdit title={"Primary Text Color"} name={"p_color"} value={donationPageInputs.p_color} changeFunc={handleDonationPageInputsChange}/>
            <ColorInputEdit title={"Secondary Text Color"} name={"s_color"} value={donationPageInputs.s_color} changeFunc={handleDonationPageInputsChange}/>
         </div>

         <div className="mb-8">
            <p className="text-gray-800 text-md font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Background Colors</p>
            <ColorInputEdit title={"Background Color"} name={"bg_color"} value={donationPageInputs.bg_color} changeFunc={handleDonationPageInputsChange}/>
         </div>

         <div className="mb-8">
            <p className="text-gray-800 text-md font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Button Colors</p>
            <ColorInputEdit title={"Donate Button Color"} name={"b1_color"} value={donationPageInputs.b1_color} changeFunc={handleDonationPageInputsChange}/>
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