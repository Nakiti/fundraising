"use client"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import SectionManager from "@/app/components/sectionManager"


const ElementInputs = () => {
   const {ticketPageSections, setTicketPageSections} = useContext(CampaignContext)

   return (
      <div className="w-full">
         {ticketPageSections.map(section => {
            return <SectionManager section={section} sections={ticketPageSections} setSections={setTicketPageSections}/>
         })}
      </div>
   )
}

export default ElementInputs