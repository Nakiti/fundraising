import React from "react"
import Table from "./table"
import Summary from "./summary"
import Link from "next/link"


const Campaigns = () => {

   return (
      <div className="w-full h-full bg-white">

         <div className="flex flex-row p-6 w-full justify-between shadow-sm">
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <Link href="/org/campaign/new" className="bg-blue-700 p-2 px-4 rounded-md text-white">New Campaign</Link>
         </div>

         <Summary />

         <div className="ml-8">
            <select
               className="bg-gray-50 text-black px-4 py-1 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
               defaultValue="Active"
            >
               <option value="Active">Active</option>
               <option value="Inactive">Inactive</option>
            </select>
         </div>

         <Table />
      </div>
   )

}

export default Campaigns