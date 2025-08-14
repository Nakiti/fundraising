"use client"
import SectionManager from "@/app/components/sectionManager"
import { useContext, useState } from "react"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import { PageUpdateService } from "@/app/services/updateServices"
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"

const ThankYouPage = () => {
   const {thankyouPageSections, setThankyouPageSections, campaignId, thankPageInputs} = useContext(ThankYouPageContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   const handleSave = async() => {
      try {
         await PageUpdateService.updateThankYouPage(campaignId, thankPageInputs)
         // for (const section of thankyouPageSections) {
         //    await updatePageSection(section.id, section.active)
         // }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      }
   }
   
   return (
      <div className="w-full">
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         {thankyouPageSections.map((section) => (
            <SectionManager key={section.id}  section={section} sections={thankyouPageSections} setSections={setThankyouPageSections}/>
         ))}
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

export default ThankYouPage