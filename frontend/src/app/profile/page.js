"use client"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/authContext"
import { Services, useApi, useToast } from "../services";
import Link from "next/link";

const Profile = () => {
   const { currentUser, isLoggedIn, loading: authLoading, refetchAuth } = useContext(AuthContext)
   const { showError, showSuccess } = useToast()
   const [hasInitiatedFetch, setHasInitiatedFetch] = useState(false)

   // API hook for fetching user organizations
   const { 
      data: organizations, 
      loading, 
      error, 
      execute: fetchOrganizations 
   } = useApi(Services.User.getUserOrganizations);

   useEffect(() => {
      // Wait for authentication to be fully loaded and user to be available
      if (!authLoading && isLoggedIn && currentUser && currentUser.id) {
         setHasInitiatedFetch(true);
         fetchOrganizations(currentUser.id);
      }
   }, [currentUser?.id, isLoggedIn, authLoading, fetchOrganizations]); // Added fetchOrganizations to dependencies

   // Add a retry mechanism if organizations haven't loaded after a delay
   useEffect(() => {
      if (!authLoading && isLoggedIn && currentUser && currentUser.id && !hasInitiatedFetch) {
         const timer = setTimeout(() => {
            setHasInitiatedFetch(true);
            fetchOrganizations(currentUser.id);
         }, 1000); // Retry after 1 second if not already fetched
         
         return () => clearTimeout(timer);
      }
   }, [currentUser?.id, isLoggedIn, authLoading, hasInitiatedFetch, fetchOrganizations]);

   // Handle errors
   useEffect(() => {
      if (error) {
         showError('Error', error.message || 'Failed to load organizations');
      }
   }, [error, showError]);

   // Manual refresh function
   const handleRefresh = async () => {
      try {
         await refetchAuth();
         if (currentUser && currentUser.id) {
            setHasInitiatedFetch(true);
            await fetchOrganizations(currentUser.id);
            showSuccess('Success', 'Profile refreshed successfully');
         }
      } catch (err) {
         showError('Error', 'Failed to refresh profile');
      }
   };

   // Show loading state while authentication is being checked
   if (authLoading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Checking authentication...</p>
            </div>
         </div>
      );
   }

   // Show loading state only if we've initiated the fetch and are still loading
   if (hasInitiatedFetch && loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Loading your organizations...</p>
            </div>
         </div>
      );
   }

   // Show message if user is not logged in
   if (!isLoggedIn || !currentUser) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
               <p className="text-xl text-gray-600">Please log in to view your profile.</p>
            </div>
         </div>
      );
   }

   return (
      <div>
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Organizations</h1>
            <button
               onClick={handleRefresh}
               className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
               disabled={loading}
            >
               {/* <FaRefresh className={`${loading ? 'animate-spin' : ''}`} /> */}
               <span>Refresh</span>
            </button>
         </div>
         
         <div className="mx-auto">
            {organizations && organizations.length > 0 ? organizations.map((item, index) => (
               <div key={index} className="bg-white p-4 shadow-md flex flex-row rounded-lg space-x-4 mb-4">
                  <img 
                     src="https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"
                     className="h-20 w-20 object-cover rounded-lg"
                     alt="Organization"
                  />
                  <div className="flex flex-col space-y-2">
                     <h2 className="text-xl font-semibold">{item.name}</h2>
                     <Link 
                        className="rounded-lg border-2 border-blue-800 px-4 py-2 text-sm font-semibold text-blue-800"
                        href={`/org/${item.organization_id}/dashboard/home`}
                     >
                        Open Organization
                     </Link>
                  </div>
                  <div>
                     <p>Role: {item.role}</p>
                  </div>
               </div>
            )) :
            <p className="text-center text-xl">No Active Organizations</p>
         }
         </div>
      </div>
   )
}

export default Profile