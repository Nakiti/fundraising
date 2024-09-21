"use client"
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Header = () => {
   const {currentUser} = useContext(AuthContext)

   return (
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm" style={{height: "10vh"}}>
         <Link href="/" className="text-xl font-bold">Title</Link>
         {!currentUser ? 
            <Link href="/login" className="text-black font-semibold mr-4 hover:text-gray-700">Login</Link> :
            <Link href="/org/dashboard/settings" className="text-black font-semibold mr-4 hover:text-gray-700">Settings</Link>
         }
      </div>
   );
}

export default Header;
