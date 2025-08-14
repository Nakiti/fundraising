"use client"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/app/context/authContext"
import { Services, useApi, useFormSubmit, useToast } from "@/app/services"
import { useRouter } from "next/navigation"

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
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Loading organization invites...</p>
            </div>
         </div>
      );
   }

   return (
      <div>
         <div className="mx-auto">
            {organizations && organizations.length > 0 ? organizations.map((item, index) => (
               <div key={index} className="bg-white p-4 shadow-md flex items-center rounded-lg space-x-4 mb-4">
                  <img 
                     src="https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"
                     className="h-20 w-20 object-cover rounded-lg"
                     alt="Organization"
                  />
                  <div className="flex flex-col flex-grow space-y-1">
                     <h2 className="text-xl font-semibold">{item.name}</h2>
                     <p className="text-gray-600">Role: {item.role}</p>
                  </div>
                  <button 
                     onClick={() => handleAccept(item.id)}
                     disabled={acceptLoading}
                     className={`ml-auto px-6 py-2 text-md font-semibold text-green-800 border-2 rounded-lg border-green-800 hover:bg-green-300 ${
                        acceptLoading ? 'opacity-50 cursor-not-allowed' : ''
                     }`}
                  >
                     {acceptLoading ? 'Accepting...' : 'Accept'}
                  </button>
               </div>
            )) :
               <p className="text-center text-xl">No Organization Invites</p>
            }
         </div>
      </div>
   )
}

export default Invites