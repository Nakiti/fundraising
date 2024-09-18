"use client"

import { CampaignContextProvider } from "@/app/context/campaignContext"
import { useParams } from "next/navigation"

const CampaignLayout = ({children}) => {
   const params = useParams()
   const campaignId = params?.id

   return (
      <CampaignContextProvider campaignId={campaignId}>
         <div>
            {children}
         </div>
      </CampaignContextProvider>
   )
}

export default CampaignLayout