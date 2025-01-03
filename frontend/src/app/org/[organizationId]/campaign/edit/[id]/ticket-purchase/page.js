"use client"
import { useContext } from "react"
import SectionManager from "@/app/components/sectionManager"
import { updateTicketPurchasePage } from "@/app/services/updateServices"
import { TicketPurchasePageContext } from "@/app/context/campaignPages/ticketPurchasePageContext";
import { AuthContext } from "@/app/context/authContext";

const TicketPurchasePage = () => {
   const {ticketPurchaseSections, setTicketPurchaseSections, ticketPurchaseInputs, campaignId} = useContext(TicketPurchasePageContext)
   const {currentUser} = useContext(AuthContext)

   const handleSave = async() => {
      try {
         await updateTicketPurchasePage(campaignId, ticketPurchaseInputs, currentUser.id)
         // for (const section of ticketPurchaseSections) {
         //    await updatePageSection(section.id, section.active)
         // }
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         {ticketPurchaseSections.map(section => {
            return <SectionManager section={section} sections={ticketPurchaseSections} setSections={setTicketPurchaseSections}/>
         })}
         <div className="w-full flex flex-row mt-6">
            <button 
               className="bg-blue-700 px-4 py-2 w-40 rounded-md shadow-sm text-md text-white hover:bg-blue-500"
               onClick={handleSave}
            >
               Save
            </button>
         </div>
      </div>
   )
}

export default TicketPurchasePage