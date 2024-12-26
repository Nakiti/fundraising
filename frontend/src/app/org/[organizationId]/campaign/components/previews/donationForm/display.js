"use client";
import { useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext";

const Display = () => {
   const {donationFormInputs, customQuestions} = useContext(DonationFormContext)
   
   return (
      <div 
         className="w-full mb-4 max-w-6xl mx-auto bg-gray-700 rounded-sm shadow-md mt-6 overflow-y-auto" 
         style={{ backgroundColor: donationFormInputs.bg_color }}
      >
         <div 
            className="w-full text-lg font-bold bg-white text-start text-gray-600 px-4 py-2 border-b border-gray-200"
         >
            <h1 className="px-2 py-1" name="heading">Header</h1>
         </div>
         <div className="px-6 py-4">
            <div className="bg-white p-6 rounded-sm">
               <div className="text-gray-700">
                  <h1 className="text-2xl font-semibold mb-4" style={{color: donationFormInputs.p_color}}>{donationFormInputs.headline || "This is the Heading"}</h1>
                  <pre className="text-sm leading-relaxed whitespace-pre-line" style={{color: donationFormInputs.s_color}}>{donationFormInputs.description || "This is the description"}</pre>
               </div>
               <div className="w-full border-gray-200 border my-6" />
               <div>
                  <h1 className="text-lg font-semibold mb-4" style={{color: donationFormInputs.p_color}}>Giving Information</h1>
                  <div className="mt-2">
                     <h3 className="text-xs text-gray-700 font-semibold mb-2" style={{color: donationFormInputs.s_color}}>I would like to give:</h3>
                     <div className="grid grid-cols-6 gap-2 w-full">
                        {[donationFormInputs.button1, donationFormInputs.button2, donationFormInputs.button3, donationFormInputs.button4, donationFormInputs.button5].map(item => {
                           return <div className="px-4 py-2 text-center text-xs bg-gray-200 text-gray-700 rounded-md">${item}</div>
                        })}
                        <input className="px-4 py-2 text-center text-xs bg-gray-200 text-gray-700 rounded-md" placeholder="Custom: "/>
                        </div>
                     </div>
                  <div className="mt-4">
                     <h3 className="text-xs text-gray-700 font-semibold mb-1" style={{color: donationFormInputs.s_color}}>I would like to give to:</h3>
                     <select 
                        className="w-3/4 border border-gray-300 rounded-sm p-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        defaultValue="Select"
                        disabled
                     >
                     </select>
                  </div>
               </div>
               <div className="w-full border-gray-200 border my-6" />
               <div>
                  <h1 className="text-lg font-semibold mb-4" style={{color: donationFormInputs.p_color}}>Your Information</h1>
                  <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="First Name" disabled></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="Last Name" disabled></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-4" placeholder="Email Address" disabled></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-4" placeholder="Street Address" disabled></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="Zip Code" disabled></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="City" disabled></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="Phone Number" disabled></input>
                  </div>
               </div>
               <div className="w-full border-gray-200 border my-6" />
               <div>
                  <h1 className="text-lg font-semibold mb-4" style={{color: donationFormInputs.p_color}}>Campaign Questions</h1>
                  <p className="text-sm text-gray-700 text-center">Any Custom Questions Will Appear Here</p>
               </div>      
               <div className="w-full border-gray-200 border my-6" />
               <div className="text-center flex flex-col mb-6">
                  <p className="text-md" style={{color: donationFormInputs.p_color}}> Amount</p>
                  <p className="text-xs" style={{color: donationFormInputs.p_color}}>Fund Name</p>
               </div>
               <div className="flex flex-col w-1/3 mx-auto space-y-2">
                  <button className="px-4 py-2 text-xs bg-yellow-400">Pay Pal</button>
                  <button style={{backgroundColor: donationFormInputs.b1_color}} className="px-4 py-2 text-xs bg-blue-700 text-white">Credit Card</button>
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
   );
}

export default Display
