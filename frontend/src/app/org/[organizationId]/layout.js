"use client"
import { useRouter } from "next/navigation"
import Header from "@/app/components/header"

const OrgLayout = ({params, children}) => {
   // const {currentUser} = useContext(AuthContext)
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
      <div>
         <Header organizationId={organizationId}/>
         <div style={{height: "90vh"}}> 
            {children} 
         </div>
      </div>
   )
}

export default OrgLayout