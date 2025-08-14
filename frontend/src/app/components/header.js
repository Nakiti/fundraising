// imports
"use client"
import Link from "next/link";
import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../context/authContext";
import { FaUserCircle, FaRegUser, FaTachometerAlt, FaCog, FaSignOutAlt, } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoReorderThree } from "react-icons/io5";
import { Services, useApi, useToast } from "../services";

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
   const { currentUser, logout, isLoggedIn, loading } = useContext(AuthContext)
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [userData, setUserData] = useState(null)
   
   const { showError } = useToast();

   // API hook for fetching user data
   const { execute: fetchUserData, loading: userLoading } = useApi(Services.User.getUserData);

   /*
      Function: toggleDropdown
      Description: toggles the state of the dropdown that displays options
   */
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
         const response = await fetchUserData(currentUser.id);
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
      <div className="flex justify-between items-center px-4 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" style={{ height: "50px" }}>
         <div className="flex items-center space-x-4">
            {showSidebarToggle && <SidebarToggle />}
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
               Temple Giving
            </Link>
         </div>
         <div className="flex items-center relative h-full">
            {isLoggedIn && userData ? (
               <div
                  className="flex flex-row items-center justify-between w-64 cursor-pointer hover:bg-gray-50 py-2 px-4 rounded-lg transition-all duration-200 mx-2"
                  onClick={toggleDropdown}
               >
                  <div className="flex flex-row items-center space-x-3">
                     <FaUserCircle size={32} className="text-gray-600" />
                     <span className="text-sm font-medium text-gray-700">{userData.first_name} {userData.last_name}</span>
                  </div>
                  {isDropdownOpen ? 
                     <IoIosArrowUp className="text-gray-400 text-sm" /> : 
                     <IoIosArrowDown className="text-gray-400 text-sm" />
                  }
               </div>
            ) : 
            <div className="flex flex-row items-center justify-between w-32 cursor-pointer hover:bg-gray-50 py-2 px-4 rounded-lg transition-all duration-200 mx-2">
               <div className="flex flex-row items-center">
                  <Link href={"/login"} className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">Login</Link>
               </div>
            </div>
            }
            {isDropdownOpen && isLoggedIn && (
               <div className="absolute right-0 p-2 mt-16 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                  <div className="p-3 border-b border-gray-100">
                     <h3 className="text-sm font-semibold text-gray-900">Account</h3>
                     <p className="text-xs text-gray-500">{userData.first_name} {userData.last_name}</p>
                  </div>
                  <Link
                     href="/profile"
                     className="flex items-center text-sm px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                     <FaRegUser className="mr-3 text-gray-400" /> 
                     Profile
                  </Link>
                  <button
                     onClick={handleLogout}
                     disabled={userLoading}
                     className="flex items-center w-full text-sm text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                  >
                     <FaSignOutAlt className="mr-3" /> 
                     {userLoading ? 'Logging out...' : 'Logout'}
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}

export default Header;
