"use client"
import { AuthContext } from "@/app/context/authContext";
import useFormInput from "@/app/hooks/useFormInput"
import { useContext, useEffect } from "react"
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { getOrganization } from "@/app/services/fetchService";
import { updateOrganization } from "@/app/services/updateServices";

const Organization = () => {
   const {currentUser} = useContext(AuthContext)

   const [info, handleInfoChange, setInfo] = useFormInput({
      name: "",
      url: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip: ""
   })

   const fetchData = async() => {
      try {
         const response = await getOrganization(currentUser.organization_id)
         setInfo((prevInfo) => ({
            ...prevInfo, 
            name: response.name,
         }))
      } catch (err) {
         console.log(err)
      }
   }

   const handleUpdate = async() => {
      try {
         await updateOrganization(currentUser.organization_id, info)
         fetchData()
      } catch (err) {
         console.log(err)
      }
   }

   useEffect(() => {
      fetchData()
   }, [])

   return (
      <div className="w-full h-full p-4">
         <div className="w-full h-full p-4 bg-white rounded-sm overflow-y-auto">
            <div className="p-6">
               <h1 className="text-3xl font-semibold mb-4 text-gray-800">Organization</h1>
               <p className="text-gray-700">Manage details about your organization</p>
            </div>    

            <div className="w-3/4 p-6">

               <h1 className="text-2xl mb-4">General:</h1>

               <div className="text-sm space-y-6">

                  <div className="flex flex-col">
                     <label className="text-gray-700 text-sm font-semibold mb-2">Organization Name</label>
                     <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={info.name}
                        className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                        onChange={handleInfoChange}
                     />
                  </div>
                  <div className="flex flex-col">
                     <label className="text-gray-700 text-sm font-semibold mb-1">Organization URL</label>
                     <input
                        type="text"
                        name="url"
                        placeholder="URL"
                        value={info.url}
                        className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                        onChange={handleInfoChange}
                     />
                  </div>


               </div>
               <div className="flex justify-end items-end mt-4">
                  <button
                     onClick={handleUpdate}
                     className="px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 focus:outline-none  focus:ring-blue-600"
                  >
                     Save Changes
                  </button>
               </div>
            </div>

            <div className="w-3/4 border-b border-gray-300 my-4 px-6"/>

            <div className="w-3/4 p-6">
               <h1 className="text-2xl mb-4">Address:</h1>
               <div className="text-sm grid grid-cols-4 gap-4">

                  <div className="flex flex-col col-start-1 col-end-4">
                     <label className="text-gray-700 text-sm font-semibold mb-2 ">Street Address</label>
                     <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={info.name}
                        className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                        onChange={handleInfoChange}
                     />
                  </div>
                  <div className="flex flex-col">
                     <label className="text-gray-700 text-sm font-semibold mb-2">City</label>
                     <input
                        type="text"
                        name="url"
                        placeholder="URL"
                        value={info.url}
                        className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                        onChange={handleInfoChange}
                     />
                  </div>
                  <div className="flex flex-col col-span-2">
                     <label className="text-gray-700 text-sm font-semibold mb-2">State</label>
                     <input
                        type="text"
                        name="url"
                        placeholder="URL"
                        value={info.url}
                        className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                        onChange={handleInfoChange}
                     />
                  </div>
                  <div className="flex flex-col col-span-2">
                     <label className="text-gray-700 text-sm font-semibold mb-2">Country</label>
                     <input
                        type="text"
                        name="url"
                        placeholder="URL"
                        value={info.url}
                        className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                        onChange={handleInfoChange}
                     />
                  </div>
                  <div className="flex flex-col">
                     <label className="text-gray-700 text-sm font-semibold mb-2">Zipcode</label>
                     <input
                        type="text"
                        name="url"
                        placeholder="URL"
                        value={info.url}
                        className="w-full text-md bg-gray-50 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                        onChange={handleInfoChange}
                     />
                  </div>

               </div>

               <div className="flex justify-end items-end">
                  <button
                     onClick={handleUpdate}
                     className="px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 focus:outline-none  focus:ring-blue-600"
                  >
                     Save Changes
                  </button>
               </div>
            </div>

         </div>
      </div>
   )
}

export default Organization