"use client"
import { useState } from "react";
import { FaSortUp } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";

/*
   Component: Table
   Description: A table of all campaigns in an organization
   Props: 
      - setData: function to change data state
      - data: contains all the campaigns
      - organizationId: id of the organization
*/
const Table = ({setData, data, organizationId}) => {
   const columns = [
      { id: 'id', label: 'Id', sortable: true},
      { id: 'internalName', label: 'Internal Name', sortable: false },
      { id: 'date', label: 'Date Created', sortable: false },
      { id: 'raised', label: 'Raised', sortable: true},
      // { id: 'goal', label: 'Goal', sortable: true },
      { id: 'donations', label: 'Donations', sortable: true },
      { id: 'visits', label: 'Visits', sortable: true },
      { id: 'type', label: 'Type', sortable: false },
      { id: 'status', label: 'Status', sortable: false }
   ];
   
   const router = useRouter()
   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
   const [currentPage, setCurrentPage] = useState(1); // creates pagination of campaigns table
   const rowsPerPage = 10; 
   const indexOfLastRow = currentPage * rowsPerPage;
   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
   const currentRows = data && data.slice(indexOfFirstRow, indexOfLastRow);
   const totalPages = data && data.length > 0 ? Math.ceil(data && data.length / rowsPerPage) : 1;

   /*
      Description: Go to previous page if available
   */
   const handlePreviousPage = () => {
      if (currentPage > 1) {
         setCurrentPage(currentPage - 1);
      }
   };

   /*
      Description: Go to next page if available
   */
   const handleNextPage = () => {
      if (currentPage < totalPages) {
         setCurrentPage(currentPage + 1);
      }
   };

   /*
      Description: Sort data by either ascending or descending
   */
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

   //navigation to campaign page
   const handleClick = (id) => {
      router.push(`/org/${organizationId}/dashboard/campaigns/${id}`)
   }

   return (
      <div className="overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                     {columns.map((column, index) => (
                        <th
                           key={index}
                           className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                              column.sortable ? 'cursor-pointer hover:text-gray-700 transition-colors' : ''
                           }`}
                           onClick={() => column.sortable && sortData(column.id)}
                        >
                           <div className="flex items-center space-x-1">
                              <span>{column.label}</span>
                              {column.sortable && (
                                 <span className="text-gray-400">
                                    {sortConfig.key === column.id && sortConfig.direction === 'ascending' ? (
                                       <FaSortUp className="w-3 h-3 text-blue-600" />
                                    ) : (
                                       <FaSortDown className="w-3 h-3 text-blue-600" />
                                    )}
                                 </span>
                              )}
                           </div>
                        </th>
                     ))}
                  </tr>
               </thead>
               {currentRows && currentRows.length > 0 && (
                  <tbody className="bg-white divide-y divide-gray-200">
                     {currentRows.map((row, index) => (
                        <tr
                           key={index}
                           className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                           onClick={() => handleClick(row.id)}
                        >
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{row.id}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.internal_name}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(row.created_at)?.toLocaleDateString("en-US", {
                                 year: 'numeric',
                                 month: 'short',
                                 day: 'numeric'
                              })}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {row.status === "inactive" ? "-" : `$${(row.amount_raised || 0)?.toLocaleString()}`}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.status === "inactive" ? "-" : row.donations?.toLocaleString()}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.status === "inactive" ? "-" : row.visits?.toLocaleString()}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="capitalize">
                                 {row.type.replace('-', ' ')}
                              </span>
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
         
         {currentRows && currentRows.length === 0 && (
            <div className="text-center py-12">
               <p className="text-gray-500 text-sm">No campaigns found</p>
            </div>
         )}
         
         {data && data.length > 0 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200">
               <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                     Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, data.length)} of {data.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                     <button
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                           currentPage === 1
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                     >
                        <FaAngleLeft className="w-4 h-4" />
                     </button>
                     <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                     </span>
                     <button
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                           currentPage === totalPages
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                     >
                        <FaAngleRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Table;
