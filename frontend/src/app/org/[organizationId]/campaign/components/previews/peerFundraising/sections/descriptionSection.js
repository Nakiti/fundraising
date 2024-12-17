import { useContext } from "react"
import { PeerFundraisingPageContext } from "@/app/context/campaignPages/peerFundraisingPageContext";

const PeerFundraisingDescritpionSection = () => {
   const {peerFundraisingPageInputs, handlePeerFundraisingInputsChange} = useContext(PeerFundraisingPageContext)

   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Description <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={5}
               placeholder="Enter a Description"
               name="description"
               value={peerFundraisingPageInputs.description}
               onChange={handlePeerFundraisingInputsChange} 
            />
         </div>
      </div>
   )
}

export default PeerFundraisingDescritpionSection