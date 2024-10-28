

const Insights = () => {

   return (
      <div className="p-8 w-full grid grid-cols-4 gap-4 grid-rows-3">
         
         <div className="bg-white rounded-lg shadow-md col-start-1 p-8 col-end-4 row-start-1 row-end-2">
            <h1 className="text-2xl mb-6 text-gray-800">Raised:</h1>
            <p className="text-sm text-gray-700">Total Amount</p>
            <div className="flex flex-row">
               <p className="text-md mb-2 font-bold">87 Raised</p>
               <p className="text-md mb-2 ml-1">100 out of goal</p>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2 mb-4">
               <div className="bg-green-600 h-2 rounded-full w-1/12"></div>
            </div>
            <div className="flex flex-row w-full justify-between items-center px-4">
               <div className="flex flex-col items-center justify-center">
                  <p className="text-sm">Gross Raised:</p>
                  <p className="text-md font-bold">$123,456</p>
               </div>
               <div className="flex flex-col items-center justify-center">
                  <p className="text-sm ">After Fees:</p>
                  <p className="text-md font-bold">$1,123,456</p>
               </div>               
            </div>
         </div>

         <div className="bg-white rounded-md shadow-md p-8 col-start-4 col-end-5 row-start-1 row-end-3">
            <h1 className="text-2xl mb-6 text-gray-800">Performance</h1>

            <div>
               <div className="flex flex-col items-start mb-2">
                  <p className="text-sm font-bold">Total Donations:</p>
                  <p className="text-lg ml-2">0</p>
               </div>
               <div className="flex flex-col items-start mb-2">
                  <p className="text-sm font-bold">Total Visits:</p>
                  <p className="text-lg ml-2">0</p>
               </div>
               <div className="flex flex-col items-start mb-2">
                  <p className="text-sm font-bold">Conversion Rate:</p>
                  <p className="text-lg ml-2">0</p>
               </div>
               <div className="flex flex-col items-start mb-2">
                  <p className="text-sm font-bold">Average Donation:</p>
                  <p className="text-lg ml-2">0</p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Insights