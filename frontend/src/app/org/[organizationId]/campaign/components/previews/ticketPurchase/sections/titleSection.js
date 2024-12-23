import { TicketPurchasePageContext } from "@/app/context/campaignPages/ticketPurchasePageContext"
import { useContext } from "react"


const TicketPurchaseTitleSection = () => {
   const {ticketPurchaseInputs, handleTicketPurchaseInputsChange} = useContext(TicketPurchasePageContext)
   
   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Headline <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={5}
               placeholder="Enter a headline"
               name="headline"
               value={ticketPurchaseInputs.headline}
               onChange={handleTicketPurchaseInputsChange} 
            />
         </div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Instructions <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={5}
               placeholder="Enter instructions"
               name="description"
               value={ticketPurchaseInputs.description}
               onChange={handleTicketPurchaseInputsChange} 
            />
         </div>
      </div>
   )
}

export default TicketPurchaseTitleSection