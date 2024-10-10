import React from "react"
import Table from "./table"
import Summary from "./summary"
import Link from "next/link"


const Campaigns = () => {



   return (
      <div className="w-full h-full p-4">
         <div className="w-full h-full bg-white overflow-y-auto rounded-md p-4">

            <div className="flex flex-row p-6 w-full justify-between">
               <h1 className="text-3xl font-bold">Campaigns</h1>
               <Link href="/org/campaign/new" className="bg-blue-700 py-2 px-4 rounded-md text-sm font-semibold text-white">Create New Campaign</Link>
            </div>

            <Summary />


            <Table />
         </div>
      </div>
   )

}

export default Campaigns