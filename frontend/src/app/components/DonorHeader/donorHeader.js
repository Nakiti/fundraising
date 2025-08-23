"use client";

import { useState } from 'react';
import { FaUserCircle, FaSignOutAlt, FaCog, FaUser } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoReorderThree } from "react-icons/io5";
import { useDonor } from '../../context/donorContext';
import { useDonorSidebar } from '../../context/donorSidebarContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DonorSidebarToggle = () => {
  const { toggleSidebar } = useDonorSidebar();
  
  return (
    <button
      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      onClick={toggleSidebar}
    >
      <IoReorderThree className='w-5 h-5'/>
    </button>
  );
};

const DonorHeader = ({ organizationId }) => {
  const { donor, logout } = useDonor();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      router.push(`/organization/${organizationId}/donor/login`);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex justify-between items-center px-4 bg-white border-b border-gray-200 shadow-sm" style={{ height: "60px" }}>
      <div className="flex items-center space-x-4">
        <DonorSidebarToggle />
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Donor Portal</h1>
        </div>
      </div>
      
      <div className="flex items-center relative h-full">
        {donor ? (
          <div
            className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-50 py-2 px-4 rounded-lg transition-all duration-200 mx-2"
            onClick={toggleDropdown}
          >
            <div className="flex flex-row items-center space-x-3">
              <FaUserCircle size={32} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {donor.firstName} {donor.lastName}
              </span>
            </div>
            {isDropdownOpen ? 
              <IoIosArrowUp className="text-gray-400 text-sm" /> : 
              <IoIosArrowDown className="text-gray-400 text-sm" />
            }
          </div>
        ) : (
          <div className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-50 py-2 px-4 rounded-lg transition-all duration-200 mx-2">
            <Link href={`/organization/${organizationId}/donor/login`} className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
              Login
            </Link>
          </div>
        )}
        
        {isDropdownOpen && donor && (
          <div className="absolute right-0 p-2 mt-20 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Account</h3>
              <p className="text-xs text-gray-500">{donor.firstName} {donor.lastName}</p>
            </div>
            <Link
              href={`/organization/${organizationId}/donor/profile`}
              className="flex items-center text-sm px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaUser className="mr-3 text-gray-400" /> 
              Profile
            </Link>
            <Link
              href={`/organization/${organizationId}/donor/settings`}
              className="flex items-center text-sm px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaCog className="mr-3 text-gray-400" /> 
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-sm text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 mt-1"
            >
              <FaSignOutAlt className="mr-3" /> 
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorHeader;
