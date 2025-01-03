"use client"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import SectionManager from "@/app/components/sectionManager"
import { updateTicketPage } from "@/app/services/updateServices"
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext";

const LandingPage = () => {
   const {ticketPageSections, setTicketPageSections, ticketsPageInputs, campaignId} = useContext(TicketPageContext)

   const handleSave = async() => {
      try {
         await updateTicketPage(campaignId, ticketsPageInputs)
         for (const section of ticketPageSections) {
            await updatePageSection(section.id, section.active)
         }
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         {ticketPageSections.map(section => {
            return <SectionManager section={section} sections={ticketPageSections} setSections={setTicketPageSections}/>
         })}
         <div className="w-full flex flex-row mt-6">
            <button 
               className="bg-blue-700 px-4 py-2 w-40 rounded-md shadow-sm text-md text-white"
               onClick={handleSave}
            >
               Save
            </button>
         </div>
      </div>
   )
}

export default LandingPage