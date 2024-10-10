import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItem = ({ icon, text, isCollapsed, link }) => {
   const pathname = usePathname()

   return (
      <Link href={link}>
         <div 
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-all duration-300 
               ${isCollapsed ? 'justify-center' : 'justify-start'} 
               ${pathname == link ? "bg-gray-100" : "bg-white"}
            `}
         >
            <div className="text-black text-lg  h-5 w-5">
               {icon} 
            </div>
            {!isCollapsed && (
               <span className="text-black ml-2 text-md font-semibold">{text}</span> 
            )}
         </div>
      </Link>
   );
}

export default SidebarItem;
