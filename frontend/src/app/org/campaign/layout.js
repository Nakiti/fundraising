"use client"

import { CampaignContextProvider } from "@/app/context/campaignContext"
import { useRouter } from "next/navigation"

const CampaignLayout = ({children}) => {
   const router = useRouter()
   const campaignId = router.query?.id

   return (
      <CampaignContextProvider campaignId={campaignId}>
         <div>
            {children}
         </div>
      </CampaignContextProvider>
   )
}

export default CampaignLayout