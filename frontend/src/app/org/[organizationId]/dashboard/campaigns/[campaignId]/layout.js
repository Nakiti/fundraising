"use client"
import { useEffect, useState } from "react";
import { getCampaignDetails } from "@/app/services/fetchService";
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
            const response = await getCampaignDetails(campaignId)
            console.log("response from campaign ", response)
            setCampaign(response)
            setCampaignType(response.type)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <div className="overflow-y-auto h-screen">
         <HeaderBar organizationId={organizationId} campaignType={campaignType} campaign={campaign} campaignId={campaignId}/>
         {children}
      </div>
   )
}

export default CampaignPageLayout