import { createContext, useState, useEffect } from "react";
import { initialTicketPageSections } from "../../constants/pageSectionsConfig";
import useFormInput from "../../hooks/useFormInput";
import { getTicketPage, getPageSections, getCampaignTickets } from "@/app/services/fetchService";

export const TicketPageContext = createContext()

export const TicketPageContextProvider = ({campaignId, campaignType, children}) => {
   const [ticketPageSections, setTicketPageSections] = useState(initialTicketPageSections)
   const [ticketsPageInputs, handleTicketsPageInputs, setTicketsPageInputs] = useFormInput({})
   const [tickets, setTickets] = useState([])

   useEffect(() => {
      if (campaignType != "ticketed-event") return

      const fetchData = async() =>{
         try {
            const ticketPageResponse = await getTicketPage(campaignId)
            const ticketPageId = ticketPageResponse.id
            setTicketsPageInputs({
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
               b1_color: ticketPageResponse.b1_color || ""
            })

            const ticketSections = await getPageSections(ticketPageId)
            setTicketPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = ticketSections.find((item) => item.name == section.name)
                  return {...section, id: match.id, active: match.active }
               })
            })

            const ticketsResponse = await getCampaignTickets(campaignId)
            setTickets(ticketsResponse)
         } catch (err) {
            console.log(err)
         }

      }

      fetchData()
   }, [])

   if (campaignType !== "ticketed-event") {
      return <>{children}</>
   }

   return (
      <TicketPageContext.Provider value={{campaignId, ticketPageSections, 
         ticketsPageInputs, handleTicketsPageInputs, tickets, setTickets, setTicketPageSections}}
      >
         {children}
      </TicketPageContext.Provider>
   )
}