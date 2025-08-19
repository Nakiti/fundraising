"use client";
import { CgProfile } from "react-icons/cg";
import { useContext, useState } from "react";
import { LandingPageContext } from "@/app/context/organizationPages/landingPageContext"
import { IoIosClose } from "react-icons/io";
import { FaHeart, FaUsers, FaChartLine, FaArrowRight, FaPlay, FaStar, FaCheckCircle } from "react-icons/fa";

const LandingPageDisplay = () => {
   const {inputs, sections} = useContext(LandingPageContext)
   const campaigns = ["Campaign One", "Campaign Two", "Campaign Three"]

   // Enhanced customization options
   const customStyles = {
      heroHeight: inputs.heroHeight || "500px",
      sectionPadding: inputs.sectionPadding || "80px",
      cardRadius: inputs.cardRadius || "4px",
      buttonRadius: inputs.buttonRadius || "4px",
      fontFamily: inputs.fontFamily || "Inter, sans-serif",
      accentColor: inputs.accentColor || "#1F2937",
      overlayOpacity: inputs.overlayOpacity || "0.3",
      // Font sizes
      heroTitleSize: inputs.heroTitleSize || "36px",
      heroSubtitleSize: inputs.heroSubtitleSize || "16px",
      sectionTitleSize: inputs.sectionTitleSize || "28px",
      bodyTextSize: inputs.bodyTextSize || "14px",
      buttonTextSize: inputs.buttonTextSize || "14px",
      cardTitleSize: inputs.cardTitleSize || "18px"
   }

   // Toggle states (default to true if not set)
   const showVideoButton = inputs.showVideoButton !== false
   const showHeroIcons = inputs.showHeroIcons !== false
   const showFeatureIcons = inputs.showFeatureIcons !== false
   const showCampaignBadges = inputs.showCampaignBadges !== false
   const showTrustBadge = inputs.showTrustBadge !== false
   const showProgressIndicators = inputs.showProgressIndicators !== false
   const showStatistics = inputs.showStatistics !== false
   const showHoverEffects = inputs.showHoverEffects !== false

   return (
      <div 
         className="bg-white w-full min-h-screen"
         style={{
            backgroundColor: inputs.bg_color,
            fontFamily: customStyles.fontFamily
         }}
      >
         {/* Header */}
         <div className="bg-gray-900 w-full px-6 py-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-white font-medium">Landing Page Preview</p>
               </div>
               <div className="flex items-center space-x-4 text-gray-400">
                  <span className="text-sm">Live Preview</span>
                  <div className="flex space-x-1">
                     <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                     <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                     <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Hero Banner */}
         <div className="relative w-full" style={{height: customStyles.heroHeight}}>
            <img
               className="w-full h-full object-cover"
               src={inputs.bgImage ? inputs.bgImage : "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"}
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
                        color: inputs.p_color,
                        fontSize: customStyles.heroTitleSize
                     }}
                  >
                     {inputs.title || "Welcome to Our Organization"}
                  </h1>
                  <p 
                     className="text-gray-100 max-w-3xl mx-auto leading-relaxed" 
                     style={{
                        color: inputs.p_color,
                        fontSize: customStyles.heroSubtitleSize
                     }}
                  >
                     {inputs.description ? inputs.description : "We're dedicated to making a positive impact in our community through innovative programs and dedicated service."}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                     <button 
                        className={`font-semibold transition-all duration-300 flex items-center space-x-2 ${showHoverEffects ? 'hover:scale-105' : ''}`}
                        style={{
                           backgroundColor: inputs.b_color || customStyles.accentColor,
                           color: inputs.bt_color || '#FFFFFF',
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

         {/* Main Content Section */}
         {sections[1].active && (
            <div 
               className="flex flex-col lg:flex-row w-full px-8 space-y-16 lg:space-y-0 lg:space-x-16"
               style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}
            >
               <div className="lg:w-2/3">
                  <h2 
                     className="font-bold mb-8 leading-tight" 
                     style={{
                        color: inputs.p_color,
                        fontSize: customStyles.sectionTitleSize
                     }}
                  >
                     {inputs.mainHeadline || "Making a Difference Together"}
                  </h2>
                  <p 
                     className="leading-relaxed mb-12 text-gray-700" 
                     style={{
                        color: inputs.s_color,
                        fontSize: customStyles.bodyTextSize
                     }}
                  >
                     {inputs.mainText || "Our organization works tirelessly to create positive change in the community. Through innovative programs and dedicated volunteers, we're building a better future for everyone."}
                  </p>
                  
                                     {/* Enhanced Features Grid */}
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
                                   color: inputs.p_color,
                                   fontSize: customStyles.cardTitleSize
                                }}
                             >
                                {feature.title}
                             </h3>
                             <p 
                                className="text-gray-500" 
                                style={{
                                   color: inputs.s_color,
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
         )}

         {/* About Section */}
         {sections[2].active && (
            <div 
               className="flex flex-col lg:flex-row items-center space-y-16 lg:space-y-0 lg:space-x-20 w-full px-8 bg-gray-50"
               style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}
            >
               <div className="lg:w-1/2 space-y-8">
                  <div>
                     <h2 
                        className="font-bold mb-6 leading-tight" 
                        style={{
                           color: inputs.p_color,
                           fontSize: customStyles.sectionTitleSize
                        }}
                     >
                        About Our Organization
                     </h2>
                     <p 
                        className="leading-relaxed text-gray-700" 
                        style={{
                           color: inputs.s_color,
                           fontSize: customStyles.bodyTextSize
                        }}
                     >
                        {inputs.aboutText || "We are a dedicated team of professionals and volunteers committed to creating positive change in our community. Our mission is to provide support, resources, and opportunities for those who need them most."}               
                     </p>
                  </div>
                  
                                     {/* Enhanced About Features */}
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
                     className={`font-semibold transition-all duration-300 flex items-center space-x-2 ${showHoverEffects ? 'hover:scale-105' : ''}`}
                     style={{
                        backgroundColor: inputs.b_color || customStyles.accentColor,
                        color: inputs.bt_color || '#FFFFFF',
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
                         src={inputs.aboutImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"}
                         alt="About Us"
                         style={{borderRadius: customStyles.cardRadius}}
                      />
                      {showTrustBadge && (
                         <div className="absolute -bottom-4 -left-4 bg-white border border-gray-100 p-4" style={{borderRadius: customStyles.cardRadius}}>
                            <div className="flex items-center space-x-2">
                               <FaCheckCircle className="w-5 h-5 text-gray-600" />
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
         )}

         {/* Impact Section */}
         {sections[3].active && (
            <div 
               className="flex flex-col lg:flex-row items-center space-y-16 lg:space-y-0 lg:space-x-20 w-full px-8"
               style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}
            >
               <div className="lg:w-1/2">
                  <div className="relative">
                     <img
                        className="w-full h-96 object-cover rounded-xl shadow-2xl"
                        src={inputs.textImage || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                        alt="Our Impact"
                        style={{borderRadius: customStyles.cardRadius}}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                  </div>
               </div>
               <div className="lg:w-1/2 space-y-8">
                  <h2 
                     className="font-bold leading-tight" 
                     style={{
                        color: inputs.p_color,
                        fontSize: customStyles.sectionTitleSize
                     }}
                  >
                     Our Impact
                  </h2>
                  <p 
                     className="leading-relaxed text-gray-700" 
                     style={{
                        color: inputs.s_color,
                        fontSize: customStyles.bodyTextSize
                     }}
                  >
                     {inputs.impactText || "Through our programs and initiatives, we've helped thousands of individuals and families. Our impact is measured not just in numbers, but in the positive changes we see in our community every day."}                
                  </p>
                  
                                     {/* Impact Metrics */}
                   {showStatistics && (
                      <div className="grid grid-cols-2 gap-4">
                         {[
                            { metric: "95%", label: "Success Rate" },
                            { metric: "24/7", label: "Support Available" },
                            { metric: "100%", label: "Transparency" },
                            { metric: "A+", label: "Rating" }
                         ].map((item, index) => (
                            <div key={index} className="text-center p-3 bg-gray-50 border border-gray-100" style={{borderRadius: customStyles.cardRadius}}>
                               <div className="text-lg font-semibold text-gray-900 mb-1">{item.metric}</div>
                               <div className="text-xs text-gray-500">{item.label}</div>
                            </div>
                         ))}
                      </div>
                   )}
                  
                  <button 
                     className={`font-semibold transition-all duration-300 flex items-center space-x-2 ${showHoverEffects ? 'hover:scale-105' : ''}`}
                     style={{
                        backgroundColor: inputs.b_color || customStyles.accentColor,
                        color: inputs.bt_color || '#FFFFFF',
                        borderRadius: customStyles.buttonRadius,
                        fontSize: customStyles.buttonTextSize,
                        padding: '16px 40px'
                     }}
                  >
                     <span>Learn More</span>
                     {showHeroIcons && <FaArrowRight className="w-4 h-4" />}
                  </button>
               </div>
            </div>
         )}

         {/* Triple Section */}
         {sections[5].active && (
            <div 
               className="px-8 bg-gray-50"
               style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}
            >
               <div className="text-center mb-16">
                  <h2 
                     className="font-bold mb-6" 
                     style={{
                        color: inputs.p_color,
                        fontSize: customStyles.sectionTitleSize
                     }}
                  >
                     Our Programs
                  </h2>
                  <p 
                     className="text-gray-600 max-w-3xl mx-auto" 
                     style={{
                        color: inputs.s_color,
                        fontSize: customStyles.bodyTextSize
                     }}
                  >
                     Discover the various programs and initiatives that make our organization unique
                  </p>
               </div>
               
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                   {[
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
                   ].map((item, index) => (
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
                                  color: inputs.p_color,
                                  fontSize: customStyles.cardTitleSize
                               }}
                            >
                               {item.title}
                            </h3>
                            <p 
                               className="text-gray-500 leading-relaxed mb-4" 
                               style={{
                                  color: inputs.s_color,
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
         )}

         {/* Campaigns Section */}
         <div 
            className="px-8"
            style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}
         >
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-16">
                  <h2 
                     className="font-bold mb-6" 
                     style={{
                        color: inputs.p_color,
                        fontSize: customStyles.sectionTitleSize
                     }}
                  >
                     Active Campaigns
                  </h2>
                  <p 
                     className="text-gray-600 max-w-3xl mx-auto" 
                     style={{
                        color: inputs.s_color,
                        fontSize: customStyles.bodyTextSize
                     }}
                  >
                     Join us in making a difference through our current fundraising initiatives
                  </p>
               </div>
               
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {campaigns.map((item, index) => (
                      <div 
                         className={`bg-white border border-gray-100 overflow-hidden transition-all duration-200 ${showHoverEffects ? 'hover:border-gray-200 hover:shadow-sm' : ''}`}
                         key={index}
                         style={{
                            backgroundColor: inputs.c_color,
                            borderRadius: customStyles.cardRadius
                         }}
                      >
                         <div className="relative">
                            <img 
                               src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                               className="object-cover w-full h-48"
                               alt={item}
                            />
                            {showCampaignBadges && (
                               <div className="absolute top-3 left-3 bg-gray-800 text-white px-2 py-1 text-xs font-medium" style={{borderRadius: customStyles.cardRadius}}>
                                  Active
                               </div>
                            )}
                         </div>
                         <div className="p-6">
                            <h3 
                               className="font-semibold mb-3" 
                               style={{
                                  color: inputs.ct_color,
                                  fontSize: customStyles.cardTitleSize
                               }}
                            >
                               {item}
                            </h3>
                            <p 
                               className="text-gray-500 mb-4 leading-relaxed" 
                               style={{
                                  color: inputs.s_color,
                                  fontSize: customStyles.bodyTextSize
                               }}
                            >
                               Join us in making a difference through this important initiative that supports our community.
                            </p>
                            {showProgressIndicators && (
                               <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center space-x-2">
                                     <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                     <span className="text-xs text-gray-500">In Progress</span>
                                  </div>
                                  <span className="text-xs font-medium text-gray-700">75% Funded</span>
                               </div>
                            )}
                            <button 
                               className={`w-full font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${showHoverEffects ? 'hover:bg-gray-50' : ''}`}
                               style={{
                                  backgroundColor: inputs.b_color || customStyles.accentColor,
                                  color: inputs.bt_color || '#FFFFFF',
                                  borderRadius: customStyles.buttonRadius,
                                  fontSize: customStyles.buttonTextSize,
                                  padding: '12px 20px'
                               }}
                            >
                               <span>Learn More</span>
                               {showHeroIcons && <FaArrowRight className="w-3 h-3" />}
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
            </div>
         </div>
      </div>
   );
}

export default LandingPageDisplay