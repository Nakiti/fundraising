"use client"
import { useState } from "react";
import { FaSortUp } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const Table = ({setData, data, organizationId}) => {
   const columns = [
      // { id: '', label: '', sortable: false},
      { id: 'campaignName', label: 'Campaign Name', sortable: false },
      { id: 'date', label: 'Date Created', sortable: false },
      { id: 'raised', label: 'Raised', sortable: true},
      { id: 'goal', label: 'Goal', sortable: true },
      { id: 'donations', label: 'Donations', sortable: true },
      { id: 'visits', label: 'Visits', sortable: true },
      { id: 'type', label: 'Type', sortable: false },
      { id: 'status', label: 'Status', sortable: false }
   ];
   
   const router = useRouter()
   
   // const [data, setData] = useState(null)
   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
   const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 10; 

   const indexOfLastRow = currentPage * rowsPerPage;
   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
   const currentRows = data && data.slice(indexOfFirstRow, indexOfLastRow);

   const totalPages = data && data.length > 0 ? Math.ceil(data && data.length / rowsPerPage) : 1;

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
      router.push(`/org/${organizationId}/dashboard/campaigns/${id}`)
   }

   return (
      <div className="px-6 mt-6 mb-4">
         <table className="min-w-full bg-white border-gray-300">
            <thead className=" border-b border-gray-300">
               <tr>
               {columns.map((column, index) => (
                  <th
                     key={index}
                     className="px-4 py-3 text-left text-gray-700 text-sm font-semibold cursor-pointer hover:text-gray-900 transition-colors"
                     onClick={() => sortData(column.id)}
                  >
                     <div className="flex items-center">
                     {column.label}
                     {column.sortable && (
                        <span className="ml-1 text-gray-500">
                           {sortConfig.key === column.id && sortConfig.direction === 'ascending' ? (
                           <FaSortUp className="ml-2 text-blue-600" />
                           ) : (
                           <FaSortDown className="ml-2 text-blue-600" />
                           )}
                        </span>
                     )}
                     </div>
                  </th>
               ))}
               </tr>
            </thead>

            {currentRows && currentRows.length > 0 && <tbody>
               {currentRows.map((row, index) => (
               <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleClick(row.campaign_id)}
               >
                  <td className="px-4 py-3 text-center text-md text-gray-700">{row.external_name}</td>
                  <td className="px-4 py-2 text-center text-md text-gray-600">
                     {new Date(row.created_at).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-4 py-2 text-center text-md text-gray-600">{row.status == "inactive" ? "-" : "$"+row.raised}</td>
                  <td className="px-4 py-2 text-center text-md text-gray-600">{row.status == "inactive" ? "-" : "$"+row.goal}</td>
                  <td className="px-4 py-2 text-center text-md text-gray-600">{row.status == "inactive" ? "-" : row.donations}</td>
                  <td className="px-4 py-2 text-center text-md text-gray-600">{row.status == "inactive" ? "-" : row.visits}</td>
                  <td className="px-4 py-2 text-center text-md text-gray-600">
                     {row.type.charAt(0).toUpperCase() + row.type.slice(1).toLowerCase()}
                  </td>
                  <td className="px-4 py-2 text-center">
                     <span
                     className={`px-4 py-1 w-24 rounded-full text-white text-xs font-medium ${
                        row.status === "inactive" ? "bg-red-700" : "bg-green-700"
                     }`}
                     >
                     {row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()}
                     </span>
                  </td>
               </tr>
               ))}
            </tbody>}
         </table>
         {currentRows && currentRows.length == 0 && <p className="text-gray-700 text-center mx-auto p-4 ">No Campaigns</p>}
         <div className="flex justify-between items-center my-2 pb-4 text-gray-600 text-sm w-1/2 mx-auto">
            <button
               className="flex items-center px-3 py-2 rounded-full hover:bg-gray-200 transition-colors"
               onClick={handlePreviousPage}
            >
               <FaAngleLeft />
               <span className="ml-1">Previous</span>
            </button>
            <p>Page {currentPage} / {totalPages}</p>
            <button
               className="flex items-center px-3 py-2 rounded-full hover:bg-gray-200 transition-colors"
               onClick={handleNextPage}
            >
               <span className="mr-1">Next</span>
               <FaAngleRight />
            </button>
         </div>
      </div>
   );
};

export default Table;
