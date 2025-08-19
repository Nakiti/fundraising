"use client";
import { useContext, useState } from "react";
import { PeerLandingPageContext } from "@/app/context/campaignPages/peerLandingPageContext";
import { FaShare, FaHeart, FaUsers, FaHandHoldingHeart, FaArrowRight } from "react-icons/fa";

const Display = () => {
   const { peerLandingPageInputs, handlePeerLandingPageInputsChange } = useContext(PeerLandingPageContext);
   
   return (
      <div 
         className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
         style={{ 
            backgroundColor: peerLandingPageInputs.bg_color || '#f8fafc',
            color: peerLandingPageInputs.p_color || '#1f2937'
         }}
      >
         {/* Hero Section */}
         <div className="relative">
            {/* Background Image */}
            <div className="w-full h-screen bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
               {peerLandingPageInputs.banner_image ? (
                  <img
                     src={peerLandingPageInputs.banner_image}
                     alt="Peer Fundraising Banner"
                     className="w-full h-full object-cover opacity-90"
                  />
               ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                     <FaUsers className="text-white text-8xl opacity-50" />
                  </div>
               )}
               
               {/* Overlay */}
               <div className="absolute inset-0 bg-black/30"></div>
               
               {/* Header */}
               <div className="absolute top-0 left-0 right-0 p-6">
                  <div className="flex justify-between items-center">
                     <h1 className="text-white text-xl font-semibold">Peer Fundraising</h1>
                     <button className="text-white hover:text-purple-200 transition-colors duration-200">
                        <FaShare className="text-lg" />
                     </button>
                  </div>
               </div>

               {/* Hero Content */}
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <h1 
                     className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
                     style={{ color: peerLandingPageInputs.p_color || '#ffffff' }}
                  >
                     {peerLandingPageInputs.headline || "Start Your Fundraising Journey"}
                  </h1>
                  
                  <p 
                     className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl leading-relaxed"
                     style={{ color: peerLandingPageInputs.s_color || '#e5e7eb' }}
                  >
                     {peerLandingPageInputs.tagline || "Join thousands of fundraisers making a difference in their communities"}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6">
                     <button 
                        className="inline-flex items-center px-8 py-4 text-lg font-semibold text-purple-600 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                     >
                        <FaHandHoldingHeart className="mr-3" />
                        Start Fundraising
                        <FaArrowRight className="ml-3" />
                     </button>
                     <button 
                        className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-200"
                     >
                        <FaHeart className="mr-3" />
                        Support Others
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Content Section */}
         <div className="max-w-6xl mx-auto px-6 py-16">
            {/* Description Section */}
            <div className="text-center mb-16">
               <h2 
                  className="text-4xl font-bold mb-8"
                  style={{ color: peerLandingPageInputs.p_color || '#1f2937' }}
               >
                  About This Campaign
               </h2>
               <p 
                  className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
                  style={{ color: peerLandingPageInputs.s_color || '#6b7280' }}
               >
                  {peerLandingPageInputs.description || "Join our community of passionate fundraisers who are making a real difference. Whether you want to start your own fundraising campaign or support others, you're in the right place. Every contribution helps create positive change in our community."}
               </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
               <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <FaHandHoldingHeart className="text-purple-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Start Fundraising</h3>
                  <p className="text-gray-600">Create your own fundraising campaign and inspire others to support your cause.</p>
               </div>
               
               <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <FaUsers className="text-pink-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Join the Community</h3>
                  <p className="text-gray-600">Connect with other fundraisers and supporters who share your passion.</p>
               </div>
               
               <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <FaHeart className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Make an Impact</h3>
                  <p className="text-gray-600">See the real difference your fundraising efforts make in the community.</p>
               </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white text-center mb-16">
               <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
               <div className="grid md:grid-cols-4 gap-8">
                  <div>
                     <div className="text-4xl font-bold mb-2">$2.5M+</div>
                     <div className="text-purple-200">Total Raised</div>
                  </div>
                  <div>
                     <div className="text-4xl font-bold mb-2">15K+</div>
                     <div className="text-purple-200">Fundraisers</div>
                  </div>
                  <div>
                     <div className="text-4xl font-bold mb-2">50K+</div>
                     <div className="text-purple-200">Donors</div>
                  </div>
                  <div>
                     <div className="text-4xl font-bold mb-2">500+</div>
                     <div className="text-purple-200">Causes</div>
                  </div>
               </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
               <h2 
                  className="text-3xl font-bold mb-6"
                  style={{ color: peerLandingPageInputs.p_color || '#1f2937' }}
               >
                  Ready to Make a Difference?
               </h2>
               <p 
                  className="text-xl text-gray-600 mb-8"
                  style={{ color: peerLandingPageInputs.s_color || '#6b7280' }}
               >
                  Join thousands of fundraisers who are already making an impact
               </p>
               <button 
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  style={{ backgroundColor: peerLandingPageInputs.b1_color || '#8b5cf6' }}
               >
                  <FaHandHoldingHeart className="mr-3" />
                  Get Started Today
                  <FaArrowRight className="ml-3" />
               </button>
            </div>
         </div>

         {/* Footer */}
         <div className="bg-gray-900 text-white py-12">
            <div className="max-w-6xl mx-auto px-6 text-center">
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