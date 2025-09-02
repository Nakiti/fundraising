"use client"

const RecentActivity = ({ recentDonations, loading, formatTimeAgo }) => {
   return (
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
         <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600 mt-1">Latest donations and updates</p>
         </div>
         <div className="p-6">
            <div className="space-y-4">
               {loading ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
                     <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                           <div>
                              <div className="w-24 h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
                              <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="w-16 h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
                           <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                     </div>
                  ))
               ) : recentDonations.length > 0 ? (
                  recentDonations.map((donation) => (
                     <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                               <span className="text-sm font-medium text-blue-600">{donation.avatar}</span>
                           </div>
                           <div>
                              <p className="font-medium text-gray-900">{donation.name}</p>
                              <p className="text-sm text-gray-600">{donation.campaign}</p>
                              <p className="text-xs text-gray-500">Transaction ID: {donation.id}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-semibold text-green-600">${parseFloat(donation.amount).toLocaleString()}</p>
                           <p className="text-xs text-gray-500">{formatTimeAgo(donation.time)}</p>
                           <div className="flex items-center justify-end mt-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                 Completed
                              </span>
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="text-center py-8 text-gray-500">
                     <p>No recent donations</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

export default RecentActivity
