"use client"
import { useContext, useEffect } from "react"
import { AuthContext } from "../context/authContext"
import { useRouter } from "next/navigation"

const OrgLayout = ({children}) => {
   const {currentUser} = useContext(AuthContext)
   const router = useRouter()

   useEffect(() => {
      if (!currentUser) {
         router.push("/login")
      }
   }, [currentUser])
   
   return (
      <div>
         {currentUser && children}
      </div>
   )
}

export default OrgLayout