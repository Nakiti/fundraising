"use client"
import { FaArrowRight } from "react-icons/fa";

export default function AboutSection({ organization, customStyles, showStatistics, showHeroIcons, showTrustBadge }) {
  return (
    <div 
      className="flex flex-col lg:flex-row items-center space-y-16 lg:space-y-0 lg:space-x-20 w-full px-8 bg-gray-50"
      style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}
    >
      <div className="lg:w-1/2 space-y-8">
        <div>
          <h2 
            className="font-bold mb-6 leading-tight" 
            style={{
              color: organization?.inputs?.p_color || '#1f2937',
              fontSize: customStyles.sectionTitleSize
            }}
          >
            About Our Organization
          </h2>
          <p 
            className="leading-relaxed text-gray-700" 
            style={{
              color: organization?.inputs?.s_color || '#6b7280',
              fontSize: customStyles.bodyTextSize
            }}
          >
            {organization?.inputs?.aboutText || "We are a dedicated team of professionals and volunteers committed to creating positive change in our community. Our mission is to provide support, resources, and opportunities for those who need them most."}               
          </p>
        </div>
        {showStatistics && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { number: "500+", label: "Volunteers" },
              { number: "50+", label: "Programs" },
              { number: "10K+", label: "Lives Impacted" },
              { number: "15+", label: "Years Experience" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 border border-gray-100" style={{borderRadius: customStyles.cardRadius}}>
                <div className="text-xl font-semibold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
        <button 
          className={`font-semibold transition-all duration-300 flex items-center space-x-2`}
          style={{
            backgroundColor: organization?.inputs?.b_color || customStyles.accentColor,
            color: organization?.inputs?.bt_color || '#FFFFFF',
            borderRadius: customStyles.buttonRadius,
            fontSize: customStyles.buttonTextSize,
            padding: '16px 40px'
          }}
        >
          <span>Learn More</span>
          {showHeroIcons && <FaArrowRight className="w-4 h-4" />}
        </button>
      </div>
      <div className="lg:w-1/2">
        <div className="relative">
          <img
            className="w-full h-80 object-cover"
            src={organization?.inputs?.aboutImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"}
            alt="About Us"
            style={{borderRadius: customStyles.cardRadius}}
          />
          {showTrustBadge && (
            <div className="absolute -bottom-4 -left-4 bg-white border border-gray-100 p-4" style={{borderRadius: customStyles.cardRadius}}>
              <div className="flex items-center space-x-2">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Trusted Organization</p>
                  <p className="text-xs text-gray-500">15+ years of service</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}





