"use client"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import SectionManager from "@/app/components/sectionManager"
import { PageUpdateService } from "@/app/services/updateServices"
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext";
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"

const LandingPage = () => {
   const {ticketPageSections, setTicketPageSections, ticketsPageInputs, campaignId} = useContext(TicketPageContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   const handleSave = async() => {
      try {
         await PageUpdateService.updateTicketPage(campaignId, ticketsPageInputs)
         for (const section of ticketPageSections) {
            await PageUpdateService.updatePageSection(section.id, section.active)
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      }
   }

   return (
      <div className="w-full">
         {error && <ErrorModal message={errorMessage} setError={setError} />}
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