"use client"
import Box from "./box"

/*
   Component: Summary
   Description: Displays the summary data based on campaigns
   Props:
      - data: the campaigns
*/
const Summary = ({data}) => {
   // calculates each statistic appropriatly 
   const summary = {
      totalDonations: data.reduce((acc, campaign) => acc + campaign.donations, 0),
      totalRaised: data.reduce((acc, campaign) => acc + Number(campaign.amount_raised), 0),
      totalVisits: data.reduce((acc, campaign) => acc + Number(campaign.visits), 0),
      averageRaised: data.reduce((acc, campaign) => acc + Number(campaign.amount_raised), 0) / data.length,
      averageConversionRate: data.reduce((acc, campaign) => {
         const conversionRate = campaign.visits > 0 ? (Number(campaign.donations) / Number(campaign.visits)) * 100 : 0;
         return acc + conversionRate;
      }, 0) / data.length,
   }

   return (
      <div className="flex justify-between items-center gap-4 p-6">
         <Box text={"Total Raised: " + (summary.totalRaised || "-")}/>
         <Box text={"Total Donations: " + (summary.totalDonations || "-")}/>
         {/* <Box text={"Total Visits: " + summary.totalVisits}/> */}
         <Box text={"Average Raised: " + (summary.averageRaised || "-")}/>
         <Box text={"Average Conversion Rate: " + (summary.averageConversionRate || "-")}/>
         {/* <Box text={"Average Conversion Rate: " + summary.averageConversionRate}/> */}
      </div>
   )
}

export default Summary