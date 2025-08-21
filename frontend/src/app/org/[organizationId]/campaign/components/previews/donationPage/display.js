"use client";
import { useContext } from "react";
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";
import { FaShare, FaHeart, FaUsers } from "react-icons/fa";

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
            <div className="relative w-full" style={{height: Math.min(parseInt(donationPageInputs.heroHeight) || 300, 400)}}>
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
                           color: donationPageInputs.p_color || '#ffffff',
                           fontSize: Math.min(parseInt(donationPageInputs.heroTitleSize) || 28, 32) + 'px'
                        }}
                     >
                        {donationPageInputs.headline || "Support Our Cause"}
                     </h1>
                     <p 
                        className="text-slate-100 max-w-xl mx-auto leading-relaxed"
                        style={{
                           color: donationPageInputs.s_color || '#e2e8f0',
                           fontSize: Math.min(parseInt(donationPageInputs.heroSubtitleSize) || 14, 16) + 'px'
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
                              fontSize: Math.min(parseInt(donationPageInputs.buttonTextSize) || 14, 16) + 'px',
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
            <div className="flex flex-col lg:flex-row w-full px-6 space-y-8 lg:space-y-0 lg:space-x-8" style={{paddingTop: Math.min(parseInt(donationPageInputs.sectionPadding) || 40, 60), paddingBottom: Math.min(parseInt(donationPageInputs.sectionPadding) || 40, 60)}}>
               <div className="lg:w-2/3">
                  <h2 
                     className="font-bold mb-4 leading-tight"
                     style={{
                        color: donationPageInputs.p_color || '#1e293b',
                        fontSize: Math.min(parseInt(donationPageInputs.sectionTitleSize) || 24, 28) + 'px'
                     }}
                  >
                     {donationPageInputs.mainHeadline || "Making a Difference Together"}
                  </h2>
                  <p 
                     className="leading-relaxed mb-6"
                     style={{
                        color: donationPageInputs.s_color || '#64748b',
                        fontSize: Math.min(parseInt(donationPageInputs.bodyTextSize) || 14, 16) + 'px'
                     }}
                  >
                     {donationPageInputs.mainText || "Our organization works tirelessly to create positive change in the community. Through innovative programs and dedicated volunteers, we're building a better future for everyone."}
                  </p>
                  
                  {/* Progress Section */}
                  <div className="mb-6">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium" style={{ color: donationPageInputs.s_color || '#64748b' }}>$2,450 raised</span>
                        <span className="text-sm font-medium" style={{ color: donationPageInputs.s_color || '#64748b' }}>of $10,000 goal</span>
                     </div>
                     <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                        <div 
                           className="h-2 rounded-full transition-all duration-500 ease-out"
                           style={{ 
                              backgroundColor: donationPageInputs.s_color || '#475569',
                              width: '24.5%'
                           }}
                        ></div>
                     </div>
                     <div className="flex justify-start items-center space-x-4 text-sm" style={{ color: donationPageInputs.s_color || '#64748b' }}>
                        <div className="flex items-center space-x-1.5">
                           <FaUsers className="text-slate-600 w-3 h-3" />
                           <span>127 donors</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                           <FaHeart className="text-rose-500 w-3 h-3" />
                           <span>23 days left</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Sidebar */}
               <div className="lg:w-1/3">
                  <div className="bg-white border border-slate-200 p-4 shadow-sm" style={{borderRadius: donationPageInputs.cardRadius || '8px'}}>
                     <h3 
                        className="font-semibold mb-4"
                        style={{
                           color: donationPageInputs.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(donationPageInputs.sectionTitleSize) || 18, 20) + 'px'
                        }}
                     >
                        Choose Your Amount
                     </h3>
                     <div className="space-y-2 mb-4">
                        {[donationPageInputs.button1, donationPageInputs.button2, donationPageInputs.button3, donationPageInputs.button4, donationPageInputs.button5, donationPageInputs.button6].map((amount, index) => (
                           <button
                              key={index}
                              className="w-full p-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-center"
                              style={{borderRadius: donationPageInputs.buttonRadius || '6px'}}
                           >
                              <div className="font-semibold text-sm" style={{ color: donationPageInputs.p_color || '#1e293b' }}>${amount || '25'}</div>
                              <div className="text-xs mt-0.5" style={{ color: donationPageInputs.s_color || '#64748b' }}>Donation</div>
                           </button>
                        ))}
                     </div>
                     <button 
                        className="w-full py-3 px-4 font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-md transform hover:-translate-y-0.5"
                        style={{
                           backgroundColor: donationPageInputs.b1_color || '#475569',
                           borderRadius: donationPageInputs.buttonRadius || '6px',
                           fontSize: Math.min(parseInt(donationPageInputs.buttonTextSize) || 14, 16) + 'px'
                        }}
                     >
                        <FaHeart className="w-3 h-3" />
                        <span>Donate Now</span>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Display