"use client"
import { useState, useContext, useEffect, act } from "react"
import { AuthContext } from "@/app/context/authContext"
import { getTransactionsOverTime } from "@/app/services/fetchService"
import Link from "next/link"
import { MdOpenInNew } from "react-icons/md";

const Home = () => {
   const [active, setActive] = useState("week")
   const {currentUser} = useContext(AuthContext)
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

   const organizationId = currentUser.organization_id

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
   
      fetchData(start, end);
   }, [active])

   useEffect(() => {


   }, [])

   const fetchData = async(start, end) => {
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
      <div className="w-full h-full p-4">
         <div className="w-full h-full rounded-sm overflow-y-auto p-4">
            <h1 className="text-4xl text-start mb-8 px-8">Welcome Back, {currentUser.first_name}!</h1>
            <div className="flex justify-end w-3/4 mx-auto">
               <div className="flex flex-row space-x-4 mb-4">
                  <button 
                     className={`px-4 text-md ${active == "week" ? "border-b-4" : ""} border-blue-700`}
                     onClick={() => handleClick("week")}
                  >This Week</button>
                  <button                      
                     className={`px-4 text-md ${active == "month" ? "border-b-4" : ""} border-blue-700`}
                     onClick={() => handleClick("month")}
                  >This Month</button>
                  <button 
                     className={`px-4 text-md ${active == "year" ? "border-b-4" : ""} border-blue-700`}
                     onClick={() => handleClick("year")}
                  >This Year</button>
               </div>
            </div>
            <div className="w-3/4 mx-auto grid grid-cols-3 gap-4 mb-8">
               <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center">
                  <h2 className="text-4xl mb-2">{summaryData.donation}</h2>
                  <p className="text-md">Donations</p>
               </div>

               <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center">
                  <h2 className=" text-4xl mb-2">{summaryData.donation}</h2>
                  <p className="text-md">New Supporters</p>
               </div>

               <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center">
                  <h2 className="text-4xl mb-2">${summaryData.raised || 0}</h2>
                  <p className="text-md">Raised</p>
               </div>

            </div>

            <div className="bg-white rounded-md shadow-md w-5/6 mx-auto">
               <p className="p-6 text-xl border-b border-gray-300">Your Organization</p>
               <div className="p-6 grid grid-cols-2 gap-8">
                  <div>
                     <div className="flex flex-row justify-between mb-4">
                        <h2 className="text-lg">Organization Status</h2>
                        <p className="px-6 py-1 bg-green-700 text-sm text-white rounded-sm">Active</p>
                     </div>
                     <div className="flex flex-row justify-between px-2 mb-2">
                        <div className="flex flex-row space-x-2 items-center">
                           <h2 className="text-md">Landing Page</h2>
                           <Link href="/org/page/landing"> <MdOpenInNew /></Link>
                        </div>
                        <p className="px-4 py-1 bg-green-700 text-sm text-white rounded-sm">Active</p>
                     </div>
                     <div className="flex flex-row justify-between px-2 mb-2">
                        <div className="flex flex-row space-x-2 items-center">
                           <h2 className="text-md">Impact Page</h2>
                           <Link href="/org/page/impact"> <MdOpenInNew /></Link>
                        </div>
                        <p className="px-4 py-1 bg-green-700 text-sm text-white rounded-sm">Active</p>
                     </div>
                     <div className="flex flex-row justify-between px-2">
                        <div className="flex flex-row space-x-2 items-center">
                           <h2 className="text-md">About Page</h2>
                           <Link href="/org/page/about"> <MdOpenInNew /></Link>
                        </div>
                        <p className="px-4 py-1 bg-green-700 text-sm text-white rounded-sm">Active</p>
                     </div>
                  </div>
                  <div>
                     <div className="flex flex-row justify-between mb-4">
                        <h2 className="text-lg">Organization Information</h2>
                     </div>
                     <div className="flex flex-row justify-between px-2 mb-2">
                        <h2 className="text-md">Active Campaigns:</h2>
                        <p className="px-4 py-1 text-md">37</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Home