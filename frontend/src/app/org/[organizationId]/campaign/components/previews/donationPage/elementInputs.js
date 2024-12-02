"use client"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import SectionManager from "@/app/components/sectionManager"


const ElementInputs = () => {
   const {donationPageSections, setDonationPageSections, donationPageInputs, campaignId} = useContext(CampaignContext)

   const handleSave = async() => {
      try {
         await updateDonationPage(campaignId, donationPageInputs)
         for (const section of donationPageSections) {
            await updatePageSection(section.id, section.active)
         }
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full">
         {donationPageSections.map((section, index) => {
            return <SectionManager key={index} section={section} sections={donationPageSections} setSections={setDonationPageSections}/>
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

export default ElementInputs