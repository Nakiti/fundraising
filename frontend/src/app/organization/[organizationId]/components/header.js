"use client"
import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";


const Header = ({organizationId}) => {
   return (
      <div className="flex justify-between items-center py-4 px-8 bg-white border-b border-gray-200 shadow-sm" style={{height: "10vh"}}>
         <Link href={`/organization/${organizationId}`} className="text-xl font-bold">Title</Link>    
         <div className="flex flex-row space-x-12 text-md">
            <p>About Us</p>
            <p>Our Impact</p>
            <p>Contact Us</p>
         </div>     
         {/* <Link href={`/organization/${organizationId}/cart`} className="text-xl font-bold"><FaCartShopping /></Link> */}
      </div>
   );
}

export default Header;
