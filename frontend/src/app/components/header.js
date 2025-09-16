// imports
"use client"
import Link from "next/link";
import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../context/authContext";
import { FaUserCircle, FaRegUser, FaSignOutAlt } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoReorderThree } from "react-icons/io5";
import { getUserService, useApi, useToast } from "../services";

// Separate component for sidebar toggle to handle context properly
const SidebarToggle = () => {
   try {
      const { useSidebar } = require("../context/sidebarContext");
      const { toggleSidebar } = useSidebar();
      
      return (
         <button
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            onClick={toggleSidebar}
         >
            <IoReorderThree className='w-5 h-5'/>
         </button>
      );
   } catch (error) {
      return null;
   }
};

/*
   Component: Header
   Description: The header that is displayed on all pages related to the organization dashboard
*/
const Header = ({ showSidebarToggle = false }) => {
   const { currentUser, logout, isLoggedIn } = useContext(AuthContext)
   const [userData, setUserData] = useState(null)
   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
   
   const { showError } = useToast();

   // Get UserService instance
   const userService = getUserService();

   // API hook for fetching user data

   const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
   };

   const handleLogout = async () => {
      try {
         await logout();
         setIsDropdownOpen(false);
      } catch (err) {
         console.error('Logout error:', err);
         showError('Logout Error', 'Failed to logout. Please try again.');
      }
   };

   const fetchData = useCallback(async () => {
      if (!currentUser?.id) return;
      
      try {
         const response = await userService.getUserData(currentUser.id);
         // console.log("response from header", response)
         if (response) {
            setUserData(response);
         }
      } catch (err) {
         console.error('Error fetching user data:', err);
         showError('Error', 'Failed to load user data.');
      }
   }, [currentUser?.id, showError]);

   useEffect(() => {
      fetchData();
   }, [currentUser?.id]);

   return (
      <div className="relative z-40 flex justify-between items-center px-4 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" style={{ height: "50px" }}>
         <div className="flex items-center space-x-4">
            {showSidebarToggle && <SidebarToggle />}
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
               Temple Giving
            </Link>
         </div>
         
         <div className="flex items-center relative">
            {isLoggedIn && userData ? (
               <div className="relative">
                  <button
                     onClick={toggleDropdown}
                     className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                     <FaUserCircle size={32} className="text-gray-600" />
                     <span className="text-sm font-medium text-gray-700">
                        {userData.firstName} {userData.lastName}
                     </span>
                     {isDropdownOpen ? 
                        <IoIosArrowUp className="text-gray-400 text-sm" /> : 
                        <IoIosArrowDown className="text-gray-400 text-sm" />
                     }
                  </button>
                  
                  {isDropdownOpen && (
                     <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                        <div className="p-3 border-b border-gray-100">
                           <h3 className="text-sm font-semibold text-gray-900">Account</h3>
                           <p className="text-xs text-gray-500">{userData.firstName} {userData.lastName}</p>
                        </div>
                        <Link
                           href="/profile"
                           onClick={() => setIsDropdownOpen(false)}
                           className="flex items-center text-sm px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                        >
                           <FaRegUser className="mr-3 text-gray-400" /> 
                           Profile
                        </Link>
                        <button
                           onClick={handleLogout}
                           // disabled={userLoading}
                           className="flex items-center w-full text-sm text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                        >
                           <FaSignOutAlt className="mr-3" /> 
                           {/* {userLoading ? 'Logging out...' : 'Logout'} */}
                        </button>
                     </div>
                  )}
               </div>
            ) : (
               <Link 
                  href="/login" 
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 hover:bg-gray-50 rounded-lg"
               >
                  Login
               </Link>
            )}
         </div>
      </div>
   );
}

export default Header;
