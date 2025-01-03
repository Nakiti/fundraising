"use client"
import { useContext } from "react"
import SectionManager from "@/app/components/sectionManager"
import { updatePageSection, updatePeerFundraisingPage } from "@/app/services/updateServices"
import { PeerFundraisingPageContext } from "@/app/context/campaignPages/peerFundraisingPageContext"
import { AuthContext } from "@/app/context/authContext"


const PeerFundraisingPage = () => {
   const {peerFundraisingPageSections, setPeerFundraisingPageSections, peerFundraisingPageInputs, campaignId} = useContext(PeerFundraisingPageContext)
   const {currentUser} = useContext(AuthContext)

   const handleSave = async() => {
      try {
         await updatePeerFundraisingPage(campaignId, peerFundraisingPageInputs, currentUser.id)
         for (const section of peerFundraisingPageSections) {
            await updatePageSection(section.id, section.active)
         }
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         {peerFundraisingPageSections.map((section, index) => {
            return <SectionManager key={index} section={section} sections={peerFundraisingPageSections} setSections={setPeerFundraisingPageSections}/>
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

export default PeerFundraisingPage