"use client";
import { getPageService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import { initialPeerLandingPageSections } from "@/app/constants/pageSectionsConfig";
import useFormInput from "@/app/hooks/useFormInput";
import { CampaignContext } from "../campaignContext";

export const PeerLandingPageContext = createContext()

export const PeerLandingPageContextProvider = ({campaignId, children}) => {
   const [peerLandingPageSections, setPeerLandingPageSections] = useState(initialPeerLandingPageSections)
   const [peerLandingPageInputs, handlePeerLandingPageInputsChange, setPeerLandingPageInputs] = useFormInput({})
   const {campaignDetails} = useContext(CampaignContext)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const pageService = getPageService();
            const peerLandingResponse = await pageService.getPeerLandingPage(campaignId)
            const peerLandingPageId = peerLandingResponse.id
            const organizationId = campaignDetails?.organization_id || 1 // Fallback to 1 if not available

            setPeerLandingPageInputs({
               headline: peerLandingResponse.headline || "",
               tagline: peerLandingResponse.tagline || "",
               description: peerLandingResponse.description || "",
               banner_image: peerLandingResponse.banner_image || "",
               p_color: peerLandingResponse.p_color || "",
               s_color: peerLandingResponse.s_color || "",
               bg_color: peerLandingResponse.bg_color || "",
               t_color: peerLandingResponse.t_color || "",
            })

            const peerLandingSections = await pageService.getPageSectionsByPage(organizationId, 'peer_landing', peerLandingPageId)
            setPeerLandingPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = peerLandingSections.find((item) => item.name == section.name)
                  return {...section, id: match.id, active: match.active }
               })
            })
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <PeerLandingPageContext.Provider value={{campaignId, peerLandingPageInputs, 
         handlePeerLandingPageInputsChange, peerLandingPageSections, setPeerLandingPageSections}}
      >
         {children}
      </PeerLandingPageContext.Provider>
   )
}