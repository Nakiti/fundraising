"use client"
import { AuthContext } from "@/app/context/authContext";
import useFormInput from "@/app/hooks/useFormInput"
import { useContext, useEffect } from "react"
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { getOrganization } from "@/app/services/fetchService";
import { updateOrganization } from "@/app/services/updateServices";

const CampaignInfo = () => {
   const {currentUser} = useContext(AuthContext)

   const [info, handleInfoChange, setInfo] = useFormInput({
      name: "",
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
      <div>
         <h1 className="text-lg font-semibold mb-4 text-gray-800">Campaign Details</h1>
         <div className="w-5/6 grid grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col">
               <label className="text-gray-700 text-sm font-semibold mb-1">Organization Name</label>
               <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={info.name}
                  className="w-full bg-gray-50 px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                  onChange={handleInfoChange}
               />
            </div>
            <div className="flex justify-start items-end">
               <button
                  onClick={handleUpdate}
                  className="px-6 py-1 h-1/2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none  focus:ring-blue-600"
               >
                  <FaCheck />
               </button>
            </div>
         </div>
      </div>
   )
}

export default CampaignInfo