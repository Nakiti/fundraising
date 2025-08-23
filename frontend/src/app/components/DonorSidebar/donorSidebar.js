"use client";

import DonorSidebarItem from './donorSidebarItem';
import { FaHome, FaCreditCard, FaCalendarAlt, FaCog } from "react-icons/fa";
import { useDonorSidebar } from '../../context/donorSidebarContext';

const DonorSidebar = ({ organizationId }) => {
    const { isCollapsed } = useDonorSidebar();

    return (
        <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out flex flex-col min-h-0`}>
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