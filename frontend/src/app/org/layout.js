"use client"
import { useContext, useEffect } from "react"
import { AuthContext } from "../context/authContext"
import { useRouter } from "next/navigation"
import Header from "../components/header"

const OrgLayout = ({children}) => {
   const {currentUser} = useContext(AuthContext)
   const router = useRouter()

   useEffect(() => {
      if (!currentUser) {
         router.push("/login")
      }
   }, [currentUser])
   
   //have to check that user is logged in
   return (
      <div>
         <Header />
         <div style={{height: "90vh"}}> 
            {children} 
         </div>
      </div>
   )
}

export default OrgLayout