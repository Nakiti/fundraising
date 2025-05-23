import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import { useContext, useEffect } from "react"

const Display = () => {
   const {thankPageInputs} = useContext(ThankYouPageContext)

   useEffect(() => {

      console.log("image", thankPageInputs.bg_image)
   }, [thankPageInputs])

   return (
      <div 
         className="min-h-screen bg-cover bg-center border" 
         style={{ backgroundImage: `url('${thankPageInputs.bg_image}')`}}
      >
         <div className="bg-white py-4 px-8 w-full opacity-90">
            <h1>Header</h1>
         </div>


         <div className="w-5/6 mx-auto py-8">
            <div className="bg-white shadow-md rounded-sm">
               <div className="pt-10 px-10 pb-6">
                  <h1 className="text-2xl font-semibold text-gray-800">{thankPageInputs.headline || "Thank You"} </h1>

                  <pre className="mt-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                     {thankPageInputs.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore"}
                  </pre>

                  <div className="flex flex-row text-xs mt-6 text-gray-600 space-x-4">
                     <p>Share</p>
                  </div>
               </div>

               <div className="bg-gray-100 px-10 py-6">
                  <h1 className="text-lg text-gray-800 border-b border-gray-400 py-2">Donation Information</h1>

                  <div className="mt-2 w-1/2 text-md">
                     <div className="flex flex-row justify-between text-gray-700 py-2">
                        <p>Fund Name</p>
                        <p>0</p>
                     </div>
                     <div className="flex flex-row justify-between text-gray-700 py-2">
                        <p>Fund Name</p>
                        <p>0</p>
                     </div>
                     <div className="flex flex-row justify-between text-gray-700 py-2">
                        <p>Fund Name</p>
                        <p>0</p>
                     </div>
                     <div className="flex flex-row justify-between text-gray-700 py-2">
                        <p>Fund Name</p>
                        <p>0</p>
                     </div>

                  </div>

                  <div className="w-2/3 border-t border-gray-300 mt-4">
                     <div className="flex flex-row text-xl justify-between text-gray-700 py-2">
                        <p className="text-xl">Total</p>
                        <p>$ 0</p>
                     </div>
                  </div>

               </div>

               <div className="px-10 py-10">
                  <h1 className="text-lg ">Questions/Comments?</h1>
                  <p className="text-sm text-gray-700 mt-4">Email us at ... </p>
               </div>
            </div>

         </div>
         <div className="bg-gray-100 border-t border-gray-300 py-4 mt-12">
            <div className="text-center text-gray-600 text-xs">
               <p>&copy; {new Date().getFullYear()} Your Organization. All rights reserved.</p>
               <p className="mt-1">
                  <a href="#" className="hover:underline">Privacy Policy</a> | 
                  <a href="#" className="hover:underline ml-2">Terms of Service</a>
               </p>
            </div>
         </div>
      </div>
   )
}

export default Display