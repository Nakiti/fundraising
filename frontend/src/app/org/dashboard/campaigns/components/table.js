"use client"
import { useState } from "react";
import { FaSortUp } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const Table = ({setData, data}) => {
   const columns = [
      // { id: '', label: '', sortable: false},
      { id: 'campaignName', label: 'Campaign Name', sortable: false },
      { id: 'date', label: 'Date Created', sortable: false },
      { id: 'raised', label: 'Raised', sortable: true},
      { id: 'goal', label: 'Goal', sortable: true },
      { id: 'donations', label: 'Donations', sortable: true },
      { id: 'visits', label: 'Visits', sortable: true },
      { id: 'type', label: 'Type', sortable: false },
      { id: 'active', label: 'Active', sortable: false }
   ];
   
   const router = useRouter()
   
   // const [data, setData] = useState(null)
   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
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

   const handleClick = (id) => {
      router.push(`/org/dashboard/campaigns/${id}`)
   }

   return (
      <div className="px-8 mt-4 mb-4">
         <table className="min-w-full bg-white border-gray-300 rounded-md">
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
                     <td className="px-4 py-2 text-md text-center">{row.type.charAt(0).toUpperCase() + row.type.slice(1).toLowerCase()}</td>

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
