"use client"
import { AuthContext } from "@/app/context/authContext"
import useFormInput from "@/app/hooks/useFormInput"
import { getOrganization } from "@/app/services/fetchService"
import { updateOrganization } from "@/app/services/updateServices"
import axios from "axios"
import { useContext, useEffect } from "react"
import { FaCheck } from "react-icons/fa";

const Address = () => {
   const {currentUser} = useContext(AuthContext)

   const [info, handleInfoChange, setInfo] = useFormInput({
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip: ""
   })




   const handleUpdate = async () => {
      try {
         await updateOrganization(currentUser.organization_id, info)
      } catch (err) {
         console.log(err)
      }
   }

   const fetchData = async() => {
      try {
         const response = await getOrganization(currentUser.organization_id)
         setInfo(prev => ({
            ...prev,
            address: response.address,
            city: response.city,
            state: response.state,
            country: response.country,
            zip: response.zip
         }))
         
      }  catch (err) {
         console.log(err)
      }
   }

   useEffect(() => {
      fetchData()
   }, [])

   return (
      <div>
         <h1 className="text-lg font-semibold mb-4 text-gray-800">Address</h1>
         <div className="w-5/6 grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col">
               <label className="text-gray-700 text-sm font-semibold mb-1">Street Address</label>
               <input
                  type="text"
                  name="address"
                  placeholder="Title"
                  className="bg-gray-50 w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={info.address}
                  onChange={handleInfoChange}
               />
            </div>
            <div className="flex flex-col">
               <label className="text-gray-700 text-sm font-semibold mb-1">City</label>
               <input
                  type="text"
                  name="city"
                  placeholder="Title"
                  className="bg-gray-50 w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={info.city}
                  onChange={handleInfoChange}
               />
            </div>
            <div className="flex flex-col">
               <label className="text-gray-700 text-sm font-semibold mb-1">State</label>
               <input
                  type="text"
                  name="state"
                  placeholder="Title"
                  className="bg-gray-50 w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={info.state}
                  onChange={handleInfoChange}
               />
            </div>
            <div className="flex flex-col">
               <label className="text-gray-700 text-sm font-semibold mb-1">Country</label>
               <input
                  type="text"
                  name="country"
                  placeholder="Title"
                  className="bg-gray-50 w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={info.country}
                  onChange={handleInfoChange}
               />
            </div>
            <div className="flex flex-col">
               <label className="text-gray-700 text-sm font-semibold mb-1">Zipcode</label>
               <input
                  type="text"
                  name="zip"
                  placeholder="Title"
                  className="bg-gray-50 w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={info.zip}
                  onChange={handleInfoChange}
               />
            </div>
            <div className="flex justify-start items-end">
               <button
                  onClick={handleUpdate}
                  className="px-6 py-1 h-1/2  bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none  focus:ring-blue-600"
               >
                  <FaCheck />
               </button>
            </div>
         </div>
      </div>
   )
}

export default Address