"use client"
import { useContext } from "react"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext";
import { updateDonationForm } from "@/app/services/updateServices";
import { AuthContext } from "@/app/context/authContext";
import ColorInputEdit from "@/app/components/colorInputEdit";

const Design = () => {
   const {donationFormInputs, handleDonationFormInputsChange} = useContext(DonationFormContext)
   const {currentUser} = useContext(AuthContext)
   
   const handleSave = async() => {
      try {
         await updateDonationForm(campaignId, donationFormInputs, currentUser.id)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Text Color</p>
            <ColorInputEdit title={"Primary Text Color"} name={"p_color"} value={donationFormInputs.p_color} changeFunc={handleDonationFormInputsChange}/>
            <ColorInputEdit title={"Secondary Text Color"} name={"s_color"} value={donationFormInputs.s_color} changeFunc={handleDonationFormInputsChange}/>
         </div>
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Background Colors</p>
            <ColorInputEdit title={"Background Color"} name={"bg_color"} value={donationFormInputs.bg_color} changeFunc={handleDonationFormInputsChange}/>
         </div>
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Button Colors</p>
            <ColorInputEdit title={"Donate Button Color"} name={"b1_color"} value={donationFormInputs.b1_color} changeFunc={handleDonationFormInputsChange}/>
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