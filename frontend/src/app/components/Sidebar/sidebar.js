"use client"

import { useState, useEffect } from 'react';
import SidebarItem from './sidebarItem';
import { IoIosStats } from "react-icons/io";
import { FaDonate } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { TbBrandPagekit } from "react-icons/tb";
import { FaCalendarAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { RiPagesLine } from "react-icons/ri";
import { GrTemplate } from "react-icons/gr";
import { useSidebar } from '../../context/sidebarContext';

const Sidebar = ({organizationId}) => {
   const [isClient, setIsClient] = useState(false);
   const { isCollapsed } = useSidebar();

   useEffect(() => {
      setIsClient(true);
   }, []);

   if (!isClient) {
      return null;
   }

   return (
      <div 
         className={`${isCollapsed ? 'w-16' : 'w-64'} h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
      >
         {/* Navigation Items */}
         <div className="flex-1 py-4">
            <SidebarItem icon={<FaHome className='h-5 w-5'/>} text="Home" isCollapsed={isCollapsed} link={`/org/${organizationId}/dashboard/home`} />
            <SidebarItem icon={<IoIosStats className='h-5 w-5'/>} text="Campaigns" isCollapsed={isCollapsed} link={`/org/${organizationId}/dashboard/campaigns`} />
            <SidebarItem icon={<FaCalendarAlt className='h-5 w-5'/>} text="Events" isCollapsed={isCollapsed} link={`/org/${organizationId}/dashboard/events`} />
            <SidebarItem icon={<FaDonate className='h-5 w-5'/>} text="Transactions" isCollapsed={isCollapsed} link={`/org/${organizationId}/dashboard/transactions`}/>
            <SidebarItem icon={<RiPagesLine className='h-5 w-5'/>} text="Pages" isCollapsed={isCollapsed} link={`/org/${organizationId}/dashboard/pages`}/>
            <SidebarItem icon={<GrTemplate className='h-5 w-5'/>} text="Templates" isCollapsed={isCollapsed} link={`/org/${organizationId}/dashboard/templates`}/>
         </div>

         {/* Settings Section */}
         <div className="border-t border-gray-200 bg-gray-50">
            <SidebarItem icon={<IoIosSettings className='h-5 w-5'/>} text="Settings" isCollapsed={isCollapsed} link={`/org/${organizationId}/dashboard/settings`}/>
         </div>
      </div>
   );
};

export default Sidebar;
