

const CampaignInfo = ({setPage, setGifts, campaignInfo, handleCampaignInfoChange, setCampaignInfo}) => {

   const handleAdd = () => {
      setGifts((prev) => [...prev, campaignInfo])
      setCampaignInfo({
         amount: 0,
         designation: 0
      })
   }


   return (
      <div className="w-1/2 bg-white p-4 pb-12 mx-auto">
         <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">Donation Details</h1>

         <div className="space-y-6">
            <div className="space-y-2">
               <h3 className="text-lg font-semibold text-gray-700">I would like to give to:</h3>
               <select className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select an option</option>
               </select>
            </div>

            <div className="border-b border-blue-600"/>

            <div className="space-y-2">
               <h3 className="text-lg font-semibold text-gray-700">I would like to give:</h3>
               <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                  <button className="w-full py-2 bg-blue-600 text-white rounded-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">$50</button>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">$100</button>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">$200</button>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">$500</button>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">$50</button>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">$100</button>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">$200</button>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">$500</button>
               </div>
            </div>

            <div className="border-b border-blue-600"/>

            <div className="flex justify-around max-w-sm mx-auto">
               <button 
                  className="px-8 py-2 bg-blue-700 text-white rounded-sm shadow hover:bg-gray-800 transition-colors duration-200"
                  onClick={handleAdd}
               >
                  Add Another Gift
               </button>
               <button 
                  className="px-8 py-2 bg-blue-700 text-white rounded-sm shadow hover:bg-blue-800 transition-colors duration-200"
                  onClick={() => setPage(2)}
               >
                  Continue
               </button>
            </div>
         </div>
      </div>

   )
}

export default CampaignInfo