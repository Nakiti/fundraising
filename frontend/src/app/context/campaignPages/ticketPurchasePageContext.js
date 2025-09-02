"use client";
import { getPageService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import { initialTicketPurchaseSections } from "@/app/constants/pageSectionsConfig";
import useFormInput from "@/app/hooks/useFormInput";
import { CampaignContext } from "../campaignContext";

export const TicketPurchasePageContext = createContext()

export const TicketPurchasePageContextProvider = ({campaignId, children}) => {
   const [ticketPurchasePageSections, setTicketPurchasePageSections] = useState(initialTicketPurchaseSections)
   const [ticketPurchasePageInputs, handleTicketPurchasePageInputsChange, setTicketPurchasePageInputs] = useFormInput({})
   const {campaignType, campaignDetails} = useContext(CampaignContext)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const pageService = getPageService();
            const ticketPurchaseResponse = await pageService.getTicketPurchasePage(campaignId)
            const ticketPurchasePageId = ticketPurchaseResponse.id
            const organizationId = campaignDetails?.organization_id || 1 // Fallback to 1 if not available
            
            setTicketPurchasePageId(ticketPurchasePageId)
            
            setTicketPurchasePageInputs({
               // Basic Content
               title: ticketPurchaseResponse.title || "",
               subtitle: ticketPurchaseResponse.subtitle || "",
               description: ticketPurchaseResponse.description || "",
               
               // Colors
               bg_color: ticketPurchaseResponse.bg_color || "#ffffff",
               p_color: ticketPurchaseResponse.p_color || "#1f2937",
               s_color: ticketPurchaseResponse.s_color || "#6b7280",
               b_color: ticketPurchaseResponse.b_color || "#3b82f6",
               bt_color: ticketPurchaseResponse.bt_color || "#ffffff",
               
               // Typography
               heroTitleSize: ticketPurchaseResponse.heroTitleSize || "36",
               heroSubtitleSize: ticketPurchaseResponse.heroSubtitleSize || "16",
               sectionTitleSize: ticketPurchaseResponse.sectionTitleSize || "28",
               bodyTextSize: ticketPurchaseResponse.bodyTextSize || "16",
               buttonTextSize: ticketPurchaseResponse.buttonTextSize || "16",
               
               // Layout
               cardRadius: ticketPurchaseResponse.cardRadius || "4",
               buttonRadius: ticketPurchaseResponse.buttonRadius || "4",
            })

            // Fetch page sections for the ticket purchase page
            const ticketPurchaseSections = await pageService.getPageSectionsByPage(organizationId, 'ticket_purchase', ticketPurchasePageId)
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