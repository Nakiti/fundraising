"use client"
import { useContext } from "react"
import { PeerFundraisingPageContext } from "@/app/context/campaignPages/peerFundraisingPageContext";

const Design = () => {
   const {peerFundraisingPageInputs, handlePeerFundraisingPageInputsChange} = useContext(PeerFundraisingPageContext)
   
   const handleSave = async() => {
      try {
         await updateDonationPage(campaignId, peerFundraisingPageInputs)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Text Color</p>
            <ColorInputEdit title={"Primary Text Color"} name={"p_color"} value={peerFundraisingPageInputs.p_color} changeFunc={handlePeerFundraisingPageInputsChange}/>
            <ColorInputEdit title={"Secondary Text Color"} name={"s_color"} value={peerFundraisingPageInputs.s_color} changeFunc={handlePeerFundraisingPageInputsChange}/>
            <ColorInputEdit title={"Amount Button Text Color"} name={"bt_color"} value={peerFundraisingPageInputs.bt_color} changeFunc={handlePeerFundraisingPageInputsChange}/>
         </div>
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Background Colors</p>
            <ColorInputEdit title={"Background Color"} name={"bg_color"} value={peerFundraisingPageInputs.bg_color} changeFunc={handlePeerFundraisingPageInputsChange}/>
         </div>
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Button Colors</p>
            <ColorInputEdit title={"Amount Buttons Color"} name={"b3_color"} value={peerFundraisingPageInputs.b3_color} changeFunc={handlePeerFundraisingPageInputsChange}/>
            <ColorInputEdit title={"Share Button Color"} name={"b2_color"} value={peerFundraisingPageInputs.b2_color} changeFunc={handlePeerFundraisingPageInputsChange}/>
            <ColorInputEdit title={"Donate Button Color"} name={"b1_color"} value={peerFundraisingPageInputs.b1_color} changeFunc={handlePeerFundraisingPageInputsChange}/>
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