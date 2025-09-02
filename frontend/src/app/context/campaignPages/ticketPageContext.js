"use client";
import { getPageService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import { initialTicketPageSections } from "@/app/constants/pageSectionsConfig";
import useFormInput from "@/app/hooks/useFormInput";
import { CampaignContext } from "../campaignContext";

export const TicketPageContext = createContext()

export const TicketPageContextProvider = ({campaignId, children}) => {
   const [ticketPageSections, setTicketPageSections] = useState(initialTicketPageSections)
   const [ticketPageInputs, handleTicketPageInputsChange, setTicketPageInputs] = useFormInput({})
   const [tickets, setTickets] = useState([])
   const {campaignType, campaignDetails} = useContext(CampaignContext)

   useEffect(() => {
      // const fetchData = async() => {
      //    try {
      //       const pageService = getPageService();
      //       // const contentService = getContentService();
            
      //       const ticketPageResponse = await pageService.getTicketPage(campaignId)
      //       const ticketPageId = ticketPageResponse.id
      //       const organizationId = campaignDetails?.organization_id || 1 // Fallback to 1 if not available
            
      //       setTicketPageId(ticketPageId)
            
      //       setTicketPageInputs({
      //          // Basic Content
      //          title: ticketPageResponse.title || "",
      //          subtitle: ticketPageResponse.subtitle || "",
      //          description: ticketPageResponse.description || "",
               
      //          // Colors
      //          bg_color: ticketPageResponse.bg_color || "#ffffff",
      //          p_color: ticketPageResponse.p_color || "#1f2937",
      //          s_color: ticketPageResponse.s_color || "#6b7280",
      //          b_color: ticketPageResponse.b_color || "#3b82f6",
      //          bt_color: ticketPageResponse.bt_color || "#ffffff",
               
      //          // Typography
      //          heroTitleSize: ticketPageResponse.heroTitleSize || "36",
      //          heroSubtitleSize: ticketPageResponse.heroSubtitleSize || "16",
      //          sectionTitleSize: ticketPageResponse.sectionTitleSize || "28",
      //          bodyTextSize: ticketPageResponse.bodyTextSize || "16",
      //          buttonTextSize: ticketPageResponse.buttonTextSize || "16",
               
      //          // Layout
      //          cardRadius: ticketPageResponse.cardRadius || "4",
      //          buttonRadius: ticketPageResponse.buttonRadius || "4",
      //       })

      //       // Fetch page sections for the ticket page
      //       const ticketPageSections = await pageService.getPageSectionsByPage(organizationId, 'ticket_landing', ticketPageId)
      //       setTicketPageSections((prevSections) => {
      //          return prevSections.map(section => {
      //             const matchingSection = ticketPageSections.find(s => s.name === section.name);
      //             return {
      //                ...section,
      //                active: matchingSection ? matchingSection.active : section.active,
      //                required: matchingSection ? matchingSection.required : section.required,
      //                dropdown: matchingSection ? matchingSection.dropdown : section.dropdown
      //             };
      //          });
      //       })

      //       // Fetch tickets for the campaign
      //       const ticketsResponse = await contentService.getCampaignTickets(campaignId)
      //       setTickets(ticketsResponse)
      //    } catch (err) {
      //       console.log(err)
      //    }
      // }

      // if (campaignType == "ticketed-event") {
      //    fetchData()
      // }
   }, [])

   return (
      <TicketPageContext.Provider value={{campaignId, ticketPageInputs, 
         handleTicketPageInputsChange, ticketPageSections, setTicketPageSections, tickets, setTickets}}
      >
         {children}
      </TicketPageContext.Provider>
   )
}