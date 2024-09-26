"use client"

import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { IoMdOpen } from "react-icons/io";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/app/context/authContext.js";
import { FaSortUp } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa";

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

      fetchData()
   }, [])

   return (
      <div className="px-8 mt-4 mb-4">
         <table className="min-w-full bg-white  border-gray-300 rounded-md">
            {/* Table Header */}
            <thead className="border-b border-gray-300">
               <tr>
                  {columns.map((column, index) => (
                     <th key={index} className="px-4 py-2 text-left text-gray-600 text-sm font-semibold" onClick={() => sortData(column.id)}>
                        <div className="flex flex-row items-center justify-center">
                           {column.label}
                        </div>
                     </th>
                  ))}
               </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
               {data && data.map((row, index) => (
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
                     <td className="px-4 py-2 text-sm text-center">{new Date(row.created_at).toLocaleDateString("en-US")}</td>
                     <td className="px-4 py-2 text-sm text-center">Campaign Name</td>
                     <td className="px-4 py-2 text-sm text-center">{row.goal}</td>
                     <td className="px-4 py-2 text-sm text-center">
                        <label className={`px-2 py-1 rounded-sm text-white ${row.status == "inactive" ? " bg-red-600" : "bg-green-600"}`}>{row.status.toUpperCase()}</label>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}

export default Table