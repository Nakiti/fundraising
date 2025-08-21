import Link from "next/link";
import { usePathname } from "next/navigation";

const DonorSidebarItem = ({ icon, text, isCollapsed, link }) => {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <Link href={link}>
            <div 
                className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ease-in-out
                    ${isCollapsed ? 'justify-center mx-2 rounded-lg' : 'justify-start mx-2 rounded-lg'} 
                    ${isActive 
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 text-blue-700 font-medium shadow-sm" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-l-4 hover:border-gray-300"
                    } 
                    ${isCollapsed && isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm' : ''}
                `}
            >
                <div className={`${isActive ? 'text-blue-600' : 'text-gray-500'} ${!isCollapsed ? 'mr-3' : ''} transition-colors duration-200`}>
                    {icon}
                </div>
                {!isCollapsed && (
                    <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'} transition-colors duration-200`}>
                        {text}
                    </span>
                )}
            </div>
        </Link>
    );
}

export default DonorSidebarItem;
