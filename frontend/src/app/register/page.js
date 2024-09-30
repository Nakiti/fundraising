"use client"

import { useState } from "react"
import OrganzationCard from "./organization"
import UserCard from "./user"
import useFormInput from "../hooks/useFormInput"
import axios from "axios"
import ErrorModal from "../components/errorModal"

const Register = () => {
   const [tab, setTab] = useState(1)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   const [orgData, handleOrgDataChange, setOrgData] = useFormInput({
      name: "",
      email: "",
      url: "",
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
      if (orgData.name == "" || orgData.email == "" || orgData.url == "" || orgData.address == "" || orgData.city == "" 
         || orgData.state == "" || orgData.country == "" || orgData.zip == "") {

            setError(true)
            setErrorMessage("Please fill all organization fields.")
      } else if (userData.name == "" || userData.lastName == "" || userData.email == "" || userData.password == "") {
         setError(true)
         setErrorMessage("Please fill all user fields")
      } else {

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
   }

   return (
      <div className="flex items-start justify-center mt-16 bg-gray-50">
         {error && <ErrorModal message={errorMessage}/>}
         {tab == 1 ? 
            <OrganzationCard orgData={orgData} handleOrgDataChange={handleOrgDataChange} setTab={setTab}/> : 
            <UserCard userData={userData} handleUserDataChange={handleUserDataChange} setTab={setTab} handleRegister={handleRegister}/>
         } 
      </div>
   )

}

export default Register