"use client"
import SectionManager from "@/app/components/sectionManager"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"

const ElementInputs = () => {
   const {thankyouPageSections, setThankyouPageSections} = useContext(CampaignContext)
   
   return (
      <div className="w-full">
         {thankyouPageSections.map((section) => (
            <SectionManager  section={section} sections={thankyouPageSections} setSections={setThankyouPageSections}/>
         ))}
      </div>
   )
}

export default ElementInputs