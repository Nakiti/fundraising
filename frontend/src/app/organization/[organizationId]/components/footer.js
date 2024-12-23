

const Footer = () => {

   return (
      <div className="bg-gray-100 border-t border-gray-300 py-4">
         <div className="text-center text-gray-600 text-xs">
            <p>&copy; {new Date().getFullYear()} Your Organization. All rights reserved.</p>
            <p className="mt-1">
            <a href="#" className="hover:underline">Privacy Policy</a> |
            <a href="#" className="hover:underline ml-2">Terms of Service</a>
            </p>
         </div>
      </div>
   )
}

export default Footer