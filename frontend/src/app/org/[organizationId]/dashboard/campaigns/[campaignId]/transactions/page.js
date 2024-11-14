"use client"
import { getTransactionsByCampaign } from "@/app/services/fetchService"
import { useState, useEffect } from "react"

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
      <div className="p-8 w-full min-h-full">
         <div className="bg-white rounded-lg shadow-md p-8 min-h-96 mb-4">
            <p className="text-2xl mb-6 text-gray-800">Transactions</p>
            <table className="min-w-full bg-white  border-gray-300 rounded-md">
               <thead className="border-b border-gray-300">
                  {columns.map((column, index) => (
                     <th key={index} className="px-4 py-2 text-left text-gray-600 text-sm font-semibold" >
                        <div className="flex flex-row items-center justify-center">
                           {column.label}
                        </div>
                     </th>
                  ))}
               </thead>
               <tbody>
                  {data && data.map((row, index) => (
                     <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-center">{row.first_name} {row.last_name}</td>
                        <td className="px-4 py-2 text-sm text-center"></td>
                        <td className="px-4 py-2 text-sm text-center">{new Date(row.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-sm text-center">{row.amount}</td>
                        {/* <td className="px-4 py-2 text-sm text-center">{row.campaign_name}</td> */}
                        <td className="px-4 py-2 text-sm text-center">{row.method}</td>
                        <td className="px-4 py-2 text-sm text-center">{row.status}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

      </div>
   )
}

export default Transactions