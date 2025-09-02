"use client"
import Link from "next/link"

const TopCampaigns = ({ topCampaigns, loading, organizationId }) => {
   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
         <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Top Campaigns</h2>
            <p className="text-sm text-gray-600 mt-1">Most successful fundraising</p>
         </div>
         <div className="p-6">
            <div className="space-y-4">
               {loading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                     <div key={index} className="p-4 border border-gray-100 rounded-lg">
                        <div className="animate-pulse">
                           <div className="flex items-center justify-between mb-2">
                              <div className="w-32 h-4 bg-gray-200 rounded"></div>
                              <div className="w-12 h-4 bg-gray-200 rounded"></div>
                           </div>
                           <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                 <div className="w-16 h-3 bg-gray-200 rounded"></div>
                                 <div className="w-20 h-3 bg-gray-200 rounded"></div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2"></div>
                           </div>
                           <div className="flex justify-between text-xs">
                              <div className="w-16 h-3 bg-gray-200 rounded"></div>
                              <div className="w-20 h-3 bg-gray-200 rounded"></div>
                           </div>
                        </div>
                     </div>
                  ))
               ) : topCampaigns.length > 0 ? (
                  topCampaigns.map((campaign, index) => (
                     <div key={index} className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                           <span className="text-sm font-medium text-green-600">{campaign.trend}</span>
                        </div>
                        <div className="mb-3">
                           <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>${campaign.raised.toLocaleString()}</span>
                              <span>${campaign.goal.toLocaleString()}</span>
                           </div>
                           <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                 style={{ width: `${campaign.percentageFunded}%` }}
                              ></div>
                           </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                           <span>{campaign.donors} donors</span>
                           <span>{campaign.percentageFunded}% funded</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Active
                           </span>
                           <Link href={`/org/${organizationId}/campaign/${campaign.id}`} className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200">
                              View Details →
                           </Link>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="text-center py-8 text-gray-500">
                     <p>No active campaigns</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

export default TopCampaigns
