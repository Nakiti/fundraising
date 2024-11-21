"use client"

import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { AuthContext } from "@/app/context/authContext"
import useFormInput from "@/app/hooks/useFormInput"
import { getAllDesignations } from "@/app/services/fetchService"
import { updateDesignation } from "@/app/services/updateServices"
import { createDesignation } from "@/app/services/createServices"
import { FaCheck } from "react-icons/fa";
import { FaPlus } from "react-icons/fa"


const Designations = ({params}) => {
   const [designations, setDesignations] = useState([]);

   const [newDesignation, handleNewDesignationChange, setNewDesignation] = useFormInput({
      title: '', 
      goal: ''
   })

   const organizationId = params.organizationId
   const { currentUser } = useContext(AuthContext);

   const handleDesignationChange = (id, field, value) => {
      setDesignations(designations.map(designation => 
         designation.id === id ? { ...designation, [field]: value } : designation
      ));
   };

   const handleAddDesignation = async (e) => {
      e.preventDefault();

      try {
         await createDesignation({
            organization_id: organizationId,
            title: newDesignation.title,
            goal: newDesignation.goal,
            created_by: currentUser.id,
            updated_by: currentUser.id
         });

         setNewDesignation({ title: "", goal: 0 });
         fetchData();
      } catch (err) {
         console.log(err);
      }
   };

   const handleConfirm = async (id) => {
      const updatedDesignation = designations.find(designation => designation.id === id);

      try {
         await updateDesignation(id, {title: updatedDesignation.title, goal: updatedDesignation.goal, status: updatedDesignation.status})
      } catch (err) {
         console.log(err);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      try {
         const response = await getAllDesignations(organizationId)
         setDesignations(response);
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <div className="w-full h-full">
         <div className="w-full h-full p-8 bg-white overflow-y-auto">
            <div className="p-6">
               <h1 className="text-3xl font-semibold mb-4 text-gray-800">Designations</h1>
               <p className="text-gray-700">Manage the designations that users can donate to </p>
            </div>            
            <div className="overflow-x-auto w-11/12 p-6">
               <h1 className="text-2xl mb-4">All Designations</h1>

               <table className="min-w-full bg-white text-sm">
                  <thead>
                     <tr>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Title</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Donations</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Raised</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Goal</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Update</th>
                     </tr>
                  </thead>
                  <tbody>
                     {designations && designations.map((designation) => (
                        <tr key={designation.id} className="border-b border-gray-200 hover:bg-gray-50">
                           <td className="px-4 py-2  text-gray-700 whitespace-nowrap">
                              <input
                                 type="text"
                                 value={designation.title}
                                 onChange={(e) => handleDesignationChange(designation.id, 'title', e.target.value)}
                                 className="w-full bg-gray-50 px-4 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                           </td>
                           <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{designation.donations}</td>
                           <td className="px-4 py-2 text-gray-700 whitespace-nowrap">${designation.raised.toLocaleString()}</td>
                           <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                              <input
                                 type="number"
                                 value={designation.goal}
                                 onChange={(e) => handleDesignationChange(designation.id, 'goal', e.target.value)}
                                 className="w-full bg-gray-50 px-4 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                           </td>
                           <td className="px-6 py-1 border-b border-gray-300">
                              <select
                                 value={designation.status}
                                 onChange={(e) => handleDesignationChange(designation.id, 'status', e.target.value)}
                                 className="w-full bg-gray-50 px-4 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                              >
                                 <option value="Active">Active</option>
                                 <option value="Inactive">Inactive</option>
                              </select>
                           </td>
                           <td className="px-6 py-1 border-b border-gray-300">
                              <button
                                 onClick={() => handleConfirm(designation.id)}
                                 className="px-4 py-1 bg-blue-600 text-white rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                              >
                                 <FaCheck />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="w-11/12  border-b border-gray-300 my-2 px-6"/>

            <div className="mt-4 p-6">
               <h2 className="text-2xl mb-4 text-gray-800">Add New Designation</h2>
               <form onSubmit={handleAddDesignation} className="grid grid-cols-4 gap-4 w-3/4 text-sm">
                  <div>
                     <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newDesignation.title}
                        onChange={handleNewDesignationChange}
                        className="w-full px-4 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                     />
                  </div>
                  <div>
                     <input
                        type="number"
                        name="goal"
                        placeholder="Goal"
                        value={newDesignation.goal}
                        onChange={handleNewDesignationChange}
                        className="w-full px-4 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                     />
                  </div>
                  <div className="flex justify-start">
                     <button
                        type="submit"
                        className="px-6 py-1 bg-blue-600 text-white rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                     >
                        <FaPlus />
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}

export default Designations