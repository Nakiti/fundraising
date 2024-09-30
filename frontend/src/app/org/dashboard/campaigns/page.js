import React from "react"
import Table from "./table"
import Summary from "./summary"
import Link from "next/link"


const Campaigns = () => {



   return (
      <div className="w-full h-full bg-white overflow-y-auto">

         <div className="flex flex-row p-6 w-full justify-between">
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <Link href="/org/campaign/new" className="bg-blue-700 p-2 px-4 rounded-md text-white">New Campaign</Link>
         </div>

         <Summary />


         <Table />
      </div>
   )

}

export default Campaigns