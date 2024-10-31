"use client"

import { useState, useEffect } from 'react';
import SidebarItem from './sidebarItem';
import { IoIosStats } from "react-icons/io";
import { FaDonate } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { IoReorderThree } from "react-icons/io5";
import { TbBrandPagekit } from "react-icons/tb";
import { FaCalendarAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { RiPagesLine } from "react-icons/ri";
import { GrTemplate } from "react-icons/gr";



const Sidebar = () => {
   const [isCollapsed, setIsCollapsed] = useState(false);
   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
      setIsClient(true); // Indicates that the component has mounted on the client
   }, []);

   const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
   };

   if (!isClient) {
      return null; // Or you can return a loading spinner if you prefer
   }

   return (
      <div 
         className={`${isCollapsed ? 'w-16' : 'w-48'} h-full bg-white border-r shadow-md border-gray-200 transition-width duration-300`}
      >
         {/* Collapse Button */}
         <button
            className=" text-black w-full py-2 px-4 focus:outline-none border-b flex items-center"
            onClick={toggleSidebar}
         >
            <IoReorderThree className='w-10 h-10'/>
         </button>

         {/* Sidebar Buttons */}
         <div className={`${isCollapsed ? 'flex flex-col ' : 'flex flex-col'}`}>
            <SidebarItem icon={<FaHome className='h-full w-full'/>} text="Home" isCollapsed={isCollapsed} link="/org/dashboard/home" />
            <SidebarItem icon={<IoIosStats className='h-full w-full'/>} text="Campaigns" isCollapsed={isCollapsed} link="/org/dashboard/campaigns" />
            {/* <SidebarItem icon={<FaCalendarAlt className='h-full w-full'/>} text="Events" isCollapsed={isCollapsed} link="/org/dashboard/events" /> */}
            <SidebarItem icon={<FaDonate className='h-full w-full'/>} text="Transactions" isCollapsed={isCollapsed} link="/org/dashboard/transactions"/>
            <SidebarItem icon={<RiPagesLine className='h-full w-full'/>} text="Pages" isCollapsed={isCollapsed} link="/org/dashboard/pages"/>
            <SidebarItem icon={<GrTemplate className='h-full w-full'/>} text="Templates" isCollapsed={isCollapsed} link="/org/dashboard/templates"/>

         </div>

         <div className={`mt-40 pt-4 ${isCollapsed ? 'flex flex-col' : 'flex flex-col'}`}>
         <SidebarItem icon={<IoIosSettings className='h-full w-full'/>} text="Settings" isCollapsed={isCollapsed} link="/org/dashboard/settings"/>
         </div>
      </div>
   );
};

export default Sidebar;
