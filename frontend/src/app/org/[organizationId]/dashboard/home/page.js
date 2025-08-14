"use client"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "@/app/context/authContext"
import { getAllCampaigns, getCampaignsFiltered, getTransactionsOverTime, getUserData } from "@/app/services/fetchService"
import Link from "next/link"
import { MdOpenInNew, MdTrendingUp, MdTrendingDown, MdMoreVert } from "react-icons/md";
import { FaHandHoldingHeart, FaUserPlus, FaDollarSign, FaCalendarAlt, FaChartLine, FaBell, FaPlus, FaEye } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { BsArrowUpRight, BsArrowDownRight } from "react-icons/bs";

/*
   Component: Home
   Description: Renders the modern home dashboard
 */
const Home = ({params}) => {
   const {currentUser} = useContext(AuthContext)
   const organizationId = params.organizationId
   const [campaigns, setCampaigns] = useState(null)
   const [active, setActive] = useState("week")
   const [summaryData, setSummaryData] = useState({donation: 0, newSupporters: 0, raised: 0,})

   // Dummy data for enhanced features
   const dummyData = {
      recentDonations: [
         { id: 1, name: "Sarah Johnson", amount: 150, campaign: "Temple Renovation", time: "2 hours ago", avatar: "SJ" },
         { id: 2, name: "Michael Chen", amount: 75, campaign: "Community Outreach", time: "4 hours ago", avatar: "MC" },
         { id: 3, name: "Priya Patel", amount: 200, campaign: "Temple Renovation", time: "6 hours ago", avatar: "PP" },
         { id: 4, name: "David Kim", amount: 50, campaign: "Youth Programs", time: "8 hours ago", avatar: "DK" },
      ],
      topCampaigns: [
         { name: "Temple Renovation", raised: 12500, goal: 20000, donors: 89, trend: "+12%" },
         { name: "Community Outreach", raised: 8200, goal: 15000, donors: 67, trend: "+8%" },
         { name: "Youth Programs", raised: 5600, goal: 10000, donors: 45, trend: "+15%" },
      ],
      quickStats: [
         { label: "Total Donations", value: summaryData.donation || 156, change: "+23%", trend: "up", icon: <FaHandHoldingHeart className="text-blue-500" /> },
         { label: "New Supporters", value: 6, change: "+12%", trend: "up", icon: <FaUserPlus className="text-green-500" /> },
         { label: "Total Raised", value: `$${summaryData.raised || 26300}`, change: "+18%", trend: "up", icon: <FaDollarSign className="text-purple-500" /> },
         { label: "Active Campaigns", value: campaigns?.length || 5, change: "+2", trend: "up", icon: <IoIosStats className="text-orange-500" /> },
      ],
      notifications: [
         { id: 1, message: "New donation received from Sarah Johnson", time: "2 hours ago", type: "donation" },
         { id: 2, message: "Campaign 'Temple Renovation' reached 60% of goal", time: "4 hours ago", type: "milestone" },
         { id: 3, message: "New supporter registered", time: "6 hours ago", type: "supporter" },
      ]
   }

   const statistics = [
      { label: "Donations", value: summaryData.donation, icon: <FaHandHoldingHeart size={36} className="text-blue-700 mb-3" /> },
      { label: "New Supporters", value: 6, icon: <FaUserPlus size={36} className="text-blue-700 mb-3" /> },
      { label: "Raised", value: `$${summaryData.raised || 0}`, icon: <FaDollarSign size={36} className="text-blue-700 mb-3" /> },
   ]

   /*
      Description: Updates summary statistices based on the active state
   */
   useEffect(() => {
      let start;
      let end = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      if (active === "week") {
         const weekAgo = new Date();
         weekAgo.setDate(weekAgo.getDate() - 7);
         start = weekAgo.toISOString().slice(0, 19).replace('T', ' ');
      } else if (active === "month") {
         const monthAgo = new Date();
         monthAgo.setDate(monthAgo.getDate() - 30);
         start = monthAgo.toISOString().slice(0, 19).replace('T', ' ');
      } else {
         const yearAgo = new Date();
         yearAgo.setFullYear(yearAgo.getFullYear() - 1);
         start = yearAgo.toISOString().slice(0, 19).replace('T', ' ');
      }
   
      fetchTransactions(start, end);
   }, [active])

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
   }, [currentUser])

   /*
      Function: fetchTransactions
      Description: Retrieves transactions over a given time period
      Arguments:
         - start: start date
         - end: end date
   */
   const fetchTransactions = async(start, end) => {
      try {
         const response = await getTransactionsOverTime(organizationId, start, end)
         setSummaryData({donation: response.transactionsCount, raised: response.totalRaised})
      } catch (err) {
         console.log(err)
      }
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
                  <Link href={`/org/${organizationId}/dashboard/campaigns`} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                     <FaPlus className="w-4 h-4" />
                     <span>New Campaign</span>
                  </Link>
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
               {dummyData.quickStats.map((stat, index) => (
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
               ))}
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
                        {dummyData.recentDonations.map((donation) => (
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
                                 <p className="text-xs text-gray-500">{donation.time}</p>
                              </div>
                           </div>
                        ))}
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
                        {dummyData.topCampaigns.map((campaign, index) => (
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
                                       style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                                    ></div>
                                 </div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                 <span>{campaign.donors} donors</span>
                                 <span>{Math.round((campaign.raised / campaign.goal) * 100)}% funded</span>
                              </div>
                           </div>
                        ))}
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
                           <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Active</span>
                        </div>
                        <div className="space-y-4">
                           {["Landing", "Impact", "About"].map((page) => (
                              <div key={page} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                 <div className="flex items-center space-x-3">
                                    <h4 className="text-sm font-medium text-gray-700">{page} Page</h4>
                                    <Link href={`/org/${organizationId}/page/${page.toLowerCase()}`}>
                                       <FaEye className="text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                                    </Link>
                                 </div>
                                 <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                              </div>
                           ))}
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
      </div>
   )
}

export default Home