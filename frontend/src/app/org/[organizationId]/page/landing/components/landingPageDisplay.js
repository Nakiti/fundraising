"use client";
import { CgProfile } from "react-icons/cg";
import { useContext, useState } from "react";
import { LandingPageContext } from "@/app/context/landingPageContext";

import { IoIosClose } from "react-icons/io";

const LandingPageDisplay = () => {
   const {inputs, sections} = useContext(LandingPageContext)
   const campaigns = ["Campaign One", "Campaign Two", "Campaign Three"]

   return (
      <div 
         className="bg-white max-w-6xl shadow-md overflow-y-auto"
         style={{backgroundColor: inputs.bg_color, height: "450px"}}
      >
         <div className="bg-black w-full p-3">
            <p className="text-white ml-4">Header</p>
         </div>

         <div className="relative w-full">
            <img
               className="w-full object-cover"
               style={{height: "350px"}}
               src={inputs.bgImage ? inputs.bgImage : "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"}
               alt="Organization"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 bg-black bg-opacity-50">
               <h1 className="text-3xl font-semibold text-white" style={{color: inputs.p_color}}>
                  {inputs.title || "Title"}
               </h1>
               <p className="text-sm text-gray-200 w-11/12 md:w-2/3 lg:w-1/2 mx-auto" style={{color: inputs.p_color}}>
                  {inputs.description ? inputs.description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
               </p>
            </div>
         </div>
         {sections[1].active && <div className="flex flex-row w-full px-8 mt-12 space-x-10">
            <div className="w-2/3">
               <h1 className="text-3xl font-bold text-blue-800">{inputs.mainHeadline || "Headline"}</h1>
               <p className="text-sm text-gray-700 mt-4">
                  {inputs.mainText || "Placeholder Text"}
               </p>
            </div>

            <div className="w-1/3">
               <h1 className="text-lg font-bold text-center mt-12">Featured Campaigns:</h1>
               <div className="mt-6 space-y-4">
                  <div className="flex flex-row items-center shadow-sm border border-gray-400 rounded-md"> 
                     <img 
                        src="404image" 
                        className="h-12 w-12 rounded-lg mr-4 object-cover border-2 border-dashed"
                     />
                     <p className="text-sm">Campaign Name</p>
                  </div>
                  <div className="flex flex-row items-center shadow-sm border border-gray-400 rounded-md"> 
                     <img 
                        src="404image" 
                        className="h-12 w-12 rounded-lg mr-4 object-cover border-2 border-dashed"
                     />
                     <p className="text-sm">Campaign Name</p>
                  </div>
                  <div className="flex flex-row items-center shadow-sm border border-gray-400 rounded-md"> 
                     <img 
                        src="404image" 
                        className="h-12 w-12 rounded-lg mr-4 object-cover border-2 border-dashed"
                     />
                     <p className="text-sm">Campaign Name</p>
                  </div>
               </div>
               <button className="text-sm w-full px-10 py-2 bg-blue-800 text-white rounded-md mt-8">Explore Campaigns</button>
            </div>
         </div>}
         {sections[2].active && 
            <div className="flex flex-col md:flex-row items-center space-x-12 justify-between w-full py-8 px-8 mt-8">
               <div className="md:w-1/2 space-y-4">
                  <h2 className="text-xl text-gray-800">
                     About Our Organization
                  </h2>
                  <p className="text-sm text-gray-600">
                     {inputs.aboutText || "Placeholder Text"}               
                  </p>
                  <button 
                     className="bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm px-8 rounded-sm transition">
                     Learn More
                  </button>
               </div>

               <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
                  <img
                     className="w-full h-40 object-cover rounded-sm"
                     src={inputs.aboutImage || "https://via.placeholder.com/150"}
                     alt="About Us"
                  />
               </div>
            </div>
         }
         {sections[3].active && 
            <div className="flex flex-col md:flex-row items-center space-x-12 justify-between w-full py-8 px-8 mt-8">
               <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
                  <img
                     className="w-full h-40 object-cover rounded-sm"
                     src={inputs.textImage}
                     alt="About Us"
                  />
               </div>
               <div className="md:w-1/2 space-y-4">
                  <h2 className="text-xl text-gray-800">
                     Our Impact
                  </h2>
                  <p className="text-sm text-gray-600">
                     {inputs.impactText || "Placeholder Text"}                
                  </p>
                  <button 
                     className="bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm px-8 rounded-sm transition">
                     Learn More
                  </button>
               </div>
            </div>
         }

         {sections[5].active && <div className="mx-8 grid grid-cols-3 gap-10 mt-16">
            <div className="flex flex-col">
               <img
                  className="w-full h-24 object-cover rounded-sm"
                  src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                  alt="About Us"
               />
               <h1 className="text-lg my-2 text-blue-800">Title</h1>
               <p className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing eliam, quis</p>
            </div>

            <div className="flex flex-col">
               <img
                  className="w-full h-24 object-cover rounded-sm"
                  src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                  alt="About Us"
               />
               <h1 className="text-lg my-2 text-blue-800">Title</h1>
               <p className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing eliam, quis</p>
            </div>

            <div className="flex flex-col">
               <img
                  className="w-full h-24 object-cover rounded-sm"
                  src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                  alt="About Us"
               />
               <h1 className="text-lg my-2 text-blue-800">Title</h1>
               <p className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing eliam, quis</p>
            </div>
         </div>}

         <div className="container mx-auto px-8 pt-6 pb-12">
            <div id="campaigns" className="mt-4">
               <h2 className="text-xl mb-2 text-gray-800" style={{color: inputs.p_color}}>
                  Active Campaigns:
               </h2>
               <div className="grid grid-cols-3 gap-4">
                  {campaigns.map((item, index) => {
                     return (
                        <div 
                           className=" shadow-sm rounded-sm w-full h-full" 
                           key={index}
                           style={{backgroundColor: inputs.c_color}}
                        >
                           <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
                              className="object-cover w-full rounded-t-sm"
                              style={{height: "100px"}}
                           />
                           <div className="px-2 py-2">
                              <div className="flex flex-row space-x-2 justify-between items-center">
                                 <div>
                                    <h1 className="text-sm mb-2" style={{color: inputs.ct_color}}>{item}</h1>
                                 </div>
                                 {/* <div className="flex flex-col items-end space-y-1">
                                    <button disabled className="px-2 w-16 py-1 bg-blue-600 rounded-sm text-white text-xs text-center" >
                                       Donate
                                    </button>
                                 </div> */}
                              </div>
                           </div>
                        </div>
                     )})
                  }
               </div>
            </div>
         </div>
      </div>
   );
}

export default LandingPageDisplay