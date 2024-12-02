"use client"
import Link from "next/link"
import Table from "./table"

const Events = () => {
   return (
      <div className="w-full h-full">
         <div className="w-full h-full bg-gray-100 rounded-md overflow-y-auto p-6">
            <div className="rounded-lg bg-white w-full h-full p-4">
               <div className="flex flex-row p-6 w-full justify-between">
                  <h1 className="text-4xl">Events</h1>
                  <Link href="/org/campaign/new" className="bg-blue-700 py-3 px-8 rounded-md text-white">New Event</Link>
               </div>

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
         </div>
      </div>
   )
}

export default Events