"use client"
import Header from "../components/header"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/authContext"
import { Services, useApi, useToast } from "../services";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoIosAdd } from "react-icons/io";

const ProfileLayout = ({children}) => {
   const { currentUser, isLoggedIn, loading: authLoading } = useContext(AuthContext)
   const pathName = usePathname()
   const router = useRouter()
   const { showError } = useToast()

   // API hook for fetching user data
   const { 
      data: userData, 
      loading: userDataLoading, 
      error: userDataError, 
      execute: fetchUserData 
   } = useApi(Services.User.getUserData);

   // Watch for when currentUser becomes valid and fetch user data
   useEffect(() => { 
      console.log("useEffect triggered - currentUser:", currentUser, "isLoggedIn:", isLoggedIn);
      
      // Only fetch user data if we have a valid currentUser object with an id
      if (currentUser && currentUser.id && isLoggedIn) {
         console.log("Calling fetchUserData with user ID:", currentUser.id);
         fetchUserData(currentUser.id);
      }
   }, [currentUser?.id, isLoggedIn]); // Watch for currentUser.id specifically

   // Handle user data errors
   useEffect(() => {
      if (userDataError) {
         showError('Error', userDataError.message || 'Failed to load user data');
      }
   }, [userDataError, showError]);

   // Redirect to login if not authenticated and not loading
   useEffect(() => {
      if (!authLoading && !isLoggedIn) {
         router.push('/login');
      }
   }, [authLoading, isLoggedIn, router]);

   // Show loading spinner while auth is being checked
   if (authLoading) {
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
      <div>
         {currentUser && <Header />}
         <div className="min-h-screen bg-gray-50">
            <h1 className="text-5xl mt-12 text-center mb-12">
               Welcome, {userData ? `${userData.first_name} ${userData.last_name}` : 'User'}
            </h1>
            <Link href="/createOrganization" className="flex flex-col items-center mb-4 w-1/4 mx-auto cursor-pointer">
               <p className="text-xl">Create an Organization</p>
               <IoIosAdd className="w-16 h-16"/>
            </Link>
            <div className="flex w-3/4 justify-center mx-auto border-b mb-12 space-x-8">
               <Link 
                  href="/profile"
                  className={`px-4 py-2 text-lg ${pathName === '/profile' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`}>
                  Organizations
               </Link>
               <Link 
                  href="/profile/invites"
                  className={`px-4 py-2 text-lg ${pathName === '/profile/invites' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`}>
                  Organization Invites
               </Link>
            </div>
            <div className="w-1/2 mx-auto">
               {children}
            </div>
         </div>
      </div>
   )
}

export default ProfileLayout