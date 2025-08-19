import { initialPeerFundraisingPageSections } from "@/app/constants/pageSectionsConfig";
import useFormInput from "@/app/hooks/useFormInput";
import { PageService } from "@/app/services/fetchService";
import { createContext, useState, useEffect, useContext } from "react";
import { CampaignContext } from "@/app/context/campaignPages/campaignContext";

export const PeerFundraisingPageContext = createContext()

export const PeerFundraisingPageContextProvider = ({campaignId, children}) => {
   const [peerFundraisingPageSections, setPeerFundraisingPageSections] = useState(initialPeerFundraisingPageSections)
   const [peerFundraisingPageInputs, handlePeerFundraisingPageInputsChange, setPeerFundraisingPageInputs] = useFormInput({})
   const {campaignDetails} = useContext(CampaignContext)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const peerFundraisingResponse = await PageService.getPeerFundraisingPage(campaignId)
            const peerFundraisingPageId = peerFundraisingResponse.id
            const organizationId = campaignDetails?.organization_id || 1 // Fallback to 1 if not available

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

            const peerFundraisingSections = await PageService.getPageSectionsByPage(organizationId, 'peer_fundraising', peerFundraisingPageId)
            setPeerFundraisingPageSections((prevSections) => {
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

   return (
      <PeerFundraisingPageContext.Provider value={{campaignId, peerFundraisingPageInputs, 
         handlePeerFundraisingPageInputsChange, peerFundraisingPageSections, setPeerFundraisingPageSections}}
      >
         {children}
      </PeerFundraisingPageContext.Provider>
   )
}