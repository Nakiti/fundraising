"use client";
import { useContext } from "react";
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";
import { FaShare, FaHeart, FaUsers, FaTrophy, FaClock } from "react-icons/fa";

const Display = () => {
   const { donationPageInputs } = useContext(DonationPageContext)

   return (
      <div 
         className="bg-white w-full"
         style={{ backgroundColor: donationPageInputs.bg_color || '#fafafa' }}
      >
         {/* Header */}
         <div className="bg-slate-800 w-full px-4 py-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-slate-100 text-sm font-medium">Donation Page Preview</p>
               </div>
               <div className="flex items-center space-x-2 text-slate-400">
                  <span className="text-xs font-medium">Live Preview</span>
                  <div className="flex space-x-1">
                     <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                     <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                     <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Content Container */}
         <div>
            {/* Hero Section */}
            <div className="relative w-full" style={{height: "500px"}}>
               <img
                  className="w-full h-full object-cover"
                  src={donationPageInputs.banner_image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"}
                  alt="Campaign Banner"
               />
               <div 
                  className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 px-4"
                  style={{
                     backgroundColor: `rgba(0, 0, 0, ${donationPageInputs.overlayOpacity || "0.4"})`
                  }}
               >
                  <div className="max-w-2xl mx-auto space-y-4">
                     <h1 
                        className="font-bold text-white leading-tight"
                        style={{
                           color: donationPageInputs.bannerTitleColor || '#ffffff',
                           fontSize: (parseInt(donationPageInputs.bannerTitleSize) || 56) + 'px'
                        }}
                     >
                        {donationPageInputs.headline || "Support Our Cause"}
                     </h1>
                     <p 
                        className="text-slate-100 max-w-xl mx-auto leading-relaxed"
                        style={{
                           color: donationPageInputs.bannerSubtitleColor || '#e2e8f0',
                           fontSize: (parseInt(donationPageInputs.bannerSubtitleSize) || 20) + 'px'
                        }}
                     >
                        {donationPageInputs.description || "Your support makes a real difference in our community. Every donation, no matter the size, helps us achieve our mission and create positive change for those who need it most."}
                     </p>
                     <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <button 
                           className="font-semibold transition-all duration-300 flex items-center space-x-2 hover:shadow-md transform hover:-translate-y-0.5"
                           style={{
                              backgroundColor: donationPageInputs.b1_color || '#475569',
                              color: donationPageInputs.bt_color || '#FFFFFF',
                              borderRadius: donationPageInputs.buttonRadius || '6px',
                              fontSize: (parseInt(donationPageInputs.buttonTextSize) || 14) + 'px',
                              padding: '10px 20px'
                           }}
                        >
                           <FaHeart className="w-3 h-3" />
                           <span>Donate Now</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
               <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {/* Main Content Area */}
                  <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
                     {/* Header Section */}
                     <div>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                           <div className="flex-1">
                              <p 
                                 className="text-xs font-medium mb-1 sm:mb-2"
                                 style={{ 
                                    color: donationPageInputs.s_color || '#64748b',
                                    fontSize: '12px'
                                 }}
                              >
                                 {donationPageInputs.subtitle || "Fundraiser"}
                              </p>
                              <h2 
                                 className="text-lg sm:text-xl font-bold leading-tight"
                                 style={{ 
                                    color: donationPageInputs.p_color || '#1e293b',
                                    fontSize: '20px'
                                 }}
                              >
                                 {donationPageInputs.mainHeadline || "Making a Difference Together"}
                              </h2>
                           </div>
                           <button 
                              className="text-xs hover:opacity-80 transition-opacity flex items-center justify-center sm:justify-start space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md self-start"
                              style={{ 
                                 color: donationPageInputs.b1_color || '#475569',
                                 backgroundColor: donationPageInputs.b1_color ? `${donationPageInputs.b1_color}15` : '#f1f5f9',
                                 fontSize: '12px'
                              }}
                           >
                              <FaShare className="w-3 h-3" />
                              <span>Share</span>
                           </button>
                        </div>

                        {/* Main Content Text */}
                        <p 
                           className="leading-relaxed text-sm"
                           style={{
                              color: donationPageInputs.s_color || '#64748b',
                              fontSize: '14px'
                           }}
                        >
                           {donationPageInputs.mainText || "Our organization works tirelessly to create positive change in the community. Through innovative programs and dedicated volunteers, we're building a better future for everyone."}
                        </p>
                     </div>
                     
                     {/* Progress Section */}
                     <div className="bg-white border border-slate-100 p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                           <span 
                              className="font-semibold text-sm"
                              style={{ 
                                 color: donationPageInputs.p_color || '#1e293b',
                                 fontSize: '14px'
                              }}
                           >
                              $2,450 raised
                           </span>
                           <span 
                              className="font-medium text-xs"
                              style={{ 
                                 color: donationPageInputs.s_color || '#64748b',
                                 fontSize: '12px'
                              }}
                           >
                              of $10,000 goal
                           </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 sm:h-3 mb-3 sm:mb-4">
                           <div 
                              className="h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ 
                                 backgroundColor: donationPageInputs.b1_color || '#475569',
                                 width: '24.5%'
                              }}
                           ></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs" style={{ color: donationPageInputs.s_color || '#64748b' }}>
                           <div className="flex items-center space-x-1.5 sm:space-x-2">
                              <FaUsers className="text-slate-400 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">127 donations</span>
                           </div>
                           <div className="flex items-center space-x-1.5 sm:space-x-2">
                              <FaUsers className="text-slate-400 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">89 unique</span>
                           </div>
                           <div className="flex items-center space-x-1.5 sm:space-x-2">
                              <FaHeart className="text-rose-400 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">$27.53 avg</span>
                           </div>
                           <div className="flex items-center space-x-1.5 sm:space-x-2">
                              <FaHeart className="text-rose-400 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">23 days left</span>
                           </div>
                        </div>
                     </div>

                     {/* Donation Leaderboard Preview */}
                     <div className="bg-white border border-slate-100 p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl">
                        <h3 
                           className="font-bold text-base mb-3 sm:mb-4 lg:mb-6"
                           style={{
                              color: donationPageInputs.p_color || '#1e293b',
                              fontSize: '16px'
                           }}
                        >
                           Donation Leaderboard
                        </h3>

                        {/* Tab Navigation */}
                        <div className="flex space-x-1 mb-3 sm:mb-4 lg:mb-6 p-1 bg-slate-100 rounded-lg">
                           <button className="flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs font-medium rounded-lg bg-white text-slate-900 flex items-center justify-center space-x-1.5 sm:space-x-2">
                              <FaTrophy className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="truncate">Highest</span>
                           </button>
                           <button className="flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 flex items-center justify-center space-x-1.5 sm:space-x-2">
                              <FaClock className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="truncate">Recent</span>
                           </button>
                        </div>

                        {/* Leaderboard Content */}
                        <div className="space-y-2 sm:space-y-3">
                           {[
                              { name: "Sarah Johnson", amount: 500, isTop: true },
                              { name: "Michael Chen", amount: 250, isTop: false },
                              { name: "Emily Davis", amount: 200, isTop: false }
                           ].map((donor, index) => (
                              <div key={index} className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-slate-50 rounded-lg">
                                 <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0 flex-1">
                                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 flex-shrink-0">
                                       {donor.isTop ? (
                                          <FaTrophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                                       ) : (
                                          <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400" />
                                       )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                       <div 
                                          className="font-semibold text-sm truncate"
                                          style={{ 
                                             color: donationPageInputs.p_color || '#1e293b',
                                             fontSize: '14px'
                                          }}
                                       >
                                          {donor.name}
                                       </div>
                                    </div>
                                 </div>
                                 <div 
                                    className="font-bold text-sm ml-2 flex-shrink-0"
                                    style={{ 
                                       color: donationPageInputs.p_color || '#1e293b',
                                       fontSize: '14px'
                                    }}
                                 >
                                    ${donor.amount.toFixed(2)}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                     <div className="bg-white border border-slate-100 p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:sticky lg:top-6">
                        <h3 
                           className="font-bold text-base mb-3 sm:mb-4 lg:mb-6"
                           style={{
                              color: donationPageInputs.p_color || '#1e293b',
                              fontSize: '16px'
                           }}
                        >
                           Choose Your Amount
                        </h3>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                           {["xx", "xx", "xx", "xx", "xx", "xx"].map((amount, index) => (
                              <button
                                 key={index}
                                 className="p-2 sm:p-3 lg:p-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-center rounded-lg"
                                 style={{borderRadius: donationPageInputs.buttonRadius || '8px'}}
                              >
                                 <div 
                                    className="font-bold text-sm"
                                    style={{ 
                                       color: donationPageInputs.p_color || '#1e293b',
                                       fontSize: '14px'
                                    }}
                                 >
                                    ${amount}
                                 </div>
                                 <div 
                                    className="text-xs mt-0.5 sm:mt-1"
                                    style={{ color: donationPageInputs.s_color || '#64748b' }}
                                 >
                                    Donation
                                 </div>
                              </button>
                           ))}
                        </div>
                        <button 
                           className="w-full py-2 sm:py-3 lg:py-3 px-4 sm:px-6 font-bold text-white transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 hover:opacity-90 text-sm"
                           style={{
                              backgroundColor: donationPageInputs.b1_color || '#475569',
                              borderRadius: donationPageInputs.buttonRadius || '12px',
                              fontSize: '14px'
                           }}
                        >
                           <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />
                           <span>Donate Now</span>
                        </button>
                        <button 
                           className="mt-4 w-full py-2 sm:py-3 lg:py-3 px-4 sm:px-6 font-bold text-white transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 hover:opacity-90 text-sm"
                           style={{
                              backgroundColor: "gray",
                              borderRadius: donationPageInputs.buttonRadius || '12px',
                              fontSize: '14px'
                           }}
                        >
                           <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />
                           <span>Add to Cart</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Display