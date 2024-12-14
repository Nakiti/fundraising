"use client"
import { useState, useContext, useEffect, act } from "react"
import { AuthContext } from "@/app/context/authContext"
import { getAllCampaigns, getTransactionsOverTime, getUserData } from "@/app/services/fetchService"
import Link from "next/link"
import { MdOpenInNew } from "react-icons/md";

const Home = ({params}) => {
   const [active, setActive] = useState("week")
   const {currentUser} = useContext(AuthContext)
   const organizationId = params.organizationId
   const [userData, setUserData] = useState(null)
   const [campaigns, setCampaigns] = useState(null)

   const [summaryData, setSummaryData] = useState({
      donation: 0,
      // supporter: 0,
      raised: 0,
   })

   const [statuses, setStatuses] = useState({
      organization: true,
      landingPage: true,
      aboutPage: true,
      impactPage: true,
   })

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
            const userResponse = await getUserData(currentUser && currentUser.id)
            setUserData(userResponse)
            
            const campaignsResponse = await getAllCampaigns(organizationId)
            setCampaigns(campaignsResponse)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [currentUser])

   const fetchTransactions = async(start, end) => {
      try {
         const response = await getTransactionsOverTime(organizationId, start, end)
         setSummaryData({donation: response.transactionsCount, raised: response.totalRaised})
      } catch (err) {
         console.log(err)
      }
   }

   const handleClick = (active) => {
      setActive(active);
   };
   

   return (
      <div className="w-full h-full">
         <div className="w-full h-full rounded-sm overflow-y-auto p-6 bg-gray-100">
            <h1 className="text-4xl font-semibold text-start mb-10 px-8 pt-4 text-gray-800">
               Welcome Back, {userData && userData.first_name}!
            </h1>
            <div className="flex justify-end w-3/4 mx-auto">
               <div className="flex space-x-6 mb-6">
               {["week", "month", "year"].map((period) => (
                  <button
                     key={period}
                     className={`px-5 py-2 text-md font-medium ${
                     active === period ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
                     }`}
                     onClick={() => handleClick(period)}
                  >
                     {`This ${period.charAt(0).toUpperCase() + period.slice(1)}`}
                  </button>
               ))}
               </div>
            </div>
            <div className="w-5/6 mx-auto grid grid-cols-3 gap-6 mb-6">
               {[
               { label: "Donations", value: summaryData.donation },
               { label: "New Supporters", value: summaryData.newSupporters },
               { label: "Raised", value: `$${summaryData.raised || 0}` },
               ].map((item) => (
               <div key={item.label} className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center text-center">
                  <h2 className="text-4xl font-semibold mb-1 text-gray-700">{item.value}</h2>
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