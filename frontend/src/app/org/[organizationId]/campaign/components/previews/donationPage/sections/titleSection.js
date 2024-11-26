import { useContext } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import useImageUpload from "@/app/hooks/useImageUpload";

const TitleSection = () => {
   const {donationPageInputs, handleDonationPageInputsChange} = useContext(CampaignContext)
   const {handleImageUpload} = useImageUpload()

   // const handleImageUpload = (e) => {
   //    const file = e.target.files[0];
   //    if (file) {
   //       const reader = new FileReader();
   //       reader.onloadend = () => {
   //          handleDonationPageInputsChange({ target: { name: 'image', value: reader.result } });
   //          console.log(reader.result)
   //       };
   //       reader.readAsDataURL(file); // Convert the file to base64
   //    }
   // }

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
                  name="small_image"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, handleDonationPageInputsChange)}
               />
            </label>                  
         </div>
         <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Headline <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-xl w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={2}
               placeholder="Enter a Headline "
               name="headline"
               value={donationPageInputs.headline}
               onChange={handleDonationPageInputsChange}
            />
         </div>
      </div>
   )

}

export default TitleSection