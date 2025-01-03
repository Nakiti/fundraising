"use client"
import { useContext } from "react"
import SectionManager from "@/app/components/sectionManager"
import { updatePageSection, updatePeerLandingPage } from "@/app/services/updateServices"
import { PeerLandingPageContext } from "@/app/context/campaignPages/peerLandingPageContext"
import { AuthContext } from "@/app/context/authContext"

const PeerLandingPage = () => {
   const {peerLandingPageSections, setPeerLandingPageSections, peerLandingPageInputs, campaignId} = useContext(PeerLandingPageContext)
   const {currentUser} = useContext(AuthContext)

   const handleSave = async() => {
      try {
         await updatePeerLandingPage(campaignId, peerLandingPageInputs, currentUser.id)
         for (const section of peerLandingPageSections) {
            await updatePageSection(section.id, section.active)
         }
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         {peerLandingPageSections.map((section, index) => {
            return <SectionManager key={index} section={section} sections={peerLandingPageSections} setSections={setPeerLandingPageSections}/>
         })}
         <div className="w-full flex flex-row mt-6">
            <button 
               className="bg-blue-700 px-4 py-2 w-40 rounded-md shadow-sm text-md text-white hover:bg-blue-800"
               onClick={handleSave}
            >
               Save
            </button>
         </div>
      </div>
   )
}

export default PeerLandingPage