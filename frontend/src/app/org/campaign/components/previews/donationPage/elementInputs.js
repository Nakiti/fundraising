"use client"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import SectionManager from "@/app/components/sectionManager"


const ElementInputs = () => {
   const {sections, setSections} = useContext(CampaignContext)


   return (
      <div className="w-full">
         {sections.map(section => {
            return <SectionManager section={section} sections={sections} setSections={setSections}/>
         })}
      </div>
   )
}

export default ElementInputs