"use client"
import { AuthContext } from "@/app/context/authContext"
import useFormInput from "@/app/hooks/useFormInput"
import axios from "axios"
import { useContext, useEffect } from "react"
import { FaCheck } from "react-icons/fa";

const Address = () => {
   const {currentUser} = useContext(AuthContext)

   const [info, handleInfoChange, setInfo] = useFormInput({
      address: "",
      city: "",
      state: "",
      country: "",
      zip: ""
   })

   useEffect(() => {
      fetchData()
   }, [])

   const fetchData = async() => {
      try {
         const response = (await axios.get(`http://localhost:4000/api/organization/get/${currentUser.organization_id}`)).data[0]
         setInfo({
            address: response.address,
            city: response.city,
            state: response.state,
            country: response.country,
            zip: response.zip
         })
      }  catch (err) {
         console.log(err)
      }
   }

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
               />
            </div>
            <div className="flex justify-start items-end">
               <button
                  type="submit"
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