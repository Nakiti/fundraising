import { initialPeerFundraisingPageSections } from "@/app/constants/pageSectionsConfig";
import useFormInput from "@/app/hooks/useFormInput";
import { getPageSections, getPeerFundraisingPage } from "@/app/services/fetchService";
import { createContext, useState, useEffect } from "react";

export const PeerFundraisingPageContext = createContext()

export const PeerFundraisingPageContextProvider = ({campaignId, campaignType, children}) => {
   const [peerFundraisingPageSections, setPeerFundraisingPageSections] = useState(initialPeerFundraisingPageSections)
   const [peerFundraisingPageInputs, handlePeerFundraisingPageInputsChange, setPeerFundraisingPageInputs] = useFormInput({})

   useEffect(() => {
      if (campaignType !== "peer-to-peer") return

      const fetchData = async() => {
         try {
            const peerFundraisingResponse = await getPeerFundraisingPage(campaignId)
            const peerFundraisingPageId = peerFundraisingResponse.id

            setPeerFundraisingPageInputs({
               headline: peerFundraisingResponse.headline || "",
               tagline: peerFundraisingResponse.tagline || "",
               description: peerFundraisingResponse.description || "",
               banner_image: peerFundraisingResponse.banner_image || "",
               person_image: peerFundraisingResponse.person_image || "",
               p_color: peerFundraisingResponse.p_color || "",
               s_color: peerFundraisingResponse.s_color || "",
               bg_color: peerFundraisingResponse.bg_color || "",
               t_color: peerFundraisingResponse.t_color || "",
            })

            const peerFundraisingSections = await getPageSections(peerFundraisingPageId)
            handlePeerFundraisingPageInputsChange((prevSections) => {
               return prevSections.map(section => {
                  const match = peerFundraisingSections.find((item) => item.name == section.name)
                  return {...section, id: match.id, active: match.active }
               })
            })
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   if (campaignType !== "peer-to-peer") {
      return <>{children}</>
   }

   return (
      <PeerFundraisingPageContext.Provider value={{campaignId, peerFundraisingPageInputs, 
         handlePeerFundraisingPageInputsChange, peerFundraisingPageSections, setPeerFundraisingPageSections}}
      >
         {children}
      </PeerFundraisingPageContext.Provider>
   )
}