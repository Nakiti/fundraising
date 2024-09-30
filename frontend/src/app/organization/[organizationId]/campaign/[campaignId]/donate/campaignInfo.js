import { getCampaignDesignations } from "@/app/services/fetchService"
import { useEffect, useState } from "react"

const CampaignInfo = ({setPage, setGifts, campaignInfo, handleCampaignInfoChange, setCampaignInfo, campaignId, designations}) => {
   const [data, setData] = useState(null)

   const handleAdd = () => {
      setGifts((prev) => [...prev, campaignInfo])
      setCampaignInfo({
         id: new Date(),
         amount: 0,
         designationId: 0,
         designationTitle: "",
      })
   }

   const handleContinue = () => {
      setGifts(prev => [...prev, campaignInfo])
      setPage(2)
   }

   const amounts = [10, 25, 50, 75, 100, 150, 200, 500];

   const handleAmount = (e) => {
      setCampaignInfo(prev => ({...prev, amount: e.target.value}))
   }  

   const handleDesignationChange = (e) => {
      setCampaignInfo(prev => ({...prev, designationId: e.target.id, designationTitle: e.target.value}))
      console.log(campaignInfo)
   }

   return (
      <div className="w-1/2 p-4 mx-auto">
         <h1 className="text-5xl font-bold text-gray-800 mb-12 text-center">Donation Details</h1>

         <div className="">
            <div className="space-y-2 py-8">
               <h3 className="text-lg font-semibold text-gray-700 mb-4">I would like to give to:</h3>
               <select 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleDesignationChange}
                  defaultValue=""
               >
                  <option disabled value="">Select an option</option>
                  {designations && designations.map((item) => {
                     return <option key={item.id} id={item.id} value={item.title}>{item.title}</option>
                  })}
               </select>
            </div>

            <div className="border-b border-blue-600"/>

            <div className="py-8">
               <h3 className="text-lg font-semibold text-gray-700 mb-8">I would like to give:</h3>
               <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                  {amounts.map((amount, index) => (
                     <button
                        key={index}
                        className="w-full py-2 bg-blue-600 text-white rounded-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={amount}
                        onClick={handleAmount}
                     >
                     ${amount}
                     </button>
                  ))}
                  <input 
                     placeholder="Enter Custom Amount" 
                     type="number" 
                     className="w-full col-start-1 col-end-3 py-2 px-4 bg-gray-50 border-2 border-blue-600 text-black rounded-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-500" 
                     onChange={handleAmount}
                     value={campaignInfo.amount}
                  />

               </div>
            </div>

            <div className="border-b border-blue-600"/>

            <div className="flex justify-around max-w-sm mx-auto py-8">
               <button 
                  className="px-8 py-2 bg-blue-700 text-white rounded-sm shadow hover:bg-gray-800 transition-colors duration-200"
                  onClick={handleAdd}
               >
                  Add Another Gift
               </button>
               <button 
                  className="px-8 py-2 bg-blue-700 text-white rounded-sm shadow hover:bg-blue-800 transition-colors duration-200"
                  onClick={handleContinue}
               >
                  Continue
               </button>
            </div>
         </div>
      </div>

   )
}

export default CampaignInfo