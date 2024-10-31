"use client";
import { CgProfile } from "react-icons/cg";
import { useContext, useState } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import { IoIosClose } from "react-icons/io";

const Display = () => {
   const {previewInputs, handlePreviewInputsChange, setPreviewInputs, amountInputs} = useContext(CampaignContext)
   
   return (
      <div className="w-full mb-4 max-w-6xl mx-auto bg-white rounded-sm shadow-md mt-6 overflow-y-auto" style={{backgroundColor: previewInputs.bg_color}}>
         <div 
            className="text-lg font-bold text-start text-white px-4 py-2 bg-gray-800" 
            style={{backgroundColor: previewInputs.h_color || "#000"}}
            // onClick={(event) => handleClick("Heading", "h_color", event)}
         >
            <h1 
               className="px-2 py-1 "
               name="heading"
               style={{backgroundColor: previewInputs.h_color || "#000", color: previewInputs.ht_color}}
            >
               Header
            </h1>
         </div>

         <div className="relative w-full" >

            <img
               src={previewInputs.image}
               alt="image"
               className="w-full h-80 object-cover bg-gray-50"
            />
            <div className="absolute inset-0 flex flex-col items-center text-center space-y-6 bg-black bg-opacity-50">
               <h1 
                  className="text-4xl p-2 mb-2 font-semibold mt-8"
                  name="headline"
                  style={{color: previewInputs.p_color || "black"}}
               >
                  {previewInputs.headline || "Enter a Headline"}
               </h1>

               <div className="flex justify-center space-x-4">
                  <button disabled className="bg-blue-800 text-white py-3 px-8 text-sm rounded-sm transition">
                     Share
                  </button>
                  <button disabled className="bg-blue-800 text-white py-3 px-8  text-sm rounded-sm transition">
                     Donate
                  </button>
               </div>
            </div>
         </div>

         <div className="space-y-2 p-6 text-center">
            <h2 className="text-2xl text-gray-800">
               How Your Money Helps
            </h2>
            <p className="text-md text-gray-600 w-3/4 mx-auto">
            {previewInputs.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
            </p>
         </div>


         <div className="p-6 w-11/12 mx-auto mb-12">
            <div className="w-3/4 mx-auto">
               <p className="text-xl mb-2 text-center" style={{color: previewInputs.p_color}}>X of 1000 raised</p>

               <div className=" bg-gray-300 rounded-full h-4 mb-2">
                  <div className="bg-blue-600 h-4 rounded-full w-1/12"></div>
               </div>
            </div>
            
            {/* <div className="border-b border-blue-800 my-8"/> */}

            <div className="mt-8 flex flex-col items-center">
               <h3 className="text-lg text-gray-700 mb-4 text-center">I would like to give to:</h3>
               <select 
                  className="w-1/2 border border-gray-300 rounded-sm p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="Select"
                  disabled
               >
               </select>
            </div>


            <div className="mb-4 mt-4 flex flex-col items-center">
               <h3 className="text-lg text-gray-700 mb-4">I would like to give:</h3>
               <div className="w-1/2 grid grid-cols-3 gap-y-2 gap-x-4 max-w-sm px-4">
                  <button
                     key={0}
                     className="w-full text-xs py-2 bg-blue-700 text-white rounded-sm"
                     disabled
                     style={{backgroundColor: previewInputs.b3_color}}
                  >
                     {amountInputs.button1}
                  </button>
                  <button
                     key={1}
                     className="w-full text-xs py-1 bg-blue-700 text-white rounded-sm"
                     disabled
                     style={{backgroundColor: previewInputs.b3_color}}
                  >
                     {amountInputs.button2}
                  </button>
                  <button
                     key={2}
                     className="w-full text-xs py-1 bg-blue-700 text-white rounded-sm"
                     disabled
                     style={{backgroundColor: previewInputs.b3_color}}
                  >
                     {amountInputs.button3}
                  </button>
                  <button
                     key={3}
                     className="w-full text-xs py-1 bg-blue-700 text-white rounded-sm"
                     disabled
                     style={{backgroundColor: previewInputs.b3_color}}
                  >
                     {amountInputs.button4}
                  </button>
                  <button
                     key={4}
                     className="w-full text-xs py-2 bg-blue-700 text-white rounded-sm"
                     disabled
                     style={{backgroundColor: previewInputs.b3_color}}
                  >
                     {amountInputs.button5}
                  </button>
                  <button
                     key={5}
                     className="w-full text-xs py-1 bg-blue-700 text-white rounded-sm"
                     disabled
                     style={{backgroundColor: previewInputs.b3_color}}
                  >
                     {amountInputs.button6}
                  </button>
                  {/* <input 
                     placeholder="Enter Custom Amount" 
                     type="number" 
                     className="w-full col-start-1 text-sm rounded-md col-end-3 py-1 px-4 bg-white border border-blue-600 text-black shadow " 
                     
                     // onChange={handleAmount}
                     // value={donationInfo.amount}
                  /> */}
               </div>
            </div>


            <div className="flex flex-row justify-center items-center space-x-4 text-sm">
               <button 
                  className="w-1/6 px-4 py-2  text-white text-center rounded-sm bg-blue-700"
                  // onClick={(event) => handleClick("Donate Button", "b1_color", event)}
                  // onClick={handleDonate}
                  style={{backgroundColor: previewInputs.b1_color}}
               >
                  Donate
               </button>
            </div>
         </div>
      </div>
   );
}

export default Display