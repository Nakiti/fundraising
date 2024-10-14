"use client"
import Navbar from "@/app/org/components/navbar"
import { createCampaignDesignation, deleteCampaignDesignation, updateCampaign, updatePreview } from "@/app/services/campaignService"
import { useRouter } from "next/navigation"

const EditLayout = ({params, children}) => {
   const campaignId = params.id
   const router = useRouter()

   const links = [
      `/org/campaign/edit/${campaignId}/details/about`,
      `/org/campaign/edit/${campaignId}/donation-page/`
   ]

   return (
      <div >
         <Navbar links={links}/>
         <div className="py-8">
            {children}
         </div>
      </div>
   )
}

export default EditLayout