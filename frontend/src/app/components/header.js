"use client"
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";

const Header = () => {
   const {currentUser} = useContext(AuthContext)
   console.log(currentUser)
   const [isClient, setIsClient] = useState(false);

   // Ensure this only runs on the client-side
   useEffect(() => {
     setIsClient(true);
   }, []);

   return (
      <div className="flex justify-between items-center px-4 bg-white border-b border-gray-200 shadow-sm" style={{height: "10vh"}}>
         <Link href="/" className="text-lg font-bold">Title</Link>
         {isClient && <Link href={!currentUser ? "/login" : "/org/dashboard/campaigns"} className="text-black font-semibold mr-4 hover:text-gray-700">{!currentUser ? "Login" : "Dashboard"}</Link>}
      </div>
   );
}

export default Header;
