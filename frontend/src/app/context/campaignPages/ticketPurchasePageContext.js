import { initialTicketPurchaseSections } from "@/app/constants/pageSectionsConfig";
import useFormInput from "@/app/hooks/useFormInput";
import { PageService } from "@/app/services/fetchService";
import { createContext, useState, useEffect, useContext } from "react";
import { CampaignContext } from "../campaignContext";

export const TicketPurchasePageContext = createContext()

export const TicketPurchasePageContextProvider = ({campaignId, children}) => {
   const [ticketPurchasePageSections, setTicketPurchasePageSections] = useState(initialTicketPurchaseSections)
   const [ticketPurchasePageInputs, handleTicketPurchasePageInputsChange, setTicketPurchasePageInputs] = useFormInput({})
   const {campaignType, campaignDetails} = useContext(CampaignContext)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const ticketPurchaseResponse = await PageService.getTicketPurchasePage(campaignId)
            const ticketPurchasePageId = ticketPurchaseResponse.id
            const organizationId = campaignDetails?.organization_id || 1 // Fallback to 1 if not available

            setTicketPurchasePageInputs({
               headline: ticketPurchaseResponse.headline || "",
               description: ticketPurchaseResponse.description || "",
               bg_image: ticketPurchaseResponse.bg_image || "",
               bg_color: ticketPurchaseResponse.bg_color || "",
               p_color: ticketPurchaseResponse.p_color || "",
               s_color: ticketPurchaseResponse.s_color || "",
            })

            const ticketPurchaseSections = await PageService.getPageSectionsByPage(organizationId, 'ticket_purchase', ticketPurchasePageId)
            setTicketPurchasePageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = ticketPurchaseSections.find((item) => item.name == section.name)
                  return {...section, id: match.id, active: match.active }
               })
            })
         } catch (err) {
            console.log(err)
         }
      }

      if (campaignType == "ticketed-event") {
         fetchData()
      }
   }, [])

   return (
      <TicketPurchasePageContext.Provider value={{campaignId, ticketPurchasePageInputs, 
         handleTicketPurchasePageInputsChange, ticketPurchasePageSections, setTicketPurchasePageSections}}
      >
         {children}
      </TicketPurchasePageContext.Provider>
   )
}