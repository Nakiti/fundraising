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
import { getCampaignSearch, getCampaignsFiltered } from "@/app/services/fetchService";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import debounce from "lodash/debounce"
import { useRouter } from "next/navigation";


const Table = () => {
   const columns = [
      // { id: '', label: '', sortable: false},
      { id: 'campaignName', label: 'Campaign Name', sortable: false },
      { id: 'date', label: 'Date Created', sortable: false },
      { id: 'raised', label: 'Raised', sortable: true},
      { id: 'goal', label: 'Goal', sortable: true },
      { id: 'donations', label: 'Donations', sortable: true },
      { id: 'visits', label: 'Visits', sortable: true },
      { id: 'active', label: 'Active', sortable: false }
   ];
   
   const {currentUser} = useContext(AuthContext)
   const organizationId = currentUser && currentUser.organization_id
   const router = useRouter()
   
   const [data, setData] = useState(null)
   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
   const [filter, setFilter] = useState("all")
   const [query, setQuery] = useState("")
   const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 10; 

   const indexOfLastRow = currentPage * rowsPerPage;
   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
   const currentRows = data && data.slice(indexOfFirstRow, indexOfLastRow);

   const totalPages = Math.ceil(data && data.length / rowsPerPage);

   const handlePreviousPage = () => {
      if (currentPage > 1) {
         setCurrentPage(currentPage - 1);
      }
   };

   const handleNextPage = () => {
      if (currentPage < totalPages) {
         setCurrentPage(currentPage + 1);
      }
   };

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

   const handleSearch = async() => {
      try {
         const response = await getCampaignSearch(query, organizationId)
         setData(response)
         console.log(response)
      } catch (err) {
         console.log(err)
      }
   }

   const debouncedSearch = debounce(async (query) => {
      try {
         const response = await getCampaignSearch(query, organizationId);
         setData(response)
      } catch (err) {
         console.error(err);
      }
   }, 300);

   const handleInputsChange = async (e) => {
      setQuery(e.target.value)
      debouncedSearch(e.target.value)
   }

   const handleClick = (id) => {
      router.push(`/org/dashboard/campaigns/${id}`)
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
         <div className="mb-4 flex flex-col">
            <div className="relative w-3/4">
               <input 
                  type="text"
                  placeholder="Search for a Campaign"
                  className="px-4 py-2 pr-10 border-b border-gray-300 rounded-sm w-full focus:outline-none focus:border-blue-500"
                  value={query}
                  onChange={handleInputsChange}
                  onKeyDown={(e) => {
                     if (e.key == "Enter") {
                        handleSearch()
                     }
                  }}
               />
               <IoIosSearch 
                  className="absolute right-3 w-5 h-5 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  onClick={handleSearch}
               />
            </div>

            <div className="flex flex-row mt-4 space-x-4">
               <select
                  className="text-black px-4 py-2 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="all"
                  onChange={handleFilter}
               >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
               </select>
               <select
                  className="text-black px-4 py-1 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="all"
                  onChange={handleFilter}
               >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
               </select>
               <select
                  className="text-black px-4 py-1 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="all"
                  onChange={handleFilter}
               >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
               </select>
            </div>

         </div>

         <table className="min-w-full bg-white border-gray-300 rounded-md">
            {/* Table Header */}
            <thead className="border-b border-gray-300">
               <tr>
                  {columns.map((column, index) => (
                     <th key={index} className="px-4 py-2 text-left text-gray-700 text-sm font-semibold" onClick={() => sortData(column.id)}>
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
               {currentRows && currentRows.map((row, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 cursor-pointer" onClick={() => handleClick(row.id)}>
                     {/* <td className=" py-2 text-center text-md border-r">
                        <div className="flex items-center justify-center space-x-2">
                           <Link href={`/org/dashboard/campaigns/${row.id}`}>
                              <IoMdOpen className="text-md w-6 h-4" />
                           </Link>
                        </div>
                     </td> */}
                     <td className="px-4 py-3 text-md text-center">{row.campaign_name}</td>
                     <td className="px-4 py-2 text-md text-center">{new Date(row.created_at).toLocaleDateString("en-US")}</td>
                     <td className="px-4 py-2 text-md text-center">{row.raised}</td>
                     <td className="px-4 py-2 text-md text-center">{row.goal}</td>
                     <td className="px-4 py-2 text-md text-center">{row.donations}</td>
                     <td className="px-4 py-2 text-md text-center">{row.visits}</td>
                     <td className="px-4 py-2 text-sm text-center">
                        <label className={`px-4 py-1 w-32 text-center rounded-sm text-white ${row.status == "inactive" ? " bg-red-800" : "bg-green-800"}`}>{row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()}</label>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>

         <div className="w-full flex justify-end items-center mt-6 text-sm">
            <button 
               className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-300"
               onClick={handlePreviousPage}
            >
               <FaAngleLeft />
            </button>
            <p>Page {currentPage} / {totalPages}</p>
            <button 
               className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-300"
               onClick={handleNextPage}
            >
               <FaAngleRight />
            </button>
         </div>

      </div>
   );
};

export default Table;
