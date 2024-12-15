import { useContext } from "react"
import { PeerLandingPageContext } from "@/app/context/campaignPages/peerLandingPageContext"

const DescriptionSection = () => {
   const {peerLandingPageInputs, handlePeerLandingPageInputsChange} = useContext(PeerLandingPageContext)

   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Tagline <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={5}
               placeholder="Enter a Tagline"
               name="tagline"
               value={peerLandingPageInputs.tagline}
               onChange={handlePeerLandingPageInputsChange} 
            />
         </div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Description <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={5}
               placeholder="Enter a Description"
               name="description"
               value={peerLandingPageInputs.description}
               onChange={handlePeerLandingPageInputsChange} 
            />
         </div>
      </div>
   )
}

export default DescriptionSection