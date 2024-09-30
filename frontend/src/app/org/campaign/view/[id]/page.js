"use client"
import { Bar } from "react-chartjs-2"
import { useState, useEffect } from "react"
import { getCampaignDetails, getTransactionsByCampaign } from "@/app/services/fetchService"
import Link from "next/link"
import { IoMdArrowRoundBack } from "react-icons/io"


const View = ({params}) => {
   const campaignId = params.id
   const [campaign, setCampaign] = useState(null)
   const [transactions, setTransactions] = useState([])

   useEffect(() => {
      const fetchData = async() => {
         const campaignResponse = await getCampaignDetails(campaignId)
         setCampaign(campaignResponse)

         const transactionResponse = await getTransactionsByCampaign(campaignId)
         setTransactions(transactionResponse)
      }

      fetchData()
   }, [])

   return (
      <div className="w-full bg-gray-50 ">
         {campaign && <div className="flex items-center justify-between p-2 border-b border-gray-100 shadow-sm bg-white text-black">
            <div className="flex flex-row">
               <Link href="/org/dashboard/campaigns" className="px-4 flex items-center"> <IoMdArrowRoundBack className="text-xl"/></Link>
               <div className="border-r h-8 border-gray-300"/>
               <h1 className="text-lg font-semibold px-4">{campaign.title}</h1>

            </div>
         </div>}

         {campaign && <div className="mt-4 mx-6 grid grid-cols-12 grid-rows-4 gap-4">

            <div className="bg-white rounded-md shadow-md col-start-1 p-4 col-end-8 row-start-1 row-end-2">
               <h1 className="text-2xl font-semibold mb-2">Raised:</h1>
               <p className="text-sm text-gray-700">Total Amount</p>
               <div className="flex flex-row">
                  <p className="text-md mb-2 font-bold">{campaign.raised} Raised</p>
                  <p className="text-md mb-2 ml-1">out of {campaign.goal} goal</p>
               </div>
               <div className="w-full bg-green-200 rounded-full h-2 mb-4">
                  <div className="bg-green-600 h-2 rounded-full w-1/12"></div>
               </div>
               <div className="flex flex-row w-full justify-between items-center px-4">
                  <div className="flex flex-col items-center justify-center">
                     <p className="text-sm">Gross Raised:</p>
                     <p className="text-md font-bold">$123,456</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <p className="text-sm ">After Fees:</p>
                     <p className="text-md font-bold">$1,123,456</p>
                  </div>               
               </div>
            </div>

            <div className="bg-white rounded-md shadow-md p-4 col-start-8 col-end-11 row-start-1 row-end-3">
               <h1 className="text-2xl font-semibold mb-4">Performance</h1>

               <div>
                  <div className="flex flex-col items-start mb-2">
                     <p className="text-sm font-bold">Total Donations:</p>
                     <p className="text-lg ml-2">{campaign.donations}</p>
                  </div>
                  <div className="flex flex-col items-start mb-2">
                     <p className="text-sm font-bold">Total Visits:</p>
                     <p className="text-lg ml-2">{campaign.visits}</p>
                  </div>
                  <div className="flex flex-col items-start mb-2">
                     <p className="text-sm font-bold">Conversion Rate:</p>
                     <p className="text-lg ml-2">{campaign.donations/campaign.vists}</p>
                  </div>
                  <div className="flex flex-col items-start mb-2">
                     <p className="text-sm font-bold">Average Donation:</p>
                     <p className="text-lg ml-2">{campaign.amount/campaign.donations}</p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-md shadow-md p-4 col-start-1 col-end-8 row-start-2 row-end-4">
               <h1 className="text-2xl font-semibold mb-4">Recent Transactions</h1>

               <table className="min-w-full bg-white  border-gray-300 rounded-md">
                  <thead className="border-b border-gray-300">
                     <tr>
                        <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">First Name</th>
                        <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">Last Name</th>
                        <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">Email</th>
                        <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">Amount</th>
                        <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">Method</th>
                     </tr>
                  </thead>
                  <tbody>
                     {transactions && transactions.map((row, index) => (
                        <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                           <td className="px-4 py-2 text-center text-sm">
                              <div className="flex items-center justify-center space-x-2">
                                 <Link href={`/org/campaign/edit/${row.id}`}>
                                    <FaEdit className="text-lg mr-2" />
                                 </Link>
                                 <div className="border-r border-gray-400 h-6" />
                                 <Link href={`/org/campaign/view/${row.id}`}>
                                    <IoMdOpen className="text-lg ml-2" />
                                 </Link>
                              </div>
                           </td>
                           <td className="px-4 py-2 text-sm text-center">{row.title}</td>
                           <td className="px-4 py-2 text-sm text-center">{new Date(row.created_at).toLocaleDateString()}</td>
                           <td className="px-4 py-2 text-sm text-center">{row.raised}</td>
                           <td className="px-4 py-2 text-sm text-center">{row.goal}</td>
                           <td className="px-4 py-2 text-sm text-center">{row.donations}</td>
                           <td className="px-4 py-2 text-sm text-center">{row.visits}</td>
                           <td className="px-4 py-2 text-sm text-center">{row.status}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

         </div>}
         
      </div>
   )
}

export default View