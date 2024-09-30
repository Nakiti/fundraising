"use client"
import Link from "next/link";

const Header = () => {
   return (
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm" style={{height: "10vh"}}>
         <Link href="/" className="text-xl font-bold">Title</Link>         
      </div>
   );
}

export default Header;
