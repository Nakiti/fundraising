"use client"
import SectionManager from "@/app/components/sectionManager"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"

const ElementInputs = () => {
   const {designSections, setDesignSections} = useContext(CampaignContext)
   
   return (
      <div className="w-full">
         {designSections.map((section) => (
            <SectionManager  section={section} sections={designSections} setSections={setDesignSections}/>
         ))}
      </div>
   )
}

export default ElementInputs