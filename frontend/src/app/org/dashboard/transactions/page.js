"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { FaSortUp } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa";

const Transactions = () => {
   const [data, setData] = useState(null)
   const columns = [
      { id: 'name', label: 'Name', sortable: false },
      { id: 'email', label: 'Email', sortable: false },
      { id: 'date', label: 'Date', sortable: true},
      { id: 'amount', label: 'Amount', sortable: true },
      { id: 'campaign', label: 'Campaign', sortable: true },
      { id: 'method', label: 'Method', sortable: true },
   ];

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
            const response = await axios.get(`http://localhost:4000/api/transaction/getByOrg/${6}`)
            console.log(response.data)
            setData(response.data || [])

         } catch (err) {
            console.log(err)
         }
      }

      // fetchData()
   }, [])

   return (
      <div className="bg-white w-full h-full">
         <h2 className="text-4xl font-bold p-6">Transactions</h2>

         <div className="p-8">
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
                                    (<FaSortUp className="ml-2 text-gray-600" />) : (<FaSortDown className="ml-2 text-gray-600" />)
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
                        <td className="px-4 py-2 text-center text-sm">
                           <div className="flex items-center justify-center space-x-2">
                              <Link href="/org/campaign/edit">
                                 <FaEdit className="text-lg mr-2" />
                              </Link>
                              <div className="border-r border-gray-400 h-6" />
                              <Link href="/org/campaign/view">
                                 <IoMdOpen className="text-lg ml-2" />
                              </Link>
                           </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-center">{row.name}</td>
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
      </div>
   )
}

export default Transactions