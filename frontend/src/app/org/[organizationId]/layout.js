"use client"
import { useRouter } from "next/navigation"
import Header from "@/app/components/header"
import { LandingPageContextProvider } from "@/app/context/landingPageContext"

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
      <LandingPageContextProvider>
         <Header organizationId={organizationId}/>
         <div style={{height: "90vh"}}> 
            {children} 
         </div>
      </LandingPageContextProvider>
   )
}

export default OrgLayout