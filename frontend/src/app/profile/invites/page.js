"use client"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/app/context/authContext"
import { getPendingUserOrganizations } from "@/app/services/fetchService"
import { updateUserOrganizationRelation } from "@/app/services/updateServices"
import { useRouter } from "next/navigation"

const Invites = () => {
   const {currentUser} = useContext(AuthContext)
   const [organizations, setOrganizations] = useState(null)
   const router = useRouter()

   useEffect(() => {
      const fetchData = async() => {
         const response = await getPendingUserOrganizations(currentUser && currentUser.id)
         console.log("wooo", response)
         setOrganizations(response)
      }

      fetchData()
   }, [currentUser])

   const handleAccept = async(id) => {
      try {
         await updateUserOrganizationRelation(id)
         router.push("/profile")
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div>
         <div className=" mx-auto">
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
                     className="ml-auto px-6 py-2 text-md font-semibold text-green-800 border-2 rounded-lg border-green-800 hover:bg-green-300"
                  >
                     Accept
                  </button>
               </div>
            )) :
               <p className="text-center text-xl">No Orgnization Invites</p>
            }
         </div>
      </div>
   )
}

export default Invites