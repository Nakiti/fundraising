"use client"

import { useEffect, useState, useContext } from "react"
import { AuthContext } from "@/app/context/authContext";
import { getTransactionsByOrg } from "@/app/services/fetchService";
import Searchbar from "./components/searchbar";
import Filters from "./components/filters";
import Summary from "./components/summary";
import Table from "./components/table";

const Transactions = () => {
   const [data, setData] = useState(null)
   const {currentUser} = useContext(AuthContext)
   const organizationId = currentUser.organization_id

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await getTransactionsByOrg(organizationId)
            setData(response)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <div className="w-full h-full p-4">
         <div className="bg-white w-full h-full overflow-y-auto rounded-sm p-4">
            <div className="flex flex-row p-6 w-full justify-between items-center">
               <h1 className="text-4xl">Transactions</h1>
               <button className="bg-blue-700 font-semibold py-3 px-8 rounded-md text-md text-white">
                  Add Offline Transaction 
               </button>
            </div>

            <Summary />
            <div className="px-8">
               <Searchbar setData={setData} organizationId={organizationId}/>
               <Filters setData={setData} organizationId={organizationId}/>
            </div>
            <Table setData={setData} data={data}/>
         </div>
      </div>
   )
}

export default Transactions