import { useContext } from "react";
import useImageUpload from "@/app/hooks/useImageUpload";
import { PeerLandingPageContext } from "@/app/context/campaignPages/peerLandingPageContext";

const BannerSection = () => {
   const {peerLandingPageInputs, handlePeerLandingPageInputsChange} = useContext(PeerLandingPageContext)
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
                  onChange={(e) => handleImageUpload(e, handlePeerLandingPageInputsChange)}
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
               value={peerLandingPageInputs.headline}
               onChange={handlePeerLandingPageInputsChange}
            />
         </div>
      </div>
   )
}

export default BannerSection