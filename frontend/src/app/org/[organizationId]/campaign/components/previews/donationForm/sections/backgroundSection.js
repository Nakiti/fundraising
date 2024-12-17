import useImageUpload from "@/app/hooks/useImageUpload"
import { useContext } from "react"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext"

const DonationFormBackgroundSection = () => {
   const {donationFormInputs, handleDonationFormInputsChange} = useContext(DonationFormContext)
   const {handleImageUpload} = useImageUpload()

   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Image Upload <span className="text-red-500">*</span>
            </p>
            <label className="w-full h-20 flex items-center justify-center border border-dashed border-gray-400 rounded-sm bg-white cursor-pointer">
               <span className="text-gray-500 p-4">Click to upload an image</span>
               <input 
                  type="file"
                  className="hidden" 
                  name="bg_image"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, handleDonationFormInputsChange)}
               />
            </label>                  

         </div>
      </div>
   )
}

export default DonationFormBackgroundSection