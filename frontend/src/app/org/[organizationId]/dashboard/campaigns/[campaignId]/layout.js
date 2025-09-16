"use client"
import { useEffect, useState } from "react";
import { getCampaignService } from "@/app/services";
import HeaderBar from "./components/headerBar";

const CampaignPageLayout = ({children, params}) => {
   const campaignId = params.campaignId
   const organizationId = params.organizationId
   const [campaign, setCampaign] = useState(null)
   const [campaignType, setCampaignType] = useState(null)

   useEffect(() => {
      const fetchData = async() => {
         try {
            console.log(campaignId)
            const campaignService = getCampaignService();
            const response = await campaignService.getCampaign(campaignId)
            console.log("response from campaign ", response)
            setCampaign(response.data)
            setCampaignType(response.data.type)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <div className="overflow-y-auto h-screen">
         {campaign && campaignType && <HeaderBar organizationId={organizationId} campaignType={campaignType} campaign={campaign} campaignId={campaignId}/>}
         {children}
      </div>
   )
}

export default CampaignPageLayout