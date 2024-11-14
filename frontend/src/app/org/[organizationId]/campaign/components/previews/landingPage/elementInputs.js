"use client"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import SectionManager from "@/app/components/sectionManager"


const ElementInputs = () => {
   const {landingSections, setLandingSections} = useContext(CampaignContext)


   return (
      <div className="w-full">
         {landingSections.map(section => {
            return <SectionManager section={section} sections={landingSections} setSections={setLandingSections}/>
         })}
      </div>
   )
}

export default ElementInputs