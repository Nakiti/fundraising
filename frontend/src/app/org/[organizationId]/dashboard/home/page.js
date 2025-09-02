"use client"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "@/app/context/authContext"
import { 
   getCampaignService,
   getDashboardService,
   getOrganizationService
} from "@/app/services"
import { 
   DashboardHeader,
   ActivationBanner,
   ErrorDisplay,
   TimeFilter,
   QuickStatsGrid,
   RecentActivity,
   TopCampaigns,
   OrganizationStatus,
   LoadingSkeleton
} from "./components"

/*
   Component: Home
   Description: Renders the modern home dashboard using modular components
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
   const [initialLoading, setInitialLoading] = useState(true)
   const [error, setError] = useState(null)
   const [showModal, setShowModal] = useState(false)

   // Get service instances
   const dashboardService = getDashboardService();
   const campaignService = getCampaignService();
   const organizationService = getOrganizationService();

   // Generate quick stats from summary data with enhanced Stripe integration info
   const quickStats = summaryData ? [
      { 
         label: "Total Donations", 
         value: summaryData.totalDonations?.value?.toLocaleString() || 0, 
         change: `${summaryData.totalDonations?.change || 0}%`, 
         trend: summaryData.totalDonations?.trend || "up", 
         icon: <FaHandHoldingHeart className="text-blue-500" />,
         subtitle: "Completed transactions"
      },
      { 
         label: "New Supporters", 
         value: summaryData.newSupporters?.value?.toLocaleString() || 0, 
         change: `${summaryData.newSupporters?.change || 0}%`, 
         trend: summaryData.newSupporters?.trend || "up", 
         icon: <FaUserPlus className="text-green-500" />,
         subtitle: "First-time donors"
      },
      { 
         label: "Total Raised", 
         value: `$${(summaryData.totalRaised?.value || 0).toLocaleString()}`, 
         change: `${summaryData.totalRaised?.change || 0}%`, 
         trend: summaryData.totalRaised?.trend || "up", 
         icon: <FaDollarSign className="text-purple-500" />,
         subtitle: "Net revenue"
      },
      { 
         label: "Active Campaigns", 
         value: summaryData.activeCampaigns?.value?.toLocaleString() || 0, 
         change: `${summaryData.activeCampaigns?.change || 0}%`, 
         trend: summaryData.activeCampaigns?.trend || "up", 
         icon: <IoIosStats className="text-orange-500" />,
         subtitle: "Live fundraisers"
      },
   ] : []

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
      setError(null);
      try {
         const [
            summaryResponse,
            donationsResponse,
            campaignsResponse,
            statusResponse,
            notificationsResponse
         ] = await Promise.all([
            dashboardService.getDashboardSummary(organizationId, active),
            dashboardService.getRecentDonations(organizationId, 10),
            dashboardService.getTopCampaigns(organizationId, 5),
            dashboardService.getOrganizationStatus(organizationId),
            dashboardService.getDashboardNotifications(organizationId, 10)
         ]);

         console.log("top campaigns", campaignsResponse)
         console.log("status", statusResponse)
         console.log("notifications", notificationsResponse)
         console.log("summary", summaryResponse)
         console.log("donations", donationsResponse)

         setSummaryData(summaryResponse.data);
         setRecentDonations(donationsResponse);
         setTopCampaigns(campaignsResponse);
         setOrganizationStatus(statusResponse);
         setNotifications(notificationsResponse);
      } catch (err) {
         console.error('Error fetching dashboard data:', err);
         setError('Failed to load dashboard data. Please try again.');
      } finally {
         setLoading(false);
         setInitialLoading(false);
      }
   }

   useEffect(() => {
      const fetchData = async() => {
         try {
            const campaignsResponse = await campaignService.getFilteredCampaigns(organizationId, { status: "active", type: "all" })
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

   // Show initial loading state
   if (initialLoading) {
      return <LoadingSkeleton />
   }

   return (
      <div className="w-full bg-gray-50">
         <div className="p-6 space-y-6">
            {/* Organization Activation Banner */}
            <ActivationBanner 
               organizationStatus={organizationStatus} 
               organizationId={organizationId} 
            />

            {/* Header Section */}
            <DashboardHeader 
               onRefresh={fetchDashboardData}
               loading={loading}
               showModal={showModal}
               setShowModal={setShowModal}
               organizationId={organizationId}
            />

            {/* Error Display */}
            <ErrorDisplay 
               error={error} 
               onDismiss={() => setError(null)} 
            />

            {/* Time Filter */}
            <TimeFilter 
               active={active} 
               onFilterClick={handleFilterClick} 
            />

            {/* Quick Stats Grid */}
            <QuickStatsGrid 
               quickStats={quickStats} 
               loading={loading} 
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Recent Activity */}
               <RecentActivity 
                  recentDonations={recentDonations}
                  loading={loading}
                  formatTimeAgo={formatTimeAgo}
               />

               {/* Top Campaigns */}
               <TopCampaigns 
                  topCampaigns={topCampaigns}
                  loading={loading}
                  organizationId={organizationId}
               />
            </div>

            {/* Organization Status */}
            <OrganizationStatus 
               organizationStatus={organizationStatus}
               loading={loading}
               organizationId={organizationId}
            />
         </div>
      </div>
   )
}

export default Home