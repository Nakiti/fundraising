"use client"
import { FaEye, FaToggleOn, FaCalendarAlt, FaDollarSign } from "react-icons/fa"
import { IoIosStats } from "react-icons/io"
import { BsArrowUpRight } from "react-icons/bs"
import { MdOpenInNew } from "react-icons/md"
import Link from "next/link"

const OrganizationStatus = ({ organizationStatus, loading, organizationId }) => {
   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
         <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Organization Status</h2>
            <p className="text-sm text-gray-600 mt-1">Overview of your organization's health</p>
         </div>
         <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-medium text-gray-900">Organization Status</h3>
                     <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        organizationStatus?.organization?.status === 'active' 
                           ? 'bg-green-100 text-green-800' 
                           : 'bg-yellow-100 text-yellow-800'
                     }`}>
                        {organizationStatus?.organization?.status || 'Unknown'}
                     </span>
                  </div>
                  <div className="space-y-4">
                     {loading ? (
                        // Loading skeleton
                        Array.from({ length: 3 }).map((_, index) => (
                           <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                 <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                                 <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                              </div>
                              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                           </div>
                        ))
                     ) : organizationStatus ? (
                        Object.entries(organizationStatus.pages || {}).map(([pageType, status]) => (
                           <div key={pageType} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                 <h4 className="text-sm font-medium text-gray-700 capitalize">{pageType} Page</h4>
                                 <Link href={`/org/${organizationId}/page/${pageType}`}>
                                    <FaEye className="text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                                 </Link>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                 status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                 {status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                           </div>
                        ))
                     ) : (
                        <div className="text-center py-4 text-gray-500">
                           <p>No page information available</p>
                        </div>
                     )}
                  </div>
               </div>
               <div>
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                  </div>
                  <div className="space-y-3">
                     <Link href={`/org/${organizationId}/dashboard/campaigns`} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                           <IoIosStats className="text-blue-600" />
                           <span className="text-sm font-medium text-blue-900">Manage Campaigns</span>
                        </div>
                        <BsArrowUpRight className="text-blue-600" />
                     </Link>
                     <Link href={`/org/${organizationId}/dashboard/transactions`} className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                           <FaDollarSign className="text-green-600" />
                           <span className="text-sm font-medium text-green-900">View Transactions</span>
                        </div>
                        <BsArrowUpRight className="text-blue-600" />
                     </Link>
                     <Link href={`/org/${organizationId}/dashboard/settings/activation`} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                           <FaToggleOn className="text-emerald-600" />
                           <span className="text-sm font-medium text-emerald-900">Organization Activation</span>
                        </div>
                        <BsArrowUpRight className="text-emerald-600" />
                     </Link>
                     <Link href={`/org/${organizationId}/dashboard/settings`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                           <FaCalendarAlt className="text-gray-600" />
                           <span className="text-sm font-medium text-gray-900">Organization Settings</span>
                        </div>
                        <BsArrowUpRight className="text-gray-600" />
                     </Link>
                     <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                           <FaDollarSign className="text-purple-600" />
                           <span className="text-sm font-medium text-purple-900">Stripe Dashboard</span>
                        </div>
                        <MdOpenInNew className="text-purple-600" />
                     </a>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default OrganizationStatus
