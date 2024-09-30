import { IoMdOpen } from "react-icons/io";


const Pages = () => {
   
   return (
      <div className="w-full h-full bg-white overflow-y-auto">
         <div className="flex flex-row p-6 w-full justify-between">
            <h1 className="text-3xl font-bold">Manage Pages</h1>
         </div>

         <div className="mt-12 grid grid-cols-3 gap-4 w-11/12 mx-auto">
            <div className="bg-gray-100 text-center w-full h-48 flex flex-col p-4 rounded-md shadow-sm relative">
               <h1>Landing Page</h1>
               <div className="flex flex-row text-sm justify-between items-center w-full px-4 py-2 border-t border-black absolute bottom-0 left-0 rounded-b-sm">
                  <h2>Page Title</h2>
                  <button className="text-black "><IoMdOpen /></button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Pages