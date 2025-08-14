"use client"

import { useEffect, useState } from "react"
import { TransactionService } from "@/app/services/fetchService";
import { errorHandler } from "@/app/services/apiClient";
import ErrorModal from "@/app/components/errorModal";
import Searchbar from "./components/searchbar";
import Filters from "./components/filters";
import Summary from "./components/summary";
import Table from "./components/table";

const Transactions = ({params}) => {
   const [data, setData] = useState(null)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const organizationId = params.organizationId

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await TransactionService.getTransactionsByOrg(organizationId)
            console.log(response)
            setData(response)
         } catch (err) {
            const handledError = errorHandler.handle(err)
            setErrorMessage(handledError.message)
            setError(true)
         }
      }

      fetchData()
   }, [])

   return (
      <div className="w-full h-full">
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         <div className="bg-gray-100 w-full overflow-y-auto rounded-sm p-6">
            <div className="bg-white p-4 rounded-md h-full">
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
               <div className="">
                  <Table setData={setData} data={data}/>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Transactions