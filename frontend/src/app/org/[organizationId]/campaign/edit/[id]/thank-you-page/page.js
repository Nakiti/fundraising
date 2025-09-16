"use client"
import SectionManager from "@/app/components/sectionManager"
import { useContext, useState } from "react"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import { getPageService } from "@/app/services"
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"
import { validateActiveSections } from "@/app/utils/pageValidation"

const ThankYouPage = () => {
   const {thankYouPageSections, setThankYouPageSections, campaignId, thankPageInputs, organizationId, thankYouPageId, filesToUpload} = useContext(ThankYouPageContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const [isLoading, setIsLoading] = useState(false)
   const [successMessage, setSuccessMessage] = useState("")

   const handleSave = async() => {
      setIsLoading(true)
      setError(false)
      setSuccessMessage("")
      
      try {
         // Validate all active sections before saving
         // const validation = validateActiveSections('thankYou', thankYouPageSections, thankPageInputs)
         
         // if (!validation.isValid) {
         //    setErrorMessage(`Please fill in the following required fields: ${validation.errors.join(", ")}`)
         //    setError(true)
         //    setIsLoading(false)
         //    return
         // }
         
         // Get service instance
         const pageService = getPageService();

         console.log("thankYouPageId", thankYouPageId)
         // Update thank you page
         await pageService.updateThankYouPage(organizationId, campaignId, thankYouPageId, thankPageInputs, filesToUpload)
         
         // Update all sections in parallel (only those with valid IDs)
         const validSections = thankYouPageSections.filter(section => section.id && section.id > 0)
         if (validSections.length > 0) {
            const sectionPromises = validSections.map(section => 
               pageService.updatePageSection(section.id, section.active)
            )
            await Promise.all(sectionPromises)
         }
         
         setSuccessMessage("Thank you page updated successfully!")
         setTimeout(() => setSuccessMessage(""), 3000)
      } catch (err) {
         console.log("err", err)
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className="w-full">
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         {thankYouPageSections.map((section, index) => {
            return <SectionManager key={index} section={section} sections={thankYouPageSections} setSections={setThankYouPageSections}/>
         })}
         <div className="w-full flex flex-row mt-6 items-center gap-4">
            <button 
               className={`px-6 py-3 w-40 rounded-lg shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                  isLoading 
                     ? 'bg-gray-400 cursor-not-allowed' 
                     : 'bg-blue-600 hover:bg-blue-700'
               }`}
               onClick={handleSave}
               disabled={isLoading}
            >
               {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            {successMessage && (
               <div className="text-green-600 text-sm font-medium">
                  {successMessage}
               </div>
            )}
         </div>
      </div>
   )
}

export default ThankYouPage