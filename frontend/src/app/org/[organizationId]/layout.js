"use client"
import { useRouter } from "next/navigation"
import Header from "@/app/components/header"
import { LandingPageContextProvider } from "@/app/context/landingPageContext"
import { useContext } from "react"
import { AuthContext } from "@/app/context/authContext"

const OrgLayout = ({params, children}) => {
   const {currentUser} = useContext(AuthContext)
   const router = useRouter()
   const organizationId = params.organizationId

   // useEffect(() => {
   //    if (currentUser == null) {
   //       router.push("/login")
   //    }
   //    console.log("asdads", currentUser)
   // }, [currentUser])
   
   //have to check that user is logged in
   return (
      <LandingPageContextProvider>
         {currentUser && <Header organizationId={organizationId} user={currentUser}/>}
         <div style={{height: "90vh"}}> 
            {children} 
         </div>
      </LandingPageContextProvider>
   )
}

export default OrgLayout