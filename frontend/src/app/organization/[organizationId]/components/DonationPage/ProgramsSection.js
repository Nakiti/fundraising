"use client"
import { FaUsers, FaHeart, FaChartLine, FaArrowRight } from "react-icons/fa";

export default function ProgramsSection({ organization, customStyles, showFeatureIcons, showHoverEffects, showHeroIcons }) {
  const items = [
    {
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Community Programs",
      description: "Supporting local initiatives that make a real difference in people's lives.",
      icon: <FaUsers className="w-5 h-5" />
    },
    {
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      title: "Volunteer Network",
      description: "Connecting dedicated volunteers with meaningful opportunities to serve.",
      icon: <FaHeart className="w-5 h-5" />
    },
    {
      image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Education & Training",
      description: "Providing resources and training to empower individuals and communities.",
      icon: <FaChartLine className="w-5 h-5" />
    }
  ];

  return (
    <div 
      className="px-8 bg-gray-50"
      style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}
    >
      <div className="text-center mb-16">
        <h2 
          className="font-bold mb-6" 
          style={{
            color: organization?.inputs?.p_color || '#1f2937',
            fontSize: customStyles.sectionTitleSize
          }}
        >
          Our Programs
        </h2>
        <p 
          className="text-gray-600 max-w-3xl mx-auto" 
          style={{
            color: organization?.inputs?.s_color || '#6b7280',
            fontSize: customStyles.bodyTextSize
          }}
        >
          Discover the various programs and initiatives that make our organization unique
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`bg-white border border-gray-100 overflow-hidden transition-all duration-200 ${showHoverEffects ? 'hover:border-gray-200 hover:shadow-sm' : ''}`}
            style={{borderRadius: customStyles.cardRadius}}
          >
            <div className="relative">
              <img
                className="w-full h-48 object-cover"
                src={item.image}
                alt={item.title}
              />
              {showFeatureIcons && (
                <div className="absolute top-3 right-3 bg-white border border-gray-100 p-2" style={{borderRadius: customStyles.cardRadius}}>
                  <div className="text-gray-600">{item.icon}</div>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 
                className="font-semibold mb-3" 
                style={{
                  color: organization?.inputs?.p_color || '#1f2937',
                  fontSize: customStyles.cardTitleSize
                }}
              >
                {item.title}
              </h3>
              <p 
                className="text-gray-500 leading-relaxed mb-4" 
                style={{
                  color: organization?.inputs?.s_color || '#6b7280',
                  fontSize: customStyles.bodyTextSize
                }}
              >
                {item.description}
              </p>
              <button 
                className="text-gray-700 font-medium hover:text-gray-900 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Learn More</span>
                {showHeroIcons && <FaArrowRight className="w-3 h-3" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


