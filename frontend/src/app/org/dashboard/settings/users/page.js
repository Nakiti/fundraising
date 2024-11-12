"use client"
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { AuthContext } from "@/app/context/authContext"
import useFormInput from "@/app/hooks/useFormInput"
import { createUser } from "@/app/services/createServices"
import { updateUser } from "@/app/services/updateServices"
import { getAllUsers } from "@/app/services/fetchService"
import { FaCheck, FaPlus } from "react-icons/fa";

const Users = () => {
   const [users, setUsers] = useState([])
   const [newUser, handleNewUserChange, setNewUser] = useFormInput({
      firstName: "",
      lastName: "",
      email: ""
   })

   const { currentUser } = useContext(AuthContext);

   const handleDesignationChange = (id, field, value) => {
      setUsers(users.map(user => 
         user.id === id ? { ...user, [field]: value } : user
      ));
   };

   const handleAddUser = async (e) => {
      e.preventDefault();

      try {
         await createUser({...newUser, organization_id: currentUser.organization_id});
         setNewUser({ firstName: "", lastName: "", email: "" });
         fetchData();
      } catch (err) {
         console.log(err);
      }
   };

   const handleConfirm = async (id) => {
      const updatedUser = users.find(user => user.id === id);

      try {
         await updateUser(id, {role: updatedUser.role});
         fetchData()
      } catch (err) {
         console.log(err);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      try {
         const response = await getAllUsers(currentUser.organization_id);
         setUsers(response);
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <div className="h-full w-full p-4">
         <div className="w-full h-full overflow-y-auto bg-white rounded-sm p-4">
            <div className="p-6">
               <h1 className="text-3xl font-semibold mb-4 text-gray-800">Users</h1>
               <p className="text-gray-700">Manage the users that can access your organization</p>
            </div>
            <div className="overflow-x-auto w-11/12 p-6">
               <h1 className="text-xl mb-4">Active Users</h1>
               <table className="min-w-full bg-white text-sm">
                  <thead>
                     <tr>
                        <th className="px-6 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">First Name</th>
                        <th className="px-6 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Last Name</th>
                        <th className="px-6 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Role</th>
                        <th className="px-6 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Update</th>

                     </tr>
                  </thead>
                  <tbody>
                     {users && users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 ">
                           <td className="px-6 py-2 text-gray-700 whitespace-nowrap ">{user.first_name}</td>
                           <td className="px-6 py-2 text-gray-700 whitespace-nowrap">{user.last_name}</td>
                           <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{user.email}</td>
                           <td className="px-6 py-1 border-b border-gray-300">
                              <select
                                 value={user.role}
                                 onChange={(e) => handleDesignationChange(user.id, 'status', e.target.value)}
                                 className="w-full px-4 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                              >
                                 <option value="admin">Admin</option>
                                 <option value="user">User</option>
                              </select>
                           </td>
                           <td className="px-6 py-1 border-b border-gray-300">
                              <button
                                 onClick={() => handleConfirm(user.id)}
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
            <div className="w-11/12  border-b border-gray-300 my-4 px-6"/>
            <div className="p-6 ">
               <h2 className="text-xl mb-4 text-gray-800">Add New User</h2>
               <form onSubmit={handleAddUser} className="grid grid-cols-4 gap-x-2 gap-y-4 w-3/4 text-sm">
                  <div className="flex flex-col col-start-1 col-end-3">
                     <label className="text-gray-700 text-sm font-semibold mb-1">First Name</label>
                     <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={newUser.firstName}
                        onChange={handleNewUserChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                     />
                  </div>
                  <div className="flex flex-col col-start-3 col-end-5">
                     <label className="text-gray-700 text-sm font-semibold mb-1 ">Last Name</label>
                     <input
                        type="number"
                        name="lastName"
                        placeholder="Last Name"
                        value={newUser.lastName}
                        onChange={handleNewUserChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                     />
                  </div>
                  <div className="flex flex-col col-start-1 col-end-4">
                     <label className="text-gray-700 text-sm font-semibold mb-1">Email Address</label>
                     <input
                        type="number"
                        name="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={handleNewUserChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                     />
                  </div>
                  <div className="flex justify-center items-end">
                     <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                     >
                        Add
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   )
}

export default Users