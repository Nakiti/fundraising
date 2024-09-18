"use client"
import Navbar from "../components/navbar"
import Preview from "../components/Preview/preview"
import Settings from "../components/Settings/settings"
import { useState } from "react"
import { CampaignContextProvider } from "@/app/context/campaignContext"

const NewCampaign = () => {
   const [active, setActive] = useState("settings")
   
   const handleActiveChange = (tab) => {
      setActive(tab)
   }


   return (
      
      <div className="w-full bg-gray-50">
         <Navbar active={active} handleActiveChange={handleActiveChange}/>

         {active == "settings" ?  <Settings /> : <Preview />}
      </div>
   )
}

export default NewCampaign