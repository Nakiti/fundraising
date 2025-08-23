"use client"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/app/context/authContext"
import useFormInput from "@/app/hooks/useFormInput"
import { DesignationService } from "@/app/services/fetchService"
import { DesignationUpdateService } from "@/app/services/updateServices"
import { DesignationCreateService } from "@/app/services/createServices"
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"
import { FaCheck } from "react-icons/fa";
import { FaPlus } from "react-icons/fa"
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

/*
   Component: Designations
   Description: renders designation page and allows user to add and manage designations
*/
const Designations = ({params}) => {
   const [designations, setDesignations] = useState([]);
   const [newDesignation, handleNewDesignationChange, setNewDesignation] = useFormInput({title: '', goal: 0})
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const organizationId = params.organizationId
   const { currentUser } = useContext(AuthContext);

   /*
      Function: handleDesignationChange
      Description: Changes values of a single designation in a list of designations
      Props:
         - id: designation id
         - field: field to be changed
         - value: new value to be inputted
   */
   const handleDesignationChange = (id, field, value) => {
      setDesignations(designations.map(designation => 
         designation.id === id ? { ...designation, [field]: value } : designation
      ));
   };

   /*
      Function: handleAddDesignation
      Description: creates a new designation
   */
   const handleAddDesignation = async (e) => {
      e.preventDefault();
      try {
         await DesignationCreateService.createDesignation({
            organization_id: organizationId,
            title: newDesignation.title,
            goal: newDesignation.goal,
            created_by: currentUser.id,
            updated_by: currentUser.id
         });
         setNewDesignation({ title: "", goal: 0 });
         await fetchData();
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      }
   };

   /*
      Function: handleConfirm
      Description: updates changes made to designation
   */
   const handleConfirm = async (id) => {
      const updatedDesignation = designations.find(designation => designation.id === id);
      try {
         await DesignationUpdateService.updateDesignation(id, {title: updatedDesignation.title, goal: updatedDesignation.goal, status: updatedDesignation.status})
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      try {
         const response = await DesignationService.getAllDesignations(organizationId)
         setDesignations(response);
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-8">
               <Link 
                  href={`/org/${organizationId}/dashboard/settings`}
                  className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 mb-6 group"
               >
                  <FaArrowLeft className="text-slate-600 group-hover:text-slate-800 transition-colors duration-200"/>
                  <span className="font-medium">Back to Settings</span>
               </Link>
               
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h1 className="text-4xl font-bold text-slate-900 mb-3">Designations</h1>
                  <p className="text-slate-600 text-lg">Manage the designations that users can donate to</p>
               </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
               {/* Designations Table */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-200">
                     <h2 className="text-2xl font-semibold text-slate-900">All Designations</h2>
                  </div>
                  
                  <div className="overflow-x-auto">
                     <table className="w-full">
                        <thead className="bg-slate-50">
                           <tr>
                              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Title</th>
                              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Donations</th>
                              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Raised</th>
                              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Goal</th>
                              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Update</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                           {designations && designations.map((designation) => (
                              <tr key={designation.id} className="hover:bg-slate-50 transition-colors duration-150">
                                 <td className="px-8 py-6">
                                    <input
                                       type="text"
                                       value={designation.title}
                                       onChange={(e) => handleDesignationChange(designation.id, 'title', e.target.value)}
                                       className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                 </td>
                                 <td className="px-8 py-6 text-slate-700 font-medium">{designation.donations}</td>
                                 <td className="px-8 py-6 text-slate-700 font-medium">${designation.raised.toLocaleString()}</td>
                                 <td className="px-8 py-6">
                                    <input
                                       type="number"
                                       value={designation.goal}
                                       onChange={(e) => handleDesignationChange(designation.id, 'goal', e.target.value)}
                                       className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                 </td>
                                 <td className="px-8 py-6">
                                    <select
                                       value={designation.status}
                                       onChange={(e) => handleDesignationChange(designation.id, 'status', e.target.value)}
                                       className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                       <option value="Active">Active</option>
                                       <option value="Inactive">Inactive</option>
                                    </select>
                                 </td>
                                 <td className="px-8 py-6">
                                    <button
                                       onClick={() => handleConfirm(designation.id)}
                                       className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                       <FaCheck className="text-sm" />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Add New Designation */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-6">Add New Designation</h2>
                  <form onSubmit={handleAddDesignation} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                           <input
                              type="text"
                              name="title"
                              placeholder="Enter designation title"
                              value={newDesignation.title}
                              onChange={handleNewDesignationChange}
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                              required
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-2">Goal Amount</label>
                           <input
                              type="number"
                              name="goal"
                              placeholder="Enter goal amount"
                              value={newDesignation.goal}
                              onChange={handleNewDesignationChange}
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                              required
                           />
                        </div>
                        <div className="flex items-end">
                           <button
                              type="submit"
                              className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                           >
                              <FaPlus className="mr-2" />
                              Add Designation
                           </button>
                        </div>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Designations