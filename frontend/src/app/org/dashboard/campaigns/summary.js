"use client"
import axios from "axios"
import { useEffect, useContext, useState } from "react"
import { AuthContext, } from "@/app/context/authContext"
import { getAllCampaigns } from "@/app/services/fetchService"
import Box from "./box"

const Summary = () => {
   const {currentUser} = useContext(AuthContext)

   const [data, setData] = useState(null)
   const [summary, setSummary] = useState({
      totalDonations: 0,
      totalRaised: 0,
      totalVisits: 0,
      averageRaised: 0,
      averageConversionRate: 0,
   });


   useEffect(() => {
      const campaigns = getAllCampaigns(currentUser.organization_id);
      setData(campaigns);

      if (campaigns && campaigns.length > 0) {
         const totalDonations = campaigns.reduce((acc, campaign) => acc + campaign.donations, 0);
         const totalRaised = campaigns.reduce((acc, campaign) => acc + campaign.raised, 0);
         const totalVisits = campaigns.reduce((acc, campaign) => acc + campaign.visits, 0);
         const averageRaised = totalRaised / campaigns.length;
         const averageConversionRate = campaigns.reduce((acc, campaign) => {
            const conversionRate = campaign.visits > 0 ? (campaign.donations / campaign.visits) * 100 : 0;
            return acc + conversionRate;
         }, 0) / campaigns.length;

         setSummary({
            totalDonations,
            totalRaised,
            totalVisits,
            averageRaised,
            averageConversionRate,
         });
      }
   }, [])

   return (
      <div className="flex justify-between items-center gap-4 p-8">
         <Box text={"Total Raised: " + summary.totalRaised}/>
         <Box text={"Total Donations: " + summary.totalDonations}/>
         <Box text={"Total Visits: " + summary.totalVisits}/>
         <Box text={"Average Raised: " + summary.averageRaised}/>
         {/* <Box text={"Average Conversion Rate: " + summary.averageConversionRate}/> */}
      </div>
   )
}

export default Summary