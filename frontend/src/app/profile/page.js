"use client"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/authContext"
import { FaPlus } from "react-icons/fa";
import { getUserData, getUserOrganizations } from "../services/fetchService";
import Link from "next/link";

const Profile = () => {
   const {currentUser, isLoggedIn} = useContext(AuthContext)
   const [organizations, setOrganizations] = useState(null)

   useEffect(() => {

      const fetchData = async() => {
         if (isLoggedIn && currentUser) {
            const response = await getUserOrganizations(currentUser.id)
            setOrganizations(response)
         }
      }

      fetchData()
   }, [currentUser, isLoggedIn])


   return (
      <div>
         <div className=" mx-auto">
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