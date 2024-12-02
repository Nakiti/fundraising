import { FaSortUp, FaSortDown } from "react-icons/fa"
import { useState } from "react";

const Table = ({data, setData}) => {

   const columns = [
      { id: 'name', label: 'Name', sortable: false },
      { id: 'email', label: 'Email', sortable: false },
      { id: 'date', label: 'Date', sortable: true},
      { id: 'amount', label: 'Amount', sortable: true },
      { id: 'campaign', label: 'Campaign', sortable: false },
      { id: 'method', label: 'Method', sortable: false },
      { id: 'status', label: 'Status', sortable: false },
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

   return (
      <div className="px-8 mt-4">
         <table className="min-w-full bg-white">
            <thead className=" border-b border-gray-300">
               <tr>
                  {columns.map((column, index) => (
                     <th 
                        key={index} 
                        className="px-4 py-3 text-left text-gray-700 text-sm font-semibold cursor-pointer"
                        onClick={() => sortData(column.id)}
                     >
                        <div className="flex items-center justify-center space-x-2">
                           {column.label}
                           {column.sortable && 
                              <div className="h-full flex items-center justify-center cursor-pointer">
                                 {sortConfig.key === column.id && sortConfig.direction === 'ascending' ? 
                                    <FaSortUp className="ml-2 text-blue-700" /> : 
                                    <FaSortDown className="ml-2 text-blue-700" />
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
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                     <td className="px-4 py-3 text-md text-center">{row.first_name} {row.last_name}</td>
                     <td className="px-4 py-3 text-md text-center">{row.method}</td>
                     <td className="px-4 py-3 text-md text-center">{new Date(row.date).toLocaleDateString("en-us")}</td>
                     <td className="px-4 py-3 text-md text-center">{row.amount}</td>
                     <td className="px-4 py-3 text-md text-center">{row.campaign_name}</td>
                     <td className="px-4 py-3 text-md text-center">{row.method}</td>
                     <td className="px-4 py-2 text-center">
                        <span
                        className={`px-4 py-1 w-24 rounded-full text-white text-xs font-medium ${
                           row.status === "Failed" ? "bg-red-500" : row.status === "Completed" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                        >
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()}
                        </span>
                     </td>                      
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

   )
}

export default Table