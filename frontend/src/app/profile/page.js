"use client"
import Header from "../components/header"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/authContext"
import { FaPlus } from "react-icons/fa";
import { getUserData, getUserOrganizations } from "../services/fetchService";


const Profile = () => {
   const {currentUser} = useContext(AuthContext)
   const [organizations, setOrganizations] = useState(null)
   const [activeTab, setActiveTab] = useState('organizations');
   const [userData, setUserData] = useState(null)

   useEffect(() => {
      const fetchData = async() => {
         const response = await getUserOrganizations(currentUser && currentUser.id)
         setOrganizations(response)
         console.log("asad", response)

         const userResponse = await getUserData(currentUser && currentUser.id)
         setUserData(userResponse)
         console.log(userResponse)
      }

      fetchData()
      console.log("runn")
   }, [currentUser])

   return (

      <div>
         <Header />
         <div className="min-h-screen bg-gray-50">
            <h1 className="text-5xl mt-12 text-center mb-16">Welcome, {userData && userData.first_name} {userData && userData.last_name}</h1>

            <div className="flex w-3/4 justify-center mx-auto border-b mb-12 space-x-8">
               <button 
                  onClick={() => setActiveTab('organizations')} 
                  className={`px-4 py-2 text-lg ${activeTab === 'organizations' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`}>
                  Organizations
               </button>
               <button 
                  onClick={() => setActiveTab('createOrganization')} 
                  className={`px-4 py-2 text-lg ${activeTab === 'createOrganization' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`}>
                  Create Organization
               </button>
               <button 
                  onClick={() => setActiveTab('organizationInvites')} 
                  className={`px-4 py-2 text-lg ${activeTab === 'organizationInvites' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`}>
                  Organization Invites
               </button>
            </div>

            {/* Tab Content */}
            <div className="w-1/2 mx-auto">
               {activeTab === 'organizations' && (
                  <div>
                     <h4 className="text-xl text-center mb-4">Your Organizations</h4>
                     {organizations && organizations.map((item, index) => (
                        <div key={index} className="bg-white p-4 shadow-md flex flex-row rounded-lg space-x-4 mb-4">
                           <img 
                              src="https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"
                              className="h-20 w-20 object-cover rounded-lg"
                              alt="Organization"
                           />
                           <div className="flex flex-col space-y-2">
                              <h2 className="text-xl font-semibold">{item.name}</h2>
                              <button className="rounded-lg border-2 border-blue-800 px-4 py-2 text-sm font-semibold text-blue-800">
                                 Open Organization
                              </button>
                           </div>
                           <div>
                              <p>Role: {item.role}</p>
                           </div>
                        </div>
                     ))}
                  </ div>
               )}

               {activeTab === 'createOrganization' && (
                  <div className="flex flex-col items-center mb-16">
                     <button className="bg-blue-700 p-4 text-white rounded-full mb-2">
                        <FaPlus className="h-6 w-6" />
                     </button>
                     <p className="text-2xl">Create an Organization</p>
                     {/* Add form fields for creating an organization if needed */}
                  </div>
               )}

               {activeTab === 'organizationInvites' && (
                  <div>
                     <h4 className="text-xl text-center mb-4">Organization Invites</h4>
                     {/* Display organization invites here */}
                     <p className="text-center text-gray-500">You have no pending invites.</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

export default Profile