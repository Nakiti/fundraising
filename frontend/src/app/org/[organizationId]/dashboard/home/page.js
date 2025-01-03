"use client"
import { useState, useContext, useEffect, act } from "react"
import { AuthContext } from "@/app/context/authContext"
import { getAllCampaigns, getCampaignsFiltered, getTransactionsOverTime, getUserData } from "@/app/services/fetchService"
import Link from "next/link"
import { MdOpenInNew } from "react-icons/md";
import { FaHandHoldingHeart, FaUserPlus, FaDollarSign } from "react-icons/fa";

/*
   Component: Home
   Description: Renders the home page
 */
const Home = ({params}) => {
   const {currentUser} = useContext(AuthContext)
   const organizationId = params.organizationId
   const [campaigns, setCampaigns] = useState(null)
   const [active, setActive] = useState("week")
   const [summaryData, setSummaryData] = useState({donation: 0, newSupporters: 0, raised: 0,}) // newSupporters is not configured currently

   const statistics = [
      { label: "Donations", value: summaryData.donation, icon: <FaHandHoldingHeart size={36} className="text-blue-700 mb-3" /> },
      { label: "New Supporters", value: summaryData.newSupporters, icon: <FaUserPlus size={36} className="text-blue-700 mb-3" /> },
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
      <div className="w-full h-full">
         <div className="w-full h-full rounded-sm overflow-y-auto p-6 bg-gray-50">
            <h1 className="text-4xl font-semibold text-start mb-6 px-8 pt-4 text-gray-800">
               Your Organization:
            </h1>
            <div className="flex justify-end w-3/4 mx-auto">
               <div className="flex space-x-6 mb-10">
               {["week", "month", "year"].map((period) => (
                  <button
                     key={period}
                     className={`px-5 py-2 text-md font-medium ${
                     active === period ? "border-b-4 border-blue-700 text-blue-700" : "text-gray-500"
                     }`}
                     onClick={() => handleFilterClick(period)}
                  >
                     {`This ${period.charAt(0).toUpperCase() + period.slice(1)}`}
                  </button>
               ))}
               </div>
            </div>
            <div className="w-5/6 mx-auto grid grid-cols-3 gap-6 mb-6">
               {statistics.map((item) => (
                  <div
                  key={item.label}
                  className="relative bg-white rounded-lg h-44 shadow-sm px-8 py-6 flex flex-col items-center justify-start text-center"
               >
                  <div className="absolute -top-6 px-4 py-2 rounded-full bg-white">
                     {item.icon}
                  </div>
                  <h2 className="text-4xl font-semibold mt-6 mb-1 text-gray-700">{item.value}</h2>
                  <p className="text-md font-medium text-gray-500">{item.label}</p>
               </div>
               ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm w-3/4 mx-auto mb-10">
               <p className="p-6 text-lg font-semibold text-gray-600 border-b border-gray-200">
               Your Organization
               </p>
               <div className="p-6 grid grid-cols-2 gap-8 text-gray-700">
               <div>
                  <div className="flex items-center justify-between mb-5">
                     <h2 className="text-lg font-medium">Organization Status</h2>
                     <p className="px-3 py-1 bg-green-700 text-sm text-white rounded-full">Active</p>
                  </div>
                  {["Landing", "Impact", "About"].map((page) => (
                     <div key={page} className="flex justify-between items-center mb-3">
                     <div className="flex items-center space-x-3">
                        <h2 className="text-md font-medium text-gray-600">{page} Page</h2>
                        <Link href={`/org/${organizationId}/page/${page.toLowerCase()}`}>
                           <MdOpenInNew className="text-gray-500 hover:text-gray-700" />
                        </Link>
                     </div>
                     <p className="px-3 py-1 bg-green-700 text-sm text-white rounded-full">Active</p>
                     </div>
                  ))}
               </div>
               <div>
                  <div className="flex items-center justify-between mb-5">
                     <h2 className="text-lg font-medium">Organization Information</h2>
                  </div>
                  <div className="flex justify-between mb-3">
                     <h2 className="text-md font-medium text-gray-600">Active Campaigns:</h2>
                     <p className="px-3 py-1 text-md font-medium text-gray-700">{campaigns && campaigns.length}</p>
                  </div>
               </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Home