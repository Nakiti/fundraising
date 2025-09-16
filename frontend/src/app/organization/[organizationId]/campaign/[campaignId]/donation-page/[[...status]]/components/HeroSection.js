"use client"
import Link from "next/link"
import { FaHeart } from "react-icons/fa"

export default function HeroSection({ display, donateUrl }) {
   return (
      <div className="relative w-full" style={{height: 600}}>
         <img
            src={display.bannerImageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"}
            alt="Campaign Banner"
            className="w-full h-full object-cover"
         />
         <div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 px-4"
            style={{
               backgroundColor: `rgba(0, 0, 0, ${display.overlayOpacity || 0.4})`
            }}
         >
            <div className="max-w-2xl mx-auto space-y-4">
               <h1 
                  className="font-bold text-white leading-tight"
                  style={{
                     color: display.bannerTitleColor || '#ffffff',
                     fontSize: Math.min(parseInt(display.bannerTitleSize) || 56, 80) + 'px'
                  }}
               >
                  {display.headline || "Support Our Cause"}
               </h1>
               <p 
                  className="text-slate-100 max-w-xl mx-auto leading-relaxed"
                  style={{
                     color: display.bannerSubtitleColor || '#e2e8f0',
                     fontSize: Math.min(parseInt(display.bannerSubtitleSize) || 20, 28) + 'px'
                  }}
               >
                  {display.description || "Your support makes a real difference in our community. Every donation, no matter the size, helps us achieve our mission and create positive change for those who need it most."}
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <Link 
                     href={donateUrl}
                     className="font-semibold transition-all duration-300 flex items-center space-x-2 hover:shadow-md transform hover:-translate-y-0.5"
                     style={{
                        backgroundColor: display.b1_color || '#475569',
                        color: display.bt_color || '#FFFFFF',
                        borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                        fontSize: Math.min(parseInt(display.buttonTextSize) || 14, 16) + 'px',
                        padding: '10px 20px'
                     }}
                  >
                     <FaHeart className="w-3 h-3" />
                     <span>{display.donate_button_text || "Donate Now"}</span>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}




