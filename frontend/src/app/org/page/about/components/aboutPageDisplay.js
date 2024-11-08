"use client"
import { useContext } from "react"
import { AboutPageContext } from "@/app/context/aboutPageContext"

const AboutPageDisplay = () => {
   const {inputs} = useContext(AboutPageContext)

   return (
      <div className="bg-white max-w-6xl shadow-md overflow-y-auto">
         <div className="bg-black w-full p-3">
            <p className="text-white ml-4">Header</p>
         </div>


         <div className="relative w-full">
            <img
               className="w-full object-cover h-60"
               src={inputs.bgImage ? inputs.bgImage : "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"}
               alt="Organization"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 bg-black bg-opacity-50">
               <h1 className="text-4xl font-semibold text-white" style={{color: inputs.p_color}}>
                  {inputs.headline || "About Us"}
               </h1>
            </div>
         </div>

         <div className="flex flex-col w-5/6 mx-auto text-center mt-8">
            <h1 className="text-2xl font-semibold">What we do</h1>
            <p className="text-gray-700 mt-2">{inputs.whatText || "What what"}</p>
         </div>

         <div className="flex flex-col w-5/6 mx-auto text-center mt-8">
            <h1 className="text-2xl font-semibold">Why we do</h1>
            <p className="text-gray-700 mt-2">{inputs.whyText || "why why"}</p>
         </div>

         <div className="flex flex-col w-5/6 mx-auto text-center mt-8">
            <h1 className="text-2xl font-semibold">Our Team</h1>
            {/* <p className="text-gray-700 mt-2">blah blah</p> */}
         </div>
      </div>
   )
}

export default AboutPageDisplay