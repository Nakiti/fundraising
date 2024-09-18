"use client"

import { useState } from "react"
import OrganzationCard from "./organization"
import UserCard from "./user"
import useFormInput from "../hooks/useFormInput"
import axios from "axios"

const Register = () => {
   const [tab, setTab] = useState(1)

   const [orgData, handleOrgDataChange, setOrgData] = useFormInput({
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip: ""
   })

   const [userData, handleUserDataChange, setUserData] = useFormInput({
      firstName: "",
      lastName: "",
      email: "",
      password: ""
   })

   const handleRegister = async () => {
      try {
         const response = await axios.post("http://localhost:4000/api/organization/create", orgData)

         await axios.post("http://localhost:4000/api/user/create", {
            ...userData,
            organization_id: response.data,
            role: "admin"
         })

      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="flex items-start justify-center mt-16 bg-gray-50">
         {tab == 1 ? 
            <OrganzationCard orgData={orgData} handleOrgDataChange={handleOrgDataChange} setTab={setTab}/> : 
            <UserCard userData={userData} handleUserDataChange={handleUserDataChange} setTab={setTab} handleRegister={handleRegister}/>
         } 
      </div>
   )

}

export default Register