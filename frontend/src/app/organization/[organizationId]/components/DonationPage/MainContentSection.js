"use client"
import { FaHeart, FaUsers, FaChartLine } from "react-icons/fa";

export default function MainContentSection({ organization, customStyles, showFeatureIcons, showHoverEffects }) {
  return (
    <div 
      className="flex flex-col lg:flex-row w-full px-8 space-y-16 lg:space-y-0 lg:space-x-16"
      style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}
    >
      <div className="lg:w-2/3">
        <h2 
          className="font-bold mb-8 leading-tight" 
          style={{
            color: organization?.inputs?.p_color || '#1f2937',
            fontSize: customStyles.sectionTitleSize
          }}
        >
          {organization?.inputs?.mainHeadline || "Making a Difference Together"}
        </h2>
        <p 
          className="leading-relaxed mb-12 text-gray-700" 
          style={{
            color: organization?.inputs?.s_color || '#6b7280',
            fontSize: customStyles.bodyTextSize
          }}
        >
          {organization?.inputs?.mainText || "Our organization works tirelessly to create positive change in the community. Through innovative programs and dedicated volunteers, we're building a better future for everyone."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <FaHeart className="w-6 h-6" />, color: "text-gray-600", title: "Compassion", desc: "Caring for our community" },
            { icon: <FaUsers className="w-6 h-6" />, color: "text-gray-600", title: "Community", desc: "Building strong connections" },
            { icon: <FaChartLine className="w-6 h-6" />, color: "text-gray-600", title: "Impact", desc: "Measurable results" }
          ].map((feature, index) => (
            <div 
              key={index} 
              className={`text-center p-4 bg-white border border-gray-100 transition-all duration-200 ${showHoverEffects ? 'hover:border-gray-200 hover:shadow-sm' : ''}`}
              style={{borderRadius: customStyles.cardRadius}}
            >
              {showFeatureIcons && (
                <div className={`${feature.color} mx-auto mb-3`}>
                  {feature.icon}
                </div>
              )}
              <h3 
                className="font-semibold mb-2" 
                style={{
                  color: organization?.inputs?.p_color || '#1f2937',
                  fontSize: customStyles.cardTitleSize
                }}
              >
                {feature.title}
              </h3>
              <p 
                className="text-gray-500" 
                style={{
                  color: organization?.inputs?.s_color || '#6b7280',
                  fontSize: customStyles.bodyTextSize
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}





