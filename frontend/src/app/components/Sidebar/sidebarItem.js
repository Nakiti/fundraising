import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItem = ({ icon, text, isCollapsed, link }) => {
   const pathname = usePathname();
   const isActive = pathname === link;

   return (
      <Link href={link}>
         <div 
            className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ease-in-out
               ${isCollapsed ? 'justify-center mx-2 rounded-lg' : 'justify-start mx-2 rounded-lg'} 
               ${isActive 
                  ? "bg-blue-50 border-l-4 border-blue-600 text-blue-700 font-medium" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
               } 
               ${isCollapsed && isActive ? 'bg-blue-50 text-blue-700' : ''}
            `}
         >
            <div className={`${isActive ? 'text-blue-600' : 'text-gray-500'} ${!isCollapsed ? 'mr-3' : ''}`}>
               {icon}
            </div>
            {!isCollapsed && (
               <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                  {text}
               </span>
            )}
         </div>
      </Link>
   );
}

export default SidebarItem;
