import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext";

const LandingAbout = () => {

   const {ticketsPageInputs, handleTicketsPageInputs} = useContext(TicketPageContext)

   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter About Text <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={5}
               placeholder="Enter a message"
               name="aboutDescription"
               value={ticketsPageInputs.aboutDescription}
               onChange={handleTicketsPageInputs} 
            />
         </div>
      </div>
   )
}

export default LandingAbout