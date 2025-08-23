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
               
               {data && data.length > 0 && (
                  <tbody className="bg-white divide-y divide-gray-200">
                     {data.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {row.first_name} {row.last_name}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.email}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(row.date).toLocaleDateString("en-US", {
                                 year: 'numeric',
                                 month: 'short',
                                 day: 'numeric'
                              })}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${Number(row.amount).toLocaleString()}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.external_name}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.method}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                 className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                    row.status === "failed" 
                                       ? "bg-red-100 text-red-800" 
                                       : row.status === "completed" 
                                       ? "bg-green-100 text-green-800"
                                       : "bg-yellow-100 text-yellow-800"
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
               <p className="text-gray-500 text-sm">No transactions found</p>
            </div>
         )}
      </div>
   )
}

export default Table