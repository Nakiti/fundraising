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
         <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="text-center">
               <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
               <p className="text-slate-600 font-medium">Loading your profile...</p>
            </div>
         </div>
      );
   }

   // Don't render if not authenticated (will redirect to login)
   if (!isLoggedIn) {
      return null;
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
         {currentUser && <Header />}
         
         {/* Hero Section */}
         <div className="relative overflow-hidden bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-5"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
               <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                     Welcome back, <span className="text-blue-600">{userData ? `${userData.first_name} ${userData.last_name}` : 'User'}</span>
                  </h1>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                     Manage your organizations and stay connected with your fundraising community
                  </p>
               </div>
            </div>
         </div>

         {/* Create Organization CTA */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link 
               href="/createOrganization" 
               className="group block max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
               <div className="flex items-center justify-center space-x-4">
                  <div className="flex-shrink-0">
                     <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IoIosAdd className="w-6 h-6 text-white" />
                     </div>
                  </div>
                  <div className="text-center">
                     <p className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        Create an Organization
                     </p>
                     <p className="text-sm text-slate-500">Start your fundraising journey</p>
                  </div>
               </div>
            </Link>
         </div>

         {/* Navigation Tabs */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-b border-slate-200">
               <nav className="flex space-x-8" aria-label="Profile navigation">
                  <Link 
                     href="/profile"
                     className={`relative py-4 px-1 text-sm font-medium transition-colors duration-200 ${
                        pathName === '/profile' 
                           ? 'text-blue-600 border-b-2 border-blue-600' 
                           : 'text-slate-500 hover:text-slate-700 hover:border-slate-300'
                     }`}
                  >
                     Organizations
                     {pathName === '/profile' && (
                        <div className="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600"></div>
                     )}
                  </Link>
                  <Link 
                     href="/profile/invites"
                     className={`relative py-4 px-1 text-sm font-medium transition-colors duration-200 ${
                        pathName === '/profile/invites' 
                           ? 'text-blue-600 border-b-2 border-blue-600' 
                           : 'text-slate-500 hover:text-slate-700 hover:border-slate-300'
                     }`}
                  >
                     Organization Invites
                     {pathName === '/profile/invites' && (
                        <div className="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600"></div>
                     )}
                  </Link>
               </nav>
            </div>
         </div>

         {/* Main Content */}
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
         </div>
      </div>
   )
}

export default ProfileLayout