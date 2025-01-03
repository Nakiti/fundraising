"use client"
import { useContext } from "react"
import { PeerLandingPageContext } from "@/app/context/campaignPages/peerLandingPageContext";
import { updatePeerLandingPage } from "@/app/services/updateServices";
import { AuthContext } from "@/app/context/authContext";
import ColorInputEdit from "@/app/components/colorInputEdit";

const Design = () => {
   const {campaignId, peerLandingPageInputs, handlePeerLandingPageInputsChange} = useContext(PeerLandingPageContext)
   const {currentUser} = useContext(AuthContext)
   
   const handleSave = async() => {
      try {
         await updatePeerLandingPage(campaignId, peerLandingPageInputs, currentUser.id)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Text Color</p>
            <ColorInputEdit title={"Primary Text Color"} name={"p_color"} value={peerLandingPageInputs.p_color} changeFunc={handlePeerLandingPageInputsChange}/>
            <ColorInputEdit title={"Secondary Text Color"} name={"s_color"} value={peerLandingPageInputs.s_color} changeFunc={handlePeerLandingPageInputsChange}/>
            <ColorInputEdit title={"Amount Button Text Color"} name={"t_color"} value={peerLandingPageInputs.t_color} changeFunc={handlePeerLandingPageInputsChange}/>
         </div>
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Background Colors</p>
            <ColorInputEdit title={"Background Color"} name={"bg_color"} value={peerLandingPageInputs.bg_color} changeFunc={handlePeerLandingPageInputsChange}/>
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