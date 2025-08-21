"use client";

import { useState, useEffect } from 'react';
import DonorSidebarItem from './donorSidebarItem';
import { FaHome, FaCreditCard, FaCalendarAlt, FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useDonor } from '../../context/donorContext';
import { useRouter } from 'next/navigation';

const DonorSidebar = ({ organizationId }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { donor, logout } = useDonor();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push(`/organization/${organizationId}/donor/login`);
    };

    return (
        <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 py-4">
                <DonorSidebarItem 
                    icon={<FaHome className='h-5 w-5'/>} 
                    text="Dashboard" 
                    isCollapsed={isCollapsed} 
                    link={`/organization/${organizationId}/donor/dashboard`} 
                />
                <DonorSidebarItem 
                    icon={<FaCreditCard className='h-5 w-5'/>} 
                    text="Transactions" 
                    isCollapsed={isCollapsed} 
                    link={`/organization/${organizationId}/donor/transactions`} 
                />
                <DonorSidebarItem 
                    icon={<FaCalendarAlt className='h-5 w-5'/>} 
                    text="Events" 
                    isCollapsed={isCollapsed} 
                    link={`/organization/${organizationId}/donor/events`} 
                />
                <DonorSidebarItem 
                    icon={<FaCog className='h-5 w-5'/>} 
                    text="Settings" 
                    isCollapsed={isCollapsed} 
                    link={`/organization/${organizationId}/donor/settings`} 
                />
            </div>
        </div>
    );
};

export default DonorSidebar;
