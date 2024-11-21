"use client"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import SectionManager from "@/app/components/sectionManager"


const ElementInputs = () => {
   const {donationPageSections, setDonationPageSections} = useContext(CampaignContext)

   return (
      <div className="w-full">
         {donationPageSections.map((section, index) => {
            return <SectionManager key={index} section={section} sections={donationPageSections} setSections={setDonationPageSections}/>
         })}
      </div>
   )
}

export default ElementInputs