import { IoMdOpen } from "react-icons/io";


const Pages = () => {
   return (
      <div className="w-full h-full bg-white overflow-y-auto">
         <div className="flex flex-row p-6 w-full justify-between">
            <h1 className="text-3xl font-bold">Manage Pages</h1>
         </div>

         <div className="mt-8 grid grid-cols-3 gap-4 w-11/12 mx-auto">
            <div className="rounded-md shadow-sm relative border border-gray-400">
               <div className="px-4 py-1 bg-blue-600 border-b border-gray-300">
                  <p>Title</p>
               </div>
               <div className="bg-white text-center w-full h-48 flex flex-col px-6 py-2 ">

                  <h1 className="text-lg font-semibold text-gray-800">My Organization Name</h1>
                  <p className="text-xs mt-2 text-gray-600 truncate">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <div className="grid grid-cols-4 gap-2 my-2">
                     <img className="w-full h-16 object-cover rounded-md" src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg" alt="Image 1" />
                     <img className="w-full h-16 object-cover rounded-md" src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg" alt="Image 2" />
                     <img className="w-full h-16 object-cover rounded-md" src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg" alt="Image 1" />
                     <img className="w-full h-16 object-cover rounded-md" src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg" alt="Image 2" />
                  </div>
                  <div className="flex flex-row text-sm bg-gray-100 justify-between items-center w-full px-4 py-2 border-t border-gray-400 absolute bottom-0 left-0 rounded-b-sm">
                     <h2 className="font-bold">Landing Page</h2>
                     <button className="text-black font-semibold "><IoMdOpen className="text-blue-700"/></button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Pages