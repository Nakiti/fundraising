import { getTicketPurchasePage } from "@/app/services/fetchService";
import { createContext, useState, useEffect } from "react";
import useFormInput from "@/app/hooks/useFormInput";
import { initialTicketPurchaseSections } from "@/app/constants/pageSectionsConfig";

export const TicketPurchasePageContext = createContext()

export const TicketPurchasePageContextProvider = ({campaignId, campaignType, children}) => {
   const [ticketPurchaseInputs, handleTicketPurchaseInputsChange, setTicketPurchaseInputs] = useFormInput({})
   const [ticketPurchaseSections, setTicketPurchaseSections] = useState(initialTicketPurchaseSections)

   useEffect(() => {
      if (campaignType != "ticketed-event") return

      const fetchData = async() => {
         try {
            const response = await getTicketPurchasePage(campaignId)
            // const pageId = response.id
            setTicketPurchaseInputs({
               headline: response.headline || "",
               description: response.description || "",
               bg_color: response.bg_color || "",
               p_color: response.p_color || "",
               s_color: response.s_color || "",
               t_color: response.b1_color || "",
            })

            // const ticketSections = await getPageSections(ticketPageId)
            // setTicketPurchaseSections((prevSections) => {
            //    return prevSections.map(section => {
            //       const match = ticketSections.find((item) => item.name == section.name)
            //       return {...section, id: match.id, active: match.active }
            //    })
            // })
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
      <TicketPurchasePageContext.Provider value={{campaignId, ticketPurchaseInputs, handleTicketPurchaseInputsChange, 
         setTicketPurchaseInputs, ticketPurchaseSections, setTicketPurchaseSections}}
      >
         {children}
      </TicketPurchasePageContext.Provider>
   )
}