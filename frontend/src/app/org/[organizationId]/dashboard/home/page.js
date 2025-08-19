"use client"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "@/app/context/authContext"
import { 
   getAllCampaigns, 
   getCampaignsFiltered, 
   getTransactionsOverTime, 
   getUserData,
   getDashboardSummary,
   getRecentDonations,
   getTopCampaigns,
   getOrganizationStatus,
   getDashboardNotifications
} from "@/app/services/fetchService"
import Link from "next/link"
import { MdOpenInNew, MdTrendingUp, MdTrendingDown, MdMoreVert } from "react-icons/md";
import { FaHandHoldingHeart, FaUserPlus, FaDollarSign, FaCalendarAlt, FaChartLine, FaBell, FaPlus, FaEye } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { BsArrowUpRight, BsArrowDownRight } from "react-icons/bs";
import Modal from "../campaigns/components/modal"

/*
   Component: Home
   Description: Renders the modern home dashboard
 */
const Home = ({params}) => {
   const {currentUser} = useContext(AuthContext)
   const organizationId = params.organizationId
   const [campaigns, setCampaigns] = useState(null)
   const [active, setActive] = useState("week")
   const [summaryData, setSummaryData] = useState(null)
   const [recentDonations, setRecentDonations] = useState([])
   const [topCampaigns, setTopCampaigns] = useState([])
   const [organizationStatus, setOrganizationStatus] = useState(null)
   const [notifications, setNotifications] = useState([])
   const [loading, setLoading] = useState(true)
   const [showModal, setShowModal] = useState(false)

   // Generate quick stats from summary data
   const quickStats = summaryData ? [
      { 
         label: "Total Donations", 
         value: summaryData.totalDonations?.value || 0, 
         change: `${summaryData.totalDonations?.change || 0}%`, 
         trend: summaryData.totalDonations?.trend || "up", 
         icon: <FaHandHoldingHeart className="text-blue-500" /> 
      },
      { 
         label: "New Supporters", 
         value: summaryData.newSupporters?.value || 0, 
         change: `${summaryData.newSupporters?.change || 0}%`, 
         trend: summaryData.newSupporters?.trend || "up", 
         icon: <FaUserPlus className="text-green-500" /> 
      },
      { 
         label: "Total Raised", 
         value: `$${summaryData.totalRaised?.value || 0}`, 
         change: `${summaryData.totalRaised?.change || 0}%`, 
         trend: summaryData.totalRaised?.trend || "up", 
         icon: <FaDollarSign className="text-purple-500" /> 
      },
      { 
         label: "Active Campaigns", 
         value: summaryData.activeCampaigns?.value || 0, 
         change: `${summaryData.activeCampaigns?.change || 0}%`, 
         trend: summaryData.activeCampaigns?.trend || "up", 
         icon: <IoIosStats className="text-orange-500" /> 
      },
   ] : []

   const statistics = [
      { label: "Donations", value: summaryData?.totalDonations?.value || 0, icon: <FaHandHoldingHeart size={36} className="text-blue-700 mb-3" /> },
      { label: "New Supporters", value: summaryData?.newSupporters?.value || 0, icon: <FaUserPlus size={36} className="text-blue-700 mb-3" /> },
      { label: "Raised", value: `$${summaryData?.totalRaised?.value || 0}`, icon: <FaDollarSign size={36} className="text-blue-700 mb-3" /> },
   ]

   /*
      Description: Updates summary statistics based on the active state
   */
   useEffect(() => {
      fetchDashboardData();
   }, [active, organizationId])

   /*
      Description: Fetches all dashboard data
   */
   const fetchDashboardData = async () => {
      setLoading(true);
      try {
         const [
            summaryResponse,
            donationsResponse,
            campaignsResponse,
            statusResponse,
            notificationsResponse
         ] = await Promise.all([
            getDashboardSummary(organizationId, active),
            getRecentDonations(organizationId, 10),
            getTopCampaigns(organizationId, 5),
            getOrganizationStatus(organizationId),
            getDashboardNotifications(organizationId, 10)
         ]);

         setSummaryData(summaryResponse);
         setRecentDonations(donationsResponse);
         setTopCampaigns(campaignsResponse);
         setOrganizationStatus(statusResponse);
         setNotifications(notificationsResponse);
      } catch (err) {
         console.log('Error fetching dashboard data:', err);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      const fetchData = async() => {
         try {
            const campaignsResponse = await getCampaignsFiltered(organizationId, "active", "all")
            setCampaigns(campaignsResponse)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [currentUser, organizationId])

   /*
      Function: formatTimeAgo
      Description: Formats a date to a relative time string
      Arguments:
         - date: date string or Date object
   */
   const formatTimeAgo = (date) => {
      const now = new Date();
      const past = new Date(date);
      const diffInSeconds = Math.floor((now - past) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
   }

   const handleFilterClick = (active) => {
      setActive(active);
   };

   return (
      <div className="w-full h-full bg-gray-50">
         <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your organization.</p>
               </div>
               <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors duration-200">
                     <FaBell className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowModal(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                     <FaPlus className="w-4 h-4" />
                     <span>New Campaign</span>
                  </button>
               </div>
            </div>

            {/* Time Filter */}
            <div className="flex justify-end">
               <div className="flex bg-white rounded-lg p-1 shadow-sm">
                  {["week", "month", "year"].map((period) => (
                     <button
                        key={period}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        active === period 
                           ? "bg-blue-600 text-white shadow-sm" 
                           : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => handleFilterClick(period)}
                     >
                        {`This ${period.charAt(0).toUpperCase() + period.slice(1)}`}
                     </button>
                  ))}
               </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {loading ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
                     <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="animate-pulse">
                           <div className="flex items-center justify-between">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                              <div className="w-16 h-4 bg-gray-200 rounded"></div>
                           </div>
                           <div className="mt-4">
                              <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
                              <div className="w-24 h-4 bg-gray-200 rounded"></div>
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  quickStats.map((stat, index) => (
                     <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                           <div className="p-2 bg-gray-50 rounded-lg">
                              {stat.icon}
                           </div>
                           <div className={`flex items-center text-sm font-medium ${
                              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                           }`}>
                              {stat.trend === 'up' ? <BsArrowUpRight className="w-4 h-4 mr-1" /> : <BsArrowDownRight className="w-4 h-4 mr-1" />}
                              {stat.change}
                           </div>
                        </div>
                        <div className="mt-4">
                           <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                           <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                        </div>
                     </div>
                  ))
               )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Recent Activity */}
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
                              <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                 <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-blue-600">{donation.avatar}</span>
                                    </div>
                                    <div>
                                       <p className="font-medium text-gray-900">{donation.name}</p>
                                       <p className="text-sm text-gray-600">{donation.campaign}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="font-semibold text-green-600">${donation.amount}</p>
                                    <p className="text-xs text-gray-500">{formatTimeAgo(donation.time)}</p>
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

               {/* Top Campaigns */}
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
                              <div key={index} className="p-4 border border-gray-100 rounded-lg">
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
                                 <div className="flex justify-between text-xs text-gray-500">
                                    <span>{campaign.donors} donors</span>
                                    <span>{campaign.percentageFunded}% funded</span>
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
            </div>

            {/* Organization Status */}
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
                              <BsArrowUpRight className="text-green-600" />
                           </Link>
                           <Link href={`/org/${organizationId}/dashboard/settings`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                              <div className="flex items-center space-x-3">
                                 <FaCalendarAlt className="text-gray-600" />
                                 <span className="text-sm font-medium text-gray-900">Organization Settings</span>
                              </div>
                              <BsArrowUpRight className="text-gray-600" />
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {showModal && <Modal setShow={setShowModal} organizationId={organizationId}/>}
      </div>
   )
}

export default Home