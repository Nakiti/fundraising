

const Insights = () => { //campaign insight, TODO

   return (
      <div className="p-6 space-y-6">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Raised Section */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">Fundraising Progress</h2>
               </div>
               <div className="p-6">
                  <div className="mb-6">
                     <p className="text-sm text-gray-600 mb-2">Total Amount Raised</p>
                     <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-3xl font-bold text-gray-900">$87</p>
                        <p className="text-lg text-gray-500">of $1,000 goal</p>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div className="bg-blue-600 h-3 rounded-full" style={{ width: '8.7%' }}></div>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Gross Raised</p>
                        <p className="text-2xl font-bold text-gray-900">$123,456</p>
                     </div>
                     <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">After Fees</p>
                        <p className="text-2xl font-bold text-gray-900">$111,456</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Performance Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">Performance</h2>
               </div>
               <div className="p-6 space-y-6">
                  <div className="space-y-2">
                     <p className="text-sm font-medium text-gray-600">Total Donations</p>
                     <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-sm font-medium text-gray-600">Total Visits</p>
                     <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                     <p className="text-2xl font-bold text-gray-900">0%</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-sm font-medium text-gray-600">Average Donation</p>
                     <p className="text-2xl font-bold text-gray-900">$0</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Insights