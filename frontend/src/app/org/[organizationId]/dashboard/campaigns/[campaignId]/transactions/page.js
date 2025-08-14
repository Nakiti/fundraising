"use client"
import { getTransactionsByCampaign } from "@/app/services/fetchService"
import { useState, useEffect } from "react"

/*
   Component: Transactions
   Description: Renders transactions relevant to a single campaign
*/
const Transactions = ({params}) => {
   const campaignId = params.campaignId
   const [data, setData] = useState(null)

   const columns = [
      { id: 'name', label: 'Name', sortable: false },
      { id: 'email', label: 'Email', sortable: false },
      { id: 'date', label: 'Date', sortable: true},
      { id: 'amount', label: 'Amount', sortable: true },
      // { id: 'campaign', label: 'Campaign', sortable: false },
      { id: 'method', label: 'Method', sortable: false },
      { id: 'status', label: 'Status', sortable: false },
   ];

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await getTransactionsByCampaign(campaignId)
            setData(response)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])
   
   return (
      <div className="p-6">
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
               <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                     <tr>
                        {columns.map((column, index) => (
                           <th 
                              key={index} 
                              className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                           >
                              {column.label}
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {data && data.length > 0 ? (
                        data.map((row, index) => (
                           <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                 {row.first_name} {row.last_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {row.email || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {new Date(row.date).toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                 })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                 ${parseFloat(row.amount).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {row.method}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span
                                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                       row.status === 'completed' 
                                          ? 'bg-green-100 text-green-800'
                                          : row.status === 'pending'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-red-100 text-red-800'
                                    }`}
                                 >
                                    {row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()}
                                 </span>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={columns.length} className="px-6 py-12 text-center">
                              <div className="text-gray-500">
                                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                 </svg>
                                 <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
                                 <p className="mt-1 text-sm text-gray-500">No transactions have been made for this campaign yet.</p>
                              </div>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   )
}

export default Transactions