"use client"
import SectionManager from "@/app/components/sectionManager"
import { useContext } from "react"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import { updateTicketPage } from "@/app/services/updateServices"

const ElementInputs = () => {
   const {thankyouPageSections, setThankyouPageSections, campaignId, thankPageInputs} = useContext(ThankYouPageContext)

   const handleSave = async() => {
      try {
         await updateTicketPage(campaignId, thankPageInputs)
         for (const section of thankyouPageSections) {
            await updatePageSection(section.id, section.active)
         }
      } catch (err) {
         console.log(err)
      }
   }
   
   return (
      <div className="w-full">
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

export default ElementInputs