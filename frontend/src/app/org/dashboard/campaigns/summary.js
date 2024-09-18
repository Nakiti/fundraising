"use client"
import axios from "axios"
import { useEffect } from "react"

const Summary = () => {


   useEffect(() => {
      const fetchData = async() => {
         const response = axios.get("http://localhost:4000/api/campaign/")
      }

   }, [])

   return (
      <div className="flex justify-between items-center gap-4 p-6">
         <div className="flex justify-center items-center w-1/5 h-24 bg-gray-200">
         Box 1
         </div>
         <div className="flex justify-center items-center w-1/5 h-24 bg-gray-200">
         Box 2
         </div>
         <div className="flex justify-center items-center w-1/5 h-24 bg-gray-200">
         Box 3
         </div>
         <div className="flex justify-center items-center w-1/5 h-24 bg-gray-200">
         Box 4
         </div>
         <div className="flex justify-center items-center w-1/5 h-24 bg-gray-200">
            Box 5
         </div>
      </div>
   )
}

export default Summary