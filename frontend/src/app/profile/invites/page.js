"use client"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/app/context/authContext"
import { Services, useApi, useFormSubmit, useToast } from "@/app/services"
import { useRouter } from "next/navigation"
import { FiCheck, FiUsers, FiMail, FiRefreshCw } from "react-icons/fi";

const Invites = () => {
   const { currentUser } = useContext(AuthContext)
   const router = useRouter()
   const { showError, showSuccess } = useToast()
   const [hasInitiatedFetch, setHasInitiatedFetch] = useState(false)

   // API hook for fetching pending organizations
   const { 
      data: organizations, 
      loading, 
      error, 
      execute: fetchOrganizations 
   } = useApi(Services.User.getPendingUserOrganizations);

   // API hook for accepting invites
   const { 
      submit: acceptInvite, 
      loading: acceptLoading 
   } = useFormSubmit(Services.Update.User.updateUserOrganizationRelation);

   useEffect(() => {
      // Only fetch organizations if we have a valid currentUser object with an id
      if (currentUser && currentUser.id) {
         setHasInitiatedFetch(true);
         fetchOrganizations(currentUser.id);
      }
   }, [currentUser?.id]); // Watch for currentUser.id specifically

   // Handle errors
   useEffect(() => {
      if (error) {
         showError('Error', error.message || 'Failed to load organization invites');
      }
   }, [error, showError]);

   const handleAccept = async (id) => {
      try {
         await acceptInvite(id);
         showSuccess('Invite Accepted', 'You have successfully joined the organization!');
         router.push("/profile");
      } catch (err) {
         console.error('Error accepting invite:', err);
         showError('Error', err.message || 'Failed to accept invite. Please try again.');
      }
   }

   // Show loading state only if we've initiated the fetch and are still loading
   if (hasInitiatedFetch && loading) {
      return (
         <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
               <p className="text-slate-600 font-medium">Loading organization invites...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-slate-900">Organization Invites</h1>
            <p className="text-slate-600 mt-1">
               {organizations ? `${organizations.length} pending invite${organizations.length !== 1 ? 's' : ''}` : 'Loading...'}
            </p>
         </div>

         {/* Invites List */}
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
                           <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                              <img 
                                 src="https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"
                                 className="w-full h-full object-cover"
                                 alt={`${item.name} logo`}
                                 onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                 }}
                              />
                              <div className="hidden w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 items-center justify-center text-white font-bold text-lg">
                                 {item.name.charAt(0).toUpperCase()}
                              </div>
                           </div>
                        </div>

                        {/* Organization Details */}
                        <div className="flex-1 min-w-0">
                           <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                 <h2 className="text-xl font-semibold text-slate-900 group-hover:text-green-600 transition-colors">
                                    {item.name}
                                 </h2>
                                 <div className="flex items-center gap-2 mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                       {item.role}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                       Pending
                                    </span>
                                 </div>
                                 <p className="text-slate-500 text-sm mt-2">
                                    You've been invited to join this organization
                                 </p>
                              </div>
                              
                              {/* Accept Button */}
                              <button 
                                 onClick={() => handleAccept(item.id)}
                                 disabled={acceptLoading}
                                 className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                 <FiCheck className="w-4 h-4" />
                                 <span>{acceptLoading ? 'Accepting...' : 'Accept Invite'}</span>
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <FiMail className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Pending Invites</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                     You don't have any pending organization invitations at the moment. Check back later or ask an organization admin to send you an invite.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                     <button 
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                     >
                        <FiRefreshCw className="w-4 h-4" />
                        Refresh
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}

export default Invites