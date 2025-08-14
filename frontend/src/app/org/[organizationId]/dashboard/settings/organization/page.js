"use client"
import useFormInput from "@/app/hooks/useFormInput"
import {useEffect, useState } from "react"
import { OrganizationService } from "@/app/services/fetchService";
import { OrganizationUpdateService } from "@/app/services/updateServices";
import { errorHandler } from "@/app/services/apiClient";
import ErrorModal from "@/app/components/errorModal";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

/*
   Component: Organization
   Description: renders organization page and allows user to manage settings
*/
const Organization = ({params}) => {
   const organizationId = params.organizationId
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   const [info, handleInfoChange, setInfo] = useFormInput({
      name: "",
      url: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip: ""
   })

   /*
      Function: fetchData
      Description: fetches organization information
   */
   const fetchData = async() => {
      try {
         const response = await OrganizationService.getOrganization(organizationId)
         setInfo((prevInfo) => ({
            ...prevInfo, 
            name: response.name,
         }))
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      }
   }

   /*
      Function: handleUpdate
      Description: update organization information
   */
   const handleUpdate = async() => {
      try {
         await OrganizationUpdateService.updateOrganization(organizationId, info)
         fetchData()
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      }
   }

   useEffect(() => {
      fetchData()
   }, [])

   return (
      <div className="w-full h-full overflow-y-auto">
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         <div className="p-6 bg-gray-50">
         <div className="w-full h-full p-8 bg-white rounded-lg shadow-sm ">
            <Link 
               href={`/org/${organizationId}/dashboard/settings`}
               className="text-gray-700 flex flex-row items-center space-x-2"
            >
               <FaArrowLeft className="text-gray-700"/>
               <p>Settings</p>
            </Link>
            <div className="p-6">
               <h1 className="text-3xl font-semibold mb-4 text-gray-800">Organization</h1>
               <p className="text-gray-700">Manage details about your organization</p>
            </div>
      
            <div className="w-full max-w-4xl p-6">
               <h2 className="text-xl font-semibold text-gray-800 mb-4">General:</h2>
               <div className="space-y-6">
      
                  <div className="flex flex-col">
                     <label className="text-gray-700 text-sm font-semibold mb-2">Organization Name</label>
                     <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={info.name}
                        className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                        onChange={handleInfoChange}
                     />
                  </div>
                  <div className="flex flex-col">
                     <label className="text-gray-700 text-sm font-semibold mb-2">Organization URL</label>
                     <input
                        type="text"
                        name="url"
                        placeholder="URL"
                        value={info.url}
                        className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                        onChange={handleInfoChange}
                     />
                  </div>
      
               </div>
      
               <div className="flex justify-end mt-6">
                  <button
                     onClick={handleUpdate}
                     className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                     Save Changes
                  </button>
               </div>
            </div>
      
            <div className="w-full border-b border-gray-300 my-4 "/>
      
            <div className="w-full max-w-4xl p-6">
               <h2 className="text-xl font-semibold text-gray-800 mb-4">Address:</h2>
               <div className="space-y-6">
      
                  <div className="flex flex-col">
                     <label className="text-gray-700 text-sm font-semibold mb-2">Street Address</label>
                     <input
                        type="text"
                        name="street"
                        placeholder="Street Address"
                        value={info.street}
                        className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                        onChange={handleInfoChange}
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col">
                        <label className="text-gray-700 text-sm font-semibold mb-2">City</label>
                        <input
                           type="text"
                           name="city"
                           placeholder="City"
                           value={info.city}
                           className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                           required
                           onChange={handleInfoChange}
                        />
                     </div>
                     <div className="flex flex-col">
                        <label className="text-gray-700 text-sm font-semibold mb-2">State</label>
                        <input
                           type="text"
                           name="state"
                           placeholder="State"
                           value={info.state}
                           className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                           required
                           onChange={handleInfoChange}
                        />
                     </div>
                  </div>
      
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col">
                        <label className="text-gray-700 text-sm font-semibold mb-2">Country</label>
                        <input
                           type="text"
                           name="country"
                           placeholder="Country"
                           value={info.country}
                           className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                           required
                           onChange={handleInfoChange}
                        />
                     </div>
                     <div className="flex flex-col">
                        <label className="text-gray-700 text-sm font-semibold mb-2">Zipcode</label>
                        <input
                           type="text"
                           name="zipcode"
                           placeholder="Zipcode"
                           value={info.zipcode}
                           className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                           required
                           onChange={handleInfoChange}
                        />
                     </div>
                  </div>
               </div>
      
               <div className="flex justify-end mt-6">
                  <button
                     onClick={handleUpdate}
                     className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                     Save Changes
                  </button>
               </div>
            </div>
         </div>
         </div>
      </div>
   )
}

export default Organization