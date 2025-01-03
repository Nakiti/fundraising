"use client"
import { useContext } from "react"
import { updateTicketPage } from "@/app/services/updateServices"
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext";
import ColorInputEdit from "@/app/components/colorInputEdit";


const Design = () => {
   const {ticketsPageInputs, handleTicketsPageInputs, campaignId} = useContext(TicketPageContext)

   const handleSave = async() => {
      try {
         await updateTicketPage(campaignId, ticketsPageInputs)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Text Color</p>
            <ColorInputEdit title={"Primary Text Color"} name={"p_color"} value={ticketsPageInputs.p_color} changeFunc={ticketsPageInputs}/>
            <ColorInputEdit title={"Secondary Text Color"} name={"s_color"} value={ticketsPageInputs.s_color} changeFunc={handleTicketsPageInputs}/>
         </div>
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Background Colors</p>
            <ColorInputEdit title={"Background Color"} name={"bg_color"} value={ticketsPageInputs.bg_color} changeFunc={handleTicketsPageInputs}/>
         </div>
         <div className="mb-8">
            <p className="text-gray-800 text-lg font-semibold py-1 border-b-2 border-gray-300 mb-4">Manage Button Colors</p>
            <ColorInputEdit title={"Amount Buttons Color"} name={"b3_color"} value={ticketsPageInputs.b3_color} changeFunc={handleTicketsPageInputs}/>
            <ColorInputEdit title={"Share Buttons Color"} name={"b2_color"} value={ticketsPageInputs.b2_color} changeFunc={handleTicketsPageInputs}/>
            <ColorInputEdit title={"Donate Buttons Color"} name={"b1_color"} value={ticketsPageInputs.b1_color} changeFunc={handleTicketsPageInputs}/>
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