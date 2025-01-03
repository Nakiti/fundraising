"use client"
import { useContext } from "react"
import { updateThankYouPage } from "@/app/services/updateServices"
import { TicketPurchasePageContext } from "@/app/context/campaignPages/ticketPurchasePageContext"

const Design = () => {
   const {ticketPurchaseInputs, handleTicketPurchaseInputsChange, campaignId} = useContext(TicketPurchasePageContext)

   const handleSave = async() => {
      try {
         await updateThankYouPage(campaignId, ticketPurchaseInputs)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Text Color</p>
            <ColorInputEdit title={"Primary Text Color"} name={"p_color"} value={ticketPurchaseInputs.p_color} changeFunc={handleTicketPurchaseInputsChange}/>
            <ColorInputEdit title={"Secondary Text Color"} name={"s_color"} value={ticketPurchaseInputs.s_color} changeFunc={handleTicketPurchaseInputsChange}/>
         </div>
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Background Colors</p>
            <ColorInputEdit title={"Background Color"} name={"bg_color"} value={ticketPurchaseInputs.bg_color} changeFunc={handleTicketPurchaseInputsChange}/>
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