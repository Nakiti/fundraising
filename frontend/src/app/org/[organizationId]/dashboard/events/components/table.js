"use client"

import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { IoMdOpen } from "react-icons/io";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/app/context/authContext.js";
import { FaSortUp } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa";
import { GrView } from "react-icons/gr";

const Table = () => {
   const columns = [
      { id: 'actions', label: 'Actions'},
      { id: 'title', label: 'Title'},
      { id: 'date', label: 'Date'},
      { id: 'campaign', label: 'Campaign'},
      { id: 'goal', label: 'Sign-Ups'},
      {id: "status", label: "Status"}
   ];
   
   const {currentUser} = useContext(AuthContext)
   
   const [data, setData] = useState(null)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await axios.get(`http://localhost:4000/api/campaign/getByOrg/${currentUser.organization_id}`)
            console.log(response)
            setData(response.data)
         } catch (err) {
            console.log(err)
         }
      }

      // fetchData()
   }, [])

   return (
      <div className="overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                     {columns.map((column, index) => (
                        <th
                           key={index}
                           className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                           <div className="flex items-center space-x-1">
                              <span>{column.label}</span>
                           </div>
                        </th>
                     ))}
                  </tr>
               </thead>
               
               {data && data.length > 0 && (
                  <tbody className="bg-white divide-y divide-gray-200">
                     {data.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                           <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center space-x-2">
                                 <Link href={`/org/campaign/edit/${row.id}`} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <FaEdit className="text-lg" />
                                 </Link>
                                 <div className="border-r border-gray-300 h-4" />
                                 <Link href={`/org/campaign/view/${row.id}`} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <IoMdOpen className="text-lg" />
                                 </Link>
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {row.title}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(row.created_at).toLocaleDateString("en-US", {
                                 year: 'numeric',
                                 month: 'short',
                                 day: 'numeric'
                              })}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Campaign Name
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.goal}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                 className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                    row.status === "inactive" 
                                       ? "bg-red-100 text-red-800" 
                                       : "bg-green-100 text-green-800"
                                 }`}
                              >
                                 {row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               )}
            </table>
         </div>
         
         {(!data || data.length === 0) && (
            <div className="text-center py-12">
               <p className="text-gray-500 text-sm">No events found</p>
            </div>
         )}
      </div>
   )
}

export default Table