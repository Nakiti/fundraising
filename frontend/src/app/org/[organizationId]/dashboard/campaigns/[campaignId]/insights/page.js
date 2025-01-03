

const Insights = () => { //campaign insight, TODO

   return (
      <div className="p-8 w-full grid grid-cols-4 gap-4 grid-rows-3">
         <div className="bg-white rounded-lg shadow-sm col-start-1 col-end-4 row-start-1 row-end-2">
            
            <h1 className="text-2xl text-gray-800 font-semibold px-6 py-4 border-b border-gray-300">Raised:</h1>
            <div className="px-6 py-4">
               <p className="text-sm text-gray-700 mb-4">Total Amount</p>
               <div className="flex flex-row items-center mb-4">
                  <p className="text-md font-semibold text-gray-800">87 Raised</p>
                  <p className="text-md ml-2 text-gray-600">100 out of goal</p>
               </div>
               <div className="w-full bg-green-200 rounded-full h-2 mb-4">
                  <div className="bg-green-600 h-2 rounded-full w-1/12"></div>
               </div>
               <div className="flex flex-row w-full justify-between items-center px-4">
                  <div className="flex flex-col items-center justify-center">
                     <p className="text-sm text-gray-600">Gross Raised:</p>
                     <p className="text-md font-semibold text-gray-800">$123,456</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <p className="text-sm text-gray-600">After Fees:</p>
                     <p className="text-md font-semibold text-gray-800">$1,123,456</p>
                  </div>               
               </div>
            </div>
         </div>

         <div className="bg-white rounded-lg shadow-sm col-start-4 col-end-5 row-start-1 row-end-3">
            <h1 className="text-2xl text-gray-800 font-semibold px-6 py-4 border-b border-gray-300">Performance</h1>

            <div className="px-6 py-4">
               <div className="flex flex-col items-start mb-4">
                  <p className="text-sm font-semibold text-gray-600">Total Donations:</p>
                  <p className="text-lg ml-2 text-gray-800">0</p>
               </div>
               <div className="flex flex-col items-start mb-4">
                  <p className="text-sm font-semibold text-gray-600">Total Visits:</p>
                  <p className="text-lg ml-2 text-gray-800">0</p>
               </div>
               <div className="flex flex-col items-start mb-4">
                  <p className="text-sm font-semibold text-gray-600">Conversion Rate:</p>
                  <p className="text-lg ml-2 text-gray-800">0</p>
               </div>
               <div className="flex flex-col items-start mb-4">
                  <p className="text-sm font-semibold text-gray-600">Average Donation:</p>
                  <p className="text-lg ml-2 text-gray-800">0</p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Insights