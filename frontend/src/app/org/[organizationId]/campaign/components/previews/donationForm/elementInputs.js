"use client"
import { useContext } from "react"
import SectionManager from "@/app/components/sectionManager"
import { updateDonationForm, updatePageSection } from "@/app/services/updateServices"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext"
import { AuthContext } from "@/app/context/authContext"

const ElementInputs = () => {
   const {donationFormSections, setDonationFormSections, donationFormInputs, campaignId} = useContext(DonationFormContext)
   const {currentUser} = useContext(AuthContext)

   const handleSave = async() => {
      console.log("click")

      try {
         await updateDonationForm(campaignId, donationFormInputs, currentUser.id)
         for (const section of donationFormSections) {
            await updatePageSection(section.id, section.active)
         }
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
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

export default ElementInputs