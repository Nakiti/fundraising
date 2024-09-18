"use client"

import { useState } from 'react';
import SidebarItem from './sidebarItem';
import { IoIosStats } from "react-icons/io";
import { FaDonate } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { IoReorderThree } from "react-icons/io5";





const Sidebar = () => {
   const [isCollapsed, setIsCollapsed] = useState(false);

   const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
   };

   return (
      <div 
         className={`${isCollapsed ? 'w-16' : 'w-48'} h-full bg-white border-r shadow-md border-gray-200 transition-width duration-300`}
      >
         {/* Collapse Button */}
         <button
            className=" text-black w-full py-2 px-4 focus:outline-none border-b"
            onClick={toggleSidebar}
         >
            <IoReorderThree className='w-10 h-10'/>
         </button>

         {/* Sidebar Buttons */}
         <div className={`mt-8 ${isCollapsed ? 'flex flex-col items-center' : 'flex flex-col'}`}>
            <SidebarItem icon={<IoIosStats className='h-full w-full'/>} text="Campaigns" isCollapsed={isCollapsed} link="/org/dashboard/campaigns" />
            <SidebarItem icon={<FaDonate className='h-full w-full'/>} text="Transactions" isCollapsed={isCollapsed} link="/org/dashboard/transactions"/>
         </div>

         <div className={`mt-64 pt-4 ${isCollapsed ? 'flex flex-col items-center' : 'flex flex-col'}`}>
         <SidebarItem icon={<IoIosSettings className='h-full w-full'/>} text="Settings" isCollapsed={isCollapsed} link="/org/dashboard/settings"/>
         </div>
      </div>
   );
};

export default Sidebar;
