"use client"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/authContext"
import { Services, useApi, useToast } from "../services";
import Link from "next/link";
import { FiRefreshCw, FiExternalLink, FiUsers } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";

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
         <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
               <p className="text-slate-600 font-medium">Checking authentication...</p>
            </div>
         </div>
      );
   }

   // Show loading state only if we've initiated the fetch and are still loading
   if (hasInitiatedFetch && loading) {
      return (
         <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
               <p className="text-slate-600 font-medium">Loading your organizations...</p>
            </div>
         </div>
      );
   }

   // Show message if user is not logged in
   if (!isLoggedIn || !currentUser) {
      return (
         <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-slate-400" />
               </div>
               <p className="text-xl text-slate-600 font-medium">Please log in to view your profile.</p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
               <h1 className="text-3xl font-bold text-slate-900">Your Organizations</h1>
               <p className="text-slate-600 mt-1">
                  {organizations ? `${organizations.length} organization${organizations.length !== 1 ? 's' : ''}` : 'Loading...'}
               </p>
            </div>
            <button
               onClick={handleRefresh}
               disabled={loading}
               className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
               <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
               <span className="font-medium">Refresh</span>
            </button>
         </div>
         
         {/* Organizations Grid */}
         <div className="space-y-4">
            {organizations && organizations.length > 0 ? (
               organizations.map((item, index) => (
                  <div 
                     key={index} 
                     className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-slate-300"
                  >
                     <div className="flex items-start gap-6">
                        {/* Organization Image */}
                        <div className="flex-shrink-0">
                           <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                              <img 
                                 src="https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"
                                 className="w-full h-full object-cover"
                                 alt={`${item.name} logo`}
                                 onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                 }}
                              />
                              <div className="hidden w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center text-white font-bold text-lg">
                                 {item.name.charAt(0).toUpperCase()}
                              </div>
                           </div>
                        </div>

                        {/* Organization Details */}
                        <div className="flex-1 min-w-0">
                           <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                 <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {item.name}
                                 </h2>
                                 <div className="flex items-center gap-2 mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                       {item.role}
                                    </span>
                                 </div>
                              </div>
                              
                              {/* Action Button */}
                              <Link 
                                 href={`/org/${item.organization_id}/dashboard/home`}
                                 className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                              >
                                 <span>Open Organization</span>
                                 <FiExternalLink className="w-4 h-4" />
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <FiUsers className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Organizations Yet</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                     You haven't joined any organizations yet. Create your own or wait for an invitation to join an existing one.
                  </p>
                  <Link 
                     href="/createOrganization"
                     className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                     <IoIosAdd className="w-5 h-5" />
                     Create Organization
                  </Link>
               </div>
            )}
         </div>
      </div>
   )
}

export default Profile