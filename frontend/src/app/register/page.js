"use client"

import { useState } from "react"
import OrganzationCard from "./organization"
import UserCard from "./user"
import useFormInput from "../hooks/useFormInput"
import axios from "axios"
import ErrorModal from "../components/errorModal"
import { useRouter } from "next/navigation"

const Register = () => {
   const [tab, setTab] = useState(1)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const router = useRouter()

   // const [orgData, handleOrgDataChange, setOrgData] = useFormInput({
   //    name: "",
   //    email: "",
   //    url: "",
   //    address: "",
   //    city: "",
   //    state: "",
   //    country: "",
   //    zip: 0
   // })

   const [userData, handleUserDataChange, setUserData] = useFormInput({
      firstName: "",
      lastName: "",
      email: "",
      password: ""
   })

   const handleRegister = async () => {
      if (userData.name == "" || userData.lastName == "" || userData.email == "" || userData.password == "") {
         setError(true)
         setErrorMessage("Please fill all user fields")
      } else {
         try {
            await axios.post("http://localhost:4000/api/user/create", {
               ...userData
            })

            router.push("/login")
         } catch (err) {
            console.log(err)
         }
      }
   }

   return (
      <div className="flex items-start justify-center p-12 t-16 bg-gray-50">
         {error && <ErrorModal message={errorMessage} setError={setError}/>}
         <UserCard userData={userData} handleUserDataChange={handleUserDataChange} setTab={setTab} handleRegister={handleRegister}/>

      </div>
   )

}

export default Register