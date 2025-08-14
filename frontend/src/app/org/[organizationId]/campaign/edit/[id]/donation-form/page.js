"use client"
import { useContext, useState } from "react"
import SectionManager from "@/app/components/sectionManager"
import { PageUpdateService } from "@/app/services/updateServices"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext"
import { AuthContext } from "@/app/context/authContext"
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"

const DonationForm = () => {
   const {donationFormSections, setDonationFormSections, donationFormInputs, campaignId} = useContext(DonationFormContext)
   const {currentUser} = useContext(AuthContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   const handleSave = async() => {
      try {
         await PageUpdateService.updateDonationForm(campaignId, donationFormInputs, currentUser.id)
         for (const section of donationFormSections) {
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
         {donationFormSections.map((section, index) => {
            return <SectionManager key={index} section={section} sections={donationFormSections} setSections={setDonationFormSections}/>
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

export default DonationForm