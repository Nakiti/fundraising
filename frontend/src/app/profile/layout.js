"use client"
import Header from "../components/header"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/authContext"
import { getUserData, getUserOrganizations } from "../services/fetchService";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosAdd } from "react-icons/io";

const ProfileLayout = ({children}) => {
   const {currentUser} = useContext(AuthContext)
   const [userData, setUserData] = useState(null)
   const pathName = usePathname()

   useEffect(() => {
      const fetchData = async() => {
         console.log("user from layout", currentUser)
         const userResponse = await getUserData(currentUser.id)
         setUserData(userResponse)
      }

      fetchData()
   }, [currentUser])

   return (
      <div>
         <Header />
         <div className="min-h-screen bg-gray-50">
            <h1 className="text-5xl mt-12 text-center mb-12">Welcome, {userData && userData.first_name} {userData && userData.last_name}</h1>
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