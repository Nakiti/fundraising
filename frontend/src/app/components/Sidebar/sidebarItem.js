import Link from "next/link";

const SidebarItem = ({ icon, text, isCollapsed, link }) => {
   return (

      <Link href={link}>
         <div 
            className={`flex items-center p-4  cursor-pointer hover:bg-gray-100 ${isCollapsed ? 'justify-center' : 'justify-start'} transition-all duration-300`}
         >
            <div className="text-black text-xl  h-6 w-6">
               {icon} 
            </div>
            {!isCollapsed && (
               <span className="text-black ml-2 text-lg font-semibold">{text}</span> 
            )}
         </div>
      </Link>
   );
}

export default SidebarItem;
