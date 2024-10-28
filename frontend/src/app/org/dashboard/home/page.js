"use client"
import { useState, useContext } from "react"
import { AuthContext } from "@/app/context/authContext"

const Home = () => {
   const [active, setActive] = useState("week")
   const {currentUser} = useContext(AuthContext)


   return (
      <div className="w-full h-full p-4">
         <div className="w-full h-full rounded-sm overflow-y-auto p-4">
            <h1 className="text-4xl text-start mb-8 px-8">Welcome Back, {currentUser.first_name}!</h1>
            <div className="flex justify-end w-3/4 mx-auto">
               <div className="flex flex-row space-x-4 mb-4">
                  <button 
                     className={`px-4 text-md ${active == "week" ? "border-b-4" : ""} border-blue-700`}
                     onClick={() => setActive("week")}
                  >This Week</button>
                  <button                      
                     className={`px-4 text-md ${active == "month" ? "border-b-4" : ""} border-blue-700`}
                     onClick={() => setActive("month")}
                  >This Month</button>
                  <button 
                     className={`px-4 text-md ${active == "year" ? "border-b-4" : ""} border-blue-700`}
                     onClick={() => setActive("year")}
                  >This Year</button>
               </div>
            </div>
            <div className="w-3/4 mx-auto grid grid-cols-3 gap-4 mb-8">
               <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center">
                  <h2 className="text-4xl mb-2">50</h2>
                  <p className="text-md">Donations</p>
               </div>

               <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center">
                  <h2 className=" text-4xl mb-2">5</h2>
                  <p className="text-md">New Supporters</p>
               </div>

               <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center">
                  <h2 className="text-4xl mb-2">$5550</h2>
                  <p className="text-md">Raised</p>
               </div>

            </div>

            <div className="bg-white rounded-md shadow-md w-5/6 mx-auto">
               <p className="p-6 text-xl border-b border-gray-300">Your Organization</p>
               
               <div className="p-6 grid grid-cols-2">
                  <div>
                     <div className="flex flex-row justify-between mb-4">
                        <h2 className="text-lg">Organization Status</h2>
                        <p className="px-6 py-1 bg-green-700 text-sm text-white rounded-sm">Active</p>
                     </div>
                     <div className="flex flex-row justify-between px-2 mb-2">
                        <h2 className="text-md">Landing Page</h2>
                        <p className="px-4 py-1 bg-green-700 text-sm text-white rounded-sm">Active</p>
                     </div>
                     <div className="flex flex-row justify-between px-2 mb-2">
                        <h2 className="text-md">About Page</h2>
                        <p className="px-4 py-1 bg-green-700 text-sm text-white rounded-sm">Active</p>
                     </div>
                     <div className="flex flex-row justify-between px-2">
                        <h2 className="text-md">Impact Page</h2>
                        <p className="px-4 py-1 bg-green-700 text-sm text-white rounded-sm">Active</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Home