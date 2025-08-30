"use client"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import SectionManager from "@/app/components/sectionManager"
import { PageUpdateService } from "@/app/services/updateServices"
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext";
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"
import { validateActiveSections } from "@/app/utils/pageValidation"

const LandingPage = () => {
   const {ticketPageSections, setTicketPageSections, ticketsPageInputs, campaignId} = useContext(TicketPageContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   const handleSave = async() => {
      try {
         // Validate all active sections before saving
         const validation = validateActiveSections('ticket', ticketPageSections, ticketsPageInputs)
         
         if (!validation.isValid) {
            setErrorMessage(`Please fill in the following required fields: ${validation.errors.join(", ")}`)
            setError(true)
            return
         }
         
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