"use client"
import { FaArrowRight } from "react-icons/fa";

export default function HeroBanner({ organization, landingPage, customStyles, showHeroIcons, showHoverEffects }) {
  return (
    <div className="relative w-full" style={{height: customStyles.heroHeight}}>
      <img
        className="w-full h-full object-cover"
        src={landingPage.bgImageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"}
        alt="Organization"
      />
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 px-6"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${customStyles.overlayOpacity})`
        }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 
            className="font-bold text-white leading-tight" 
            style={{
              color: organization?.inputs?.p_color || '#ffffff',
              fontSize: customStyles.heroTitleSize
            }}
          >
            {organization?.inputs?.title || "Welcome to Our Organization"}
          </h1>
          <p 
            className="text-gray-100 max-w-3xl mx-auto leading-relaxed" 
            style={{
              color: organization?.inputs?.p_color || '#ffffff',
              fontSize: customStyles.heroSubtitleSize
            }}
          >
            {organization?.inputs?.description || "We're dedicated to making a positive impact in our community through innovative programs and dedicated service."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => {
                const campaignsRef = document.getElementById('campaigns-section');
                if (campaignsRef) {
                  campaignsRef.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`font-semibold transition-all duration-300 flex items-center space-x-2 ${showHoverEffects ? 'hover:scale-105' : ''}`}
              style={{
                backgroundColor: organization?.inputs?.b_color || customStyles.accentColor,
                color: organization?.inputs?.bt_color || '#FFFFFF',
                borderRadius: customStyles.buttonRadius,
                fontSize: customStyles.buttonTextSize,
                padding: '16px 40px'
              }}
            >
              <span>Get Started</span>
              {showHeroIcons && <FaArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}





