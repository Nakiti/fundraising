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
      <div className="w-full bg-gray-50">
         <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                  <p className="text-gray-600 mt-1">View and manage all transaction records</p>
               </div>
               <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Offline Transaction</span>
               </button>
            </div>

            {/* Summary Cards */}
            {data && <Summary data={data}/>}

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                  <Searchbar setData={setData} organizationId={organizationId}/>
                  <Filters setData={setData} organizationId={organizationId}/>
               </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <Table setData={setData} data={data}/>
            </div>
         </div>

         {/* Error Modal */}
         {error && <ErrorModal message={errorMessage} setError={setError} />}
      </div>
   )
}

export default Transactions