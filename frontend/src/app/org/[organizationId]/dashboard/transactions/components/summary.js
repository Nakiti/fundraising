import Box from "../../campaigns/components/box"

const Summary = () => {


   return (
      <div className="flex justify-between items-center gap-6 px-8 mt-6 mb-6">
         <Box text={"Total Raised: " }/>
         <Box text={"Total Donations: " }/>
         <Box text={"Total Visits: " }/>
         <Box text={"Average Raised: " }/>
         <Box text={"Average Raised: " }/>

         {/* <Box text={"Average Conversion Rate: " + summary.averageConversionRate}/> */}
      </div>
   )
}

export default Summary