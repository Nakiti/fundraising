"use client"
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { useState } from "react";
import Modal from "./components/modal";

const Templates = () => {
   const columns = [
      { id: 'campaignName', label: 'Campaign Name', sortable: false },
      { id: 'date', label: 'Date Created', sortable: false },
      { id: 'by', label: 'Created By', sortable: true },
      { id: 'edited', label: 'Last Updated', sortable: true },
      { id: 'type', label: 'Type', sortable: false }
   ];

   const [showModal, setShowModal] = useState(false)

   return (
      <div className="w-full p-4">
         {showModal && <Modal show={showModal} setShow={setShowModal}/>}
         <div className="w-full bg-white rounded-md p-4">
            <div className="flex flex-row p-6 w-full justify-between items-center mb-12">
               <h1 className="text-4xl">Templates</h1>
               {/* <Link href="/org/campaign/new/details/about" >
                  <p className="bg-blue-700 py-3 px-8 rounded-md text-md text-white">Create New Campaign</p>
               </Link> */}
               <button className="bg-blue-700 py-3 px-8 rounded-md text-md text-white" onClick={() => setShowModal(true)}> 
                  Create New Template
               </button>
            </div>
            
            <div className="px-8">
               <table className="min-w-full bg-white border-gray-300 rounded-md px-8">
                  <thead className="border-b border-gray-300">
                     <tr>
                        {columns.map((column, index) => (
                           <th key={index} className="px-4 py-2 text-left text-gray-700 text-sm font-semibold">
                              <div className="flex flex-row items-center justify-center">
                                 {column.label}
                              </div>
                           </th>
                        ))}
                     </tr>
                  </thead>
               
                  {/* Table Body */}
                  {/* <tbody>
                     {currentRows && currentRows.map((row, index) => (
                        <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 cursor-pointer" onClick={() => handleClick(row.id)}>
                           {/* <td className=" py-2 text-center text-md border-r">
                              <div className="flex items-center justify-center space-x-2">
                                 <Link href={`/org/dashboard/campaigns/${row.id}`}>
                                    <IoMdOpen className="text-md w-6 h-4" />
                                 </Link>
                              </div>
                           </td> 
                           <td className="px-4 py-3 text-md text-center">{row.campaign_name}</td>
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
                  </tbody> */}
               </table>
            </div>
         </div>
      </div>
   )
}

export default Templates