"use client"

import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { FaSortUp } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa";
import { AuthContext } from "@/app/context/authContext";
import { IoIosSearch } from "react-icons/io";
import { getTransactionsByOrg } from "@/app/services/fetchService";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMegaphoneOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import Box from "../campaigns/components/box";
import Searchbar from "./components/searchbar";
import Filters from "./components/filters";

const Transactions = () => {
   const [data, setData] = useState(null)
   const columns = [
      { id: 'name', label: 'Name', sortable: false },
      { id: 'email', label: 'Email', sortable: false },
      { id: 'date', label: 'Date', sortable: true},
      { id: 'amount', label: 'Amount', sortable: true },
      { id: 'campaign', label: 'Campaign', sortable: false },
      { id: 'method', label: 'Method', sortable: false },
      { id: 'status', label: 'Status', sortable: false },
   ];
   const {currentUser} = useContext(AuthContext)
   const organizationId = currentUser.organization_id

   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

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



   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await getTransactionsByOrg(organizationId)
            console.log(response)
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

            <div className="flex justify-between items-center gap-6 px-8 mt-6">
               <Box text={"Total Raised: " }/>
               <Box text={"Total Donations: " }/>
               <Box text={"Total Visits: " }/>
               <Box text={"Average Raised: " }/>
               <Box text={"Average Raised: " }/>

               {/* <Box text={"Average Conversion Rate: " + summary.averageConversionRate}/> */}
            </div>

            <div className="px-8">
               <Searchbar setData={setData} organizationId={organizationId}/>
               <Filters setData={setData} organizationId={organizationId}/>
            </div>
            <div className="px-8 mt-4">
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
                                       (<FaSortUp className="ml-2 text-blue-800" />) : (<FaSortDown className="ml-2 text-blue-800" />)
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
                           <td className="px-4 py-3 text-md text-center">{row.first_name} {row.last_name}</td>
                           <td className="px-4 py-2 text-md text-center"></td>
                           <td className="px-4 py-2 text-md text-center">{new Date(row.date).toLocaleDateString("en-us")}</td>
                           <td className="px-4 py-2 text-md text-center">{row.amount}</td>
                           <td className="px-4 py-2 text-md text-center">{row.campaign_name}</td>
                           <td className="px-4 py-2 text-md text-center">{row.method}</td>
                           <td className="px-4 py-2 text-sm text-center">
                              <label className={`px-4 py-1 w-32 text-center rounded-sm text-white ${row.status == "Failed" ? " bg-red-800" : row.status == "Completed" ? "bg-green-800" : "bg-yellow-600"}`}>{row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()}</label>
                           </td>                        
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   )
}

export default Transactions