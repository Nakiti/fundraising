"use client"
import useFormInput from "@/app/hooks/useFormInput"

const DonatePage = () => {



   return (
      <div className="w-full bg-gray-50">
         <div className="bg-white shadow-md rounded-md mx-8 p-6">


            <div>
               <button className="px-6 py-2 bg-gray-200 rounded-md shadow-md">Previous</button>
               <button className="px-6 py-2 bg-blue-700 rounded-md shadow-md text-white">Next</button>
            </div>
         </div>
      </div>
   )
}

export default DonatePage