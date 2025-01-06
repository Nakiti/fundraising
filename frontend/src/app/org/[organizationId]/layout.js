"use client"
import Header from "@/app/components/header"
import { useContext } from "react"
import { AuthContext } from "@/app/context/authContext"

const OrgLayout = ({params, children}) => {
   const {currentUser} = useContext(AuthContext)
   const organizationId = params.organizationId

   return (
      <div>
         {<Header organizationId={organizationId}/>}
         <div style={{height: "90vh"}}> 
            {children} 
         </div>
      </div>
   )
}

export default OrgLayout