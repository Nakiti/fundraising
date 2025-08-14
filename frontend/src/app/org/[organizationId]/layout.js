"use client"
import Header from "@/app/components/header"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "@/app/context/authContext"
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/app/context/sidebarContext"

const OrgLayout = ({params, children}) => {
   const {currentUser, isLoggedIn, loading} = useContext(AuthContext)
   const organizationId = params.organizationId
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const router = useRouter()

   // Redirect to login if not authenticated and not loading
   useEffect(() => {
      if (!loading && !isLoggedIn) {
         router.push('/login');
      }
   }, [loading, isLoggedIn, router]);

   // Global error handler for the org layout
   const handleError = (error) => {
      const handledError = errorHandler.handle(error)
      setErrorMessage(handledError.message)
      setError(true)
   }

   // Show loading spinner while auth is being checked
   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
         </div>
      );
   }

   // Don't render if not authenticated (will redirect to login)
   if (!isLoggedIn) {
      return null;
   }

   return (
      <SidebarProvider>
         <div>
            <Header organizationId={organizationId} showSidebarToggle={true}/>
            {error && <ErrorModal message={errorMessage} setError={setError} />}
            <div style={{height: "90vh"}}> 
               {children} 
            </div>
         </div>
      </SidebarProvider>
   )
}

export default OrgLayout