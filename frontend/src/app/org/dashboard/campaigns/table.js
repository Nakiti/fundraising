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
import { getCampaignsFiltered } from "@/app/services/fetchService";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";




const Table = () => {
   const columns = [
      { id: 'actions', label: 'Actions', sortable: false},
      { id: 'campaignName', label: 'Campaign Name', sortable: false },
      { id: 'date', label: 'Date', sortable: false },
      { id: 'raised', label: 'Raised', sortable: true},
      { id: 'goal', label: 'Goal', sortable: true },
      { id: 'donations', label: 'Donations', sortable: true },
      { id: 'visits', label: 'Visits', sortable: true },
      { id: 'active', label: 'Active', sortable: false }
   ];
   
   const {currentUser} = useContext(AuthContext)
   const organizationId = currentUser.organization_id
   
   const [data, setData] = useState(null)
   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
   const [filter, setFilter] = useState("all")

   const sortData = (key) => {
      let direction = 'ascending';
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
         direction = 'descending';
      }
      const sortedData = [...data].sort((a, b) => {
         if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
         if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
         return 0;
      });
      setData(sortedData);
      setSortConfig({ key, direction });
   };

   const handleFilter = async (e) => {
      const response = await getCampaignsFiltered(currentUser.organization_id, e.target.value)
      setData(response)
   }

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
         <div className="mb-4 flex flex-row items-center space-x-4">
            <div className="relative w-1/2">
               <input 
                  type="text"
                  placeholder="Search for a Campaign"
                  className="px-4 py-2 pr-10 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
               />
               <IoIosSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <select
               className="bg-gray-50 text-black px-4 py-2 text-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
               defaultValue="all"
               onChange={handleFilter}
            >
               <option value="all">All</option>
               <option value="active">Active</option>
               <option value="inactive">Inactive</option>
            </select>

         </div>

         <table className="min-w-full bg-white  border-gray-300 rounded-md">
            {/* Table Header */}
            <thead className="border-b border-gray-300">
               <tr>
                  {columns.map((column, index) => (
                     <th key={index} className="px-4 py-2 text-left text-gray-600 text-sm font-semibold" onClick={() => sortData(column.id)}>
                        <div className="flex flex-row items-center justify-center">
                           {column.label}
                           {column.sortable &&
                           <div className="h-full flex items-center justify-center cursor-pointer">
                              {sortConfig.key === column.id && sortConfig.direction === 'ascending' ? 
                                 (<FaSortUp className="ml-2 text-blue-700" />) : (<FaSortDown className="ml-2 text-blue-700" />)
                              }
                           </div>
                           }
                        </div>
                     </th>
                  ))}
               </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
               {data && data.map((row, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                     <td className=" py-2 text-center text-md border-r">
                        <div className="flex items-center justify-center space-x-2">
                           <Link href={`/org/dashboard/campaigns/${row.id}`}>
                              <IoMdOpen className="text-md w-6 h-4" />
                           </Link>
                        </div>
                     </td>
                     <td className="px-4 py-4 text-md text-center">{row.campaign_name}</td>
                     <td className="px-4 py-2 text-md text-center">{new Date(row.created_at).toLocaleDateString("en-US")}</td>
                     <td className="px-4 py-2 text-md text-center">{row.raised}</td>
                     <td className="px-4 py-2 text-md text-center">{row.goal}</td>
                     <td className="px-4 py-2 text-md text-center">{row.donations}</td>
                     <td className="px-4 py-2 text-md text-center">{row.visits}</td>
                     <td className="px-4 py-2 text-sm text-center">
                        <label className={`px-4 py-1 rounded-sm text-white ${row.status == "inactive" ? " bg-red-700" : "bg-green-700"}`}>{row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()}</label>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>

         <div className="w-full flex justify-end items-center space-x-4 mt-6 text-sm">
            <button className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-300">
               <FaAngleLeft />
            </button>
{/* 
         Page numbers
            <div className="flex space-x-2">
               <button className="px-4 py-1 bg-blue-500 text-white rounded-md">1</button>
               <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-300">
                  2
               </button>
               <span className="px-4 py-1 text-gray-500">...</span>
               <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-300">
                  10
               </button>
            </div> */}

            <button className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-300">
               <FaAngleRight />
            </button>
         </div>

      </div>
   );
};

export default Table;
