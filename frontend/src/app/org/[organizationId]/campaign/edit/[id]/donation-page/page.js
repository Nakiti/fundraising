"use client"
import { useContext, useState } from "react"
import SectionManager from "@/app/components/sectionManager"
import { PageUpdateService } from "@/app/services/updateServices"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"

const DonationPage = () => {
   const {donationPageSections, setDonationPageSections, donationPageInputs, campaignId} = useContext(DonationPageContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const [isLoading, setIsLoading] = useState(false)
   const [successMessage, setSuccessMessage] = useState("")

   const handleSave = async() => {
      setIsLoading(true)
      setError(false)
      setSuccessMessage("")
      
      try {
         // Update donation page
         await PageUpdateService.updateDonationPage(campaignId, donationPageInputs)
         
         // Update all sections in parallel (only those with valid IDs)
         const validSections = donationPageSections.filter(section => section.id && section.id > 0)
         console.log('Donation page sections:', donationPageSections)
         console.log('Valid sections to update:', validSections)
         if (validSections.length > 0) {
            const sectionPromises = validSections.map(section => 
               PageUpdateService.updatePageSection(section.id, section.active)
            )
            await Promise.all(sectionPromises)
         }
         
         setSuccessMessage("Donation page updated successfully!")
         setTimeout(() => setSuccessMessage(""), 3000)
      } catch (err) {
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
         {donationPageSections.map((section, index) => {
            return <SectionManager key={index} section={section} sections={donationPageSections} setSections={setDonationPageSections}/>
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

export default DonationPage