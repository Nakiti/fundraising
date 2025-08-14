"use client"
import Box from "./box"

/*
   Component: Summary
   Description: Displays the summary data based on campaigns
   Props:
      - data: the campaigns
*/
const Summary = ({data}) => {
   // calculates each statistic appropriately 
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Box 
            title="Total Raised" 
            value={summary.totalRaised ? `$${summary.totalRaised.toLocaleString()}` : "$0"}
            subtitle="Across all campaigns"
         />
         <Box 
            title="Total Donations" 
            value={summary.totalDonations ? summary.totalDonations.toLocaleString() : "0"}
            subtitle="Total contributions"
         />
         <Box 
            title="Total Visits" 
            value={summary.totalVisits ? summary.totalVisits.toLocaleString() : "0"}
            subtitle="Page visits"
         />
         <Box 
            title="Avg. Conversion" 
            value={summary.averageConversionRate ? `${summary.averageConversionRate.toFixed(1)}%` : "0%"}
            subtitle="Donation rate"
         />
      </div>
   )
}

export default Summary