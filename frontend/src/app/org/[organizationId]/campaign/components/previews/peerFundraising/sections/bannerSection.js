import { useContext } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import useImageUpload from "@/app/hooks/useImageUpload";
import { PeerFundraisingPageContext } from "@/app/context/campaignPages/peerFundraisingPageContext";

const PeerFundraisingBannerSection = () => {
   const {peerFundraisingPageInputs, handlePeerFundraisingPageInputsChange} = useContext(PeerFundraisingPageContext)
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
                  name="banner_image"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, handlePeerFundraisingPageInputsChange)}
               />
            </label>                  
            {/* <img
               src=''
               alt="image"
               className="w-full h-36 object-cover border border-dashed border-gray-400 rounded-md bg-gray-50"
            /> */}
         </div>
         {/* <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Headline <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-xl w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={2}
               placeholder="Enter a Headline "
               name="headline"
               value={previewInputs.headline}
               onChange={handlePreviewInputsChange}
            />
         </div> */}
      </div>
   )
}

export default PeerFundraisingBannerSection