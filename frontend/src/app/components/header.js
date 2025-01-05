// imports
"use client"
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { FaUserCircle, FaRegUser, FaTachometerAlt, FaCog, FaSignOutAlt, } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { getUserData } from "../services/fetchService";

/*
   Component: Header
   Description: The header that is displayed on all pages related to the organization dashboard
*/
const Header = () => {
   const {currentUser} = useContext(AuthContext)
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [userData, setUserData] = useState(null)

   /*
      Function: toggleDropdown
      Description: toggles the state of the dropdown that displays options
   */
   const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
   };

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await getUserData(currentUser.id)
            setUserData(response)
            console.log(response)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, []);

   return (
      <div className="flex justify-between items-center px-4 bg-white border-b border-gray-200 shadow-sm" style={{ height: "10vh" }}>
         <Link href="/" className="text-lg font-bold ml-8">Title</Link>
         <div className="flex items-center relative h-full border-l border-gray-300">
            {userData ? (
               <div
                  className="flex flex-row items-center justify-between w-64 cursor-pointer hover:bg-gray-100 py-2 px-6 rounded-md"
                  onClick={toggleDropdown}
               >
                  <div className="flex flex-row items-center space-x-2">
                     <FaUserCircle size={32} className="text-gray-700" />
                     <span className="text-lg text-gray-800">{userData.first_name} {userData.last_name}</span>
                  </div>
                  {isDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
               </div>
            ) : 
            <div className="flex flex-row items-center justify-between w-48 cursor-pointer hover:bg-gray-100 py-2 px-6 rounded-md">
               <div className="flex flex-row items-center">
                  <Link href={"/login"} className="text-lg text-gray-800">Login</Link>
               </div>
            </div>
            }
            {isDropdownOpen && (
               <div className="absolute right-0 p-2 mt-44 w-72 bg-white border border-gray-200 rounded-md shadow-sm z-10">
                  <Link
                     href="/profile"
                     className="flex items-center text-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                     <FaRegUser className="mr-4" /> 
                     Profile
                  </Link>
                  <button
                     onClick={() => alert("Logging out...")}
                     className="flex items-center w-full text-lg text-left px-4 py-3 text-red-600 hover:bg-gray-100"
                  >
                     <FaSignOutAlt className="mr-4" /> Logout
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}

export default Header;
