"use client";
import { useContext } from "react";
import { PeerFundraisingPageContext } from "@/app/context/campaignPages/peerFundraisingPageContext";
import { FaShare, FaHeart, FaUsers, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const Display = () => {
   const { peerFundraisingPageInputs } = useContext(PeerFundraisingPageContext);
   
   return (
      <div 
         className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
         style={{ 
            backgroundColor: peerFundraisingPageInputs.bg_color || '#f8fafc',
            color: peerFundraisingPageInputs.p_color || '#1f2937'
         }}
      >
         {/* Hero Section */}
         <div className="relative">
            {/* Background Image */}
            <div className="w-full h-96 bg-gradient-to-r from-green-600 to-blue-600 relative overflow-hidden">
               {peerFundraisingPageInputs.banner_image ? (
                  <img
                     src={peerFundraisingPageInputs.banner_image}
                     alt="Peer Fundraising Banner"
                     className="w-full h-full object-cover opacity-90"
                  />
               ) : (
                  <div className="w-full h-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center">
                     <FaUsers className="text-white text-6xl opacity-50" />
                  </div>
               )}
               
               {/* Overlay */}
               <div className="absolute inset-0 bg-black/20"></div>
               
               {/* Header */}
               <div className="absolute top-0 left-0 right-0 p-6">
                  <div className="flex justify-between items-center">
                     <h1 className="text-white text-xl font-semibold">Peer Fundraising</h1>
                     <button className="text-white hover:text-green-200 transition-colors duration-200">
                        <FaShare className="text-lg" />
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Content Section */}
         <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
               {/* Profile Section */}
               <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                     <img 
                        src={peerFundraisingPageInputs.person_image || "https://via.placeholder.com/200x200"}
                        className="h-32 w-32 md:h-40 md:w-40 object-cover border-4 border-white shadow-lg rounded-full"
                        alt="Fundraiser"
                     />
                  </div>
                  
                  {/* Profile Info */}
                  <div className="flex-1">
                     <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                        <div>
                           <p 
                              className="text-green-600 text-sm font-medium mb-2 uppercase tracking-wide"
                              style={{ color: peerFundraisingPageInputs.s_color || '#059669' }}
                           >
                              Peer Fundraiser
                           </p>
                           <h1 
                              className="text-3xl font-bold mb-2"
                              style={{ color: peerFundraisingPageInputs.p_color || '#1f2937' }}
                           >
                              {peerFundraisingPageInputs.headline || "Support My Fundraising Goal"}
                           </h1>
                           <p className="text-gray-600 text-sm">Created by John Doe</p>
                        </div>
                        <button className="text-green-600 hover:text-green-700 transition-colors duration-200">
                           <FaShare className="text-lg" />
                        </button>
                     </div>
                     
                     {/* Progress Section */}
                     <div className="max-w-md">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-sm font-medium text-gray-600">$1,250 raised</span>
                           <span className="text-sm font-medium text-gray-600">of $5,000 goal</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                           <div 
                              className="h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ 
                                 backgroundColor: peerFundraisingPageInputs.s_color || '#059669',
                                 width: '25%'
                              }}
                           ></div>
                        </div>
                        <div className="flex justify-start items-center space-x-6 text-sm text-gray-600">
                           <div className="flex items-center space-x-2">
                              <FaUsers className="text-green-600" />
                              <span>45 donors</span>
                           </div>
                           <div className="flex items-center space-x-2">
                              <FaCalendarAlt className="text-green-600" />
                              <span>15 days left</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Description */}
               <div className="prose prose-lg mx-auto mb-8">
                  <h2 
                     className="text-2xl font-bold mb-4 text-center"
                     style={{ color: peerFundraisingPageInputs.p_color || '#1f2937' }}
                  >
                     About This Fundraiser
                  </h2>
                  <p 
                     className="text-gray-600 leading-relaxed text-center"
                     style={{ color: peerFundraisingPageInputs.s_color || '#6b7280' }}
                  >
                     {peerFundraisingPageInputs.description || "I'm raising funds to support a cause that's close to my heart. Your generous donations will help make a real difference in our community. Every contribution, no matter how small, brings us closer to our goal and creates positive change for those who need it most."}
                  </p>
               </div>

               {/* Donation Button */}
               <div className="text-center">
                  <button 
                     className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                     style={{ backgroundColor: peerFundraisingPageInputs.b1_color || '#059669' }}
                  >
                     <FaHeart className="mr-3" />
                     Support This Fundraiser
                  </button>
               </div>
            </div>

            {/* Donation Amounts Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
               <h2 className="text-2xl font-bold text-center mb-6">Choose Your Amount</h2>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[peerFundraisingPageInputs.button1, peerFundraisingPageInputs.button2, peerFundraisingPageInputs.button3, peerFundraisingPageInputs.button4, peerFundraisingPageInputs.button5, peerFundraisingPageInputs.button6].map((amount, index) => (
                     <button
                        key={index}
                        className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-center"
                     >
                        <div className="text-2xl font-bold text-gray-800">${amount || '25'}</div>
                        <div className="text-sm text-gray-600 mt-1">Donation</div>
                     </button>
                  ))}
               </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
               <h2 className="text-2xl font-bold text-center mb-6">Recent Supporters</h2>
               <div className="space-y-4">
                  {[
                     { name: "Sarah M.", amount: "$100", time: "2 hours ago" },
                     { name: "Mike R.", amount: "$50", time: "4 hours ago" },
                     { name: "Lisa K.", amount: "$75", time: "1 day ago" },
                     { name: "David P.", amount: "$25", time: "2 days ago" }
                  ].map((donor, index) => (
                     <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <FaHeart className="text-green-600 text-sm" />
                           </div>
                           <div>
                              <p className="font-medium text-gray-800">{donor.name}</p>
                              <p className="text-sm text-gray-500">{donor.time}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-green-600">{donor.amount}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Footer */}
         <div className="bg-gray-900 text-white py-12 mt-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
               <p className="text-gray-400 text-sm">
                  &copy; {new Date().getFullYear()} Your Organization. All rights reserved.
               </p>
               <div className="mt-2 space-x-4 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
                  <span className="text-gray-600">|</span>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Display

//TODO
/*
   design generic donation form that will be available for all campaigns
   create necessary pages on intialization of peer 2 peer
   add update/fetch/create services

*/