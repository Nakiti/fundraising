"use client"
import { useState, useContext } from "react"
import useFormInput from "../hooks/useFormInput"
import Header from "../components/header"
import { AuthContext } from "../context/authContext"
import { createOrganization, createUserOrganizationRelation } from "../services/createServices"
import { useRouter } from "next/navigation"

const CreateOrganization = () => {
   const [orgData, handleOrgDataChange, setOrgData] = useFormInput({
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip: ""
   })
   const {currentUser} = useContext(AuthContext)
   const userId = currentUser.id
   const router = useRouter()

   const handleRegister = async() => {
      const organizationId = await createOrganization(orgData, userId)
      await createUserOrganizationRelation(userId, organizationId, "active", "admin")
      router.push("/profile")
   }

   return (
      <div>
         <Header />
         <div className="p-8">
            <div className="max-w-4xl bg-white rounded-lg shadow-lg p-10 mx-auto">
               <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Register an Organization</h1>
            
               <div className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2">
                  <div className="col-span-2">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Organization Name</label>
                     <input
                        name="name"
                        type="text"
                        placeholder="Enter an Organization Name"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={orgData.name}
                        onChange={handleOrgDataChange}
                     />
                  </div>
            
                  <div className="col-span-2">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Organization URL</label>
                     <input
                        name="url"
                        type="text"
                        placeholder="Enter an Organization URL"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={orgData.url}
                        onChange={handleOrgDataChange}
                     />
                  </div>
            
                  <div className="col-span-2">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Organization Email</label>
                     <input
                        name="email"
                        type="email"
                        placeholder="Enter an Organization Email"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={orgData.email}
                        onChange={handleOrgDataChange}
                     />
                  </div>
            
                  <div className="col-span-2 md:col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Street Address</label>
                     <input
                        name="address"
                        type="text"
                        placeholder="Enter Street Address"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={orgData.address}
                        onChange={handleOrgDataChange}
                     />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">City</label>
                     <input
                        name="city"
                        type="text"
                        placeholder="Enter City"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={orgData.city}
                        onChange={handleOrgDataChange}
                     />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">State</label>
                     <input
                        name="state"
                        type="text"
                        placeholder="Enter State"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={orgData.state}
                        onChange={handleOrgDataChange}
                     />
                  </div>
            
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Country</label>
                     <input
                        name="country"
                        type="text"
                        placeholder="Enter Country"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={orgData.country}
                        onChange={handleOrgDataChange}
                     />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Zipcode</label>
                     <input
                        name="zip"
                        type="number"
                        placeholder="Enter Zipcode"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={orgData.zip}
                        onChange={handleOrgDataChange}
                     />
                  </div>
               </div>
            
               <div className="flex items-center justify-center mt-8">
                  <button 
                     className="py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition w-full md:w-1/4"
                     onClick={handleRegister}
                  >
                     Register
                  </button>
               </div>
            </div>
         </div>
      </div>
   
   )
}

export default CreateOrganization