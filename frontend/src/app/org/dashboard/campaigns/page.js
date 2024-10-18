import React from "react"
import Table from "./table"
import Summary from "./summary"
import Link from "next/link"


const Campaigns = () => {



   return (
      <div className="w-full h-full p-4">
         <div className="w-full h-full bg-white overflow-y-auto rounded-md p-4">

            <div className="flex flex-row p-6 w-full justify-between items-center">
               <h1 className="text-4xl font-bold">Campaigns</h1>
               <Link href="/org/campaign/new/details/about" >
                  
                  <p className="bg-blue-700 py-3 px-8 rounded-md text-md font-semibold text-white">Create New Campaign</p>
               </Link>
            </div>

            <Summary />


            <Table />
         </div>
      </div>
   )

}

export default Campaigns