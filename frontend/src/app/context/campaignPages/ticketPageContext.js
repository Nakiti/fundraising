import { initialTicketPageSections } from "@/app/constants/pageSectionsConfig";
import useFormInput from "@/app/hooks/useFormInput";
import { PageService, ContentService } from "@/app/services/fetchService";
import { createContext, useState, useEffect, useContext } from "react";
import { CampaignContext } from "../campaignContext";

export const TicketPageContext = createContext()

export const TicketPageContextProvider = ({campaignId, children}) => {
   const [ticketPageSections, setTicketPageSections] = useState(initialTicketPageSections)
   const [ticketPageInputs, handleTicketPageInputsChange, setTicketPageInputs] = useFormInput({})
   const [tickets, setTickets] = useState([])
   const {campaignType, campaignDetails} = useContext(CampaignContext)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const ticketPageResponse = await PageService.getTicketPage(campaignId)
            const ticketPageId = ticketPageResponse.id
            const organizationId = campaignDetails?.organization_id || 1 // Fallback to 1 if not available

            setTicketPageInputs({
               title: ticketPageResponse.title || "",
               date: ticketPageResponse.date || "",
               address: ticketPageResponse.address || "",
               bgImage: ticketPageResponse.bgImage || "",
               aboutDescription: ticketPageResponse.aboutDescription || "",
               venueName: ticketPageResponse.venueName || "",
               instructions: ticketPageResponse.instructions || "",
               bg_color: ticketPageResponse.bg_color || "",
               bg_color2: ticketPageResponse.bg_color2 || "",
               p_color: ticketPageResponse.p_color || "",
               s_color: ticketPageResponse.s_color || "",
               b1_color: ticketPageResponse.b1_color || "",
            })

            const ticketPageSections = await PageService.getPageSectionsByPage(organizationId, 'ticket_landing', ticketPageId)
            setTicketPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = ticketPageSections.find((item) => item.name == section.name)
                  return {...section, id: match.id, active: match.active }
               })
            })

            const ticketsResponse = await ContentService.getCampaignTickets(campaignId)
            setTickets(ticketsResponse)
         } catch (err) {
            console.log(err)
         }
      }

      if (campaignType == "ticketed-event") {
         fetchData()
      }
   }, [])

   return (
      <TicketPageContext.Provider value={{campaignId, ticketPageInputs, 
         handleTicketPageInputsChange, ticketPageSections, setTicketPageSections, tickets, setTickets}}
      >
         {children}
      </TicketPageContext.Provider>
   )
}