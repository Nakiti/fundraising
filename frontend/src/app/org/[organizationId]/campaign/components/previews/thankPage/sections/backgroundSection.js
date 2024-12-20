import useImageUpload from "@/app/hooks/useImageUpload"
import { CampaignContext } from "@/app/context/campaignContext"
import { useContext } from "react"

const BackgroundSection = () => {
   const {handleThankPageInputsChange} = useContext(CampaignContext)
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
                  onChange={(e) => handleImageUpload(e, handleThankPageInputsChange)}
               />
            </label>                  
         </div>
      </div>
   )
}

export default BackgroundSection