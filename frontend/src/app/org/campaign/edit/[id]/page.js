"use client"
import Navbar from "../../components/navbar"
import Preview from "../../components/Preview/preview"
import Settings from "../../components/Settings/settings"
import { useState } from "react"
import { CampaignContextProvider } from "@/app/context/campaignContext"
import { useRouter } from "next/navigation"

const EditCampaign = () => {
   const [active, setActive] = useState("settings")
   const router = useRouter()
   const campaignId = router.query.id

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

export default EditCampaign