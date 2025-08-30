"use client"
import { useContext, useEffect, useState } from "react"
import { AboutPageContext } from "@/app/context/organizationPages/aboutPageContext"
import { FaPlay } from "react-icons/fa"

const AboutPage = () => {
  const { inputs, sections } = useContext(AboutPageContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false once inputs are populated
    if (inputs && Object.keys(inputs).length > 0) {
      setIsLoading(false);
    }
  }, [inputs]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about page...</p>
        </div>
      </div>
    );
  }

  // Show fallback if no about page data exists
  // if (!inputs || !inputs.headline) {
  //   return (
  //     <div className="min-h-screen bg-white flex items-center justify-center">
  //       <div className="text-center max-w-md mx-auto px-6">
  //         <h1 className="text-2xl font-bold text-gray-900 mb-4">About Page Not Found</h1>
  //         <p className="text-gray-600 mb-6">
  //           This organization hasn't set up their about page yet. Please check back later or contact the organization for more information.
  //         </p>
  //         <a 
  //           href={`/organization/${inputs?.organizationId || 'unknown'}`}
  //           className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
  //         >
  //           Back to Organization
  //         </a>
  //       </div>
  //     </div>
  //   );
  // }

  // Apply dynamic styles based on customization settings
  const customStyles = {
    heroHeight: inputs.heroHeight || "600px",
    sectionPadding: inputs.sectionPadding || "100px",
    cardRadius: inputs.cardRadius || "12px",
    buttonRadius: inputs.buttonRadius || "8px",
    fontFamily: "Inter, system-ui, sans-serif",
    accentColor: inputs.accentColor || "#3B82F6",
    overlayOpacity: inputs.overlayOpacity || "0.4"
  }

  return (
    <div className="bg-white" style={{backgroundColor: inputs.bg_color}}>
      {/* Hero Section - Modern Design */}
      <div className="relative w-full overflow-hidden" style={{height: customStyles.heroHeight}}>
        <img
          className="w-full h-full object-cover"
          src={inputs.bgImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"}
          alt="Organization"
        />
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${customStyles.overlayOpacity})`
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 
              className="font-bold text-white leading-tight"
              style={{
                color: inputs.banner_title_text || "#ffffff",
                fontSize: inputs.heroTitleSize || "4rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)"
              }}
            >
              {inputs.headline || "About Our Organization"}
            </h1>
            <p 
              className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
              style={{
                color: inputs.banner_subtitle_text || "#ffffff",
                fontSize: inputs.heroSubtitleSize || "1.25rem",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)"
              }}
            >
              {inputs.heroSubtitle || "We are dedicated to making a positive impact in our community through innovative solutions and unwavering commitment to our mission."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6" style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}>
        {/* Story Section - Enhanced Design */}
        {sections.find(s => s.name === "story")?.active && (
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>
            <h2 
              className="font-bold mb-8"
              style={{
                color: inputs.p_color || "#1F2937",
                fontSize: inputs.sectionTitleSize || "2.5rem"
              }}
            >
              {inputs.storyTitle || "Our Story"}
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                  <p 
                    className="leading-relaxed text-lg"
                    style={{
                      color: inputs.s_color || "#6B7280",
                      fontSize: inputs.bodyTextSize || "1.125rem"
                    }}
                  >
                    {inputs.storyText || inputs.aboutText || "We are dedicated to making a positive impact in our community through innovative solutions and unwavering commitment to our mission. Our journey began with a simple belief that together, we can create lasting change."}
                  </p>
                </div>
                {inputs.storyImage && (
                  <div className="relative">
                    <img 
                      src={inputs.storyImage} 
                      alt="Our Story" 
                      className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                      style={{borderRadius: customStyles.cardRadius}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* What We Do Section - Modern Card Design */}
        {sections.find(s => s.name === "what")?.active && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 
                className="font-bold mb-4"
                style={{
                  color: inputs.p_color || "#1F2937",
                  fontSize: inputs.sectionTitleSize || "2rem"
                }}
              >
                What We Do
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p 
                  className="leading-relaxed text-lg"
                  style={{
                    color: inputs.s_color || "#6B7280",
                    fontSize: inputs.bodyTextSize || "1.125rem"
                  }}
                >
                  {inputs.whatText || "We provide innovative solutions to address the most pressing challenges facing our community. Through strategic partnerships and evidence-based approaches, we create sustainable impact that transforms lives."}
                </p>
              </div>
              <div className="relative">
                <img 
                  src={inputs.aboutImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"} 
                  alt="About" 
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                  style={{borderRadius: customStyles.cardRadius}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        )}

        {/* Why We Do It Section - Enhanced Design */}
        {sections.find(s => s.name === "why")?.active && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 
                className="font-bold mb-4"
                style={{
                  color: inputs.p_color || "#1F2937",
                  fontSize: inputs.sectionTitleSize || "2rem"
                }}
              >
                Why We Do It
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
                <p 
                  className="leading-relaxed text-lg text-center"
                  style={{
                    color: inputs.s_color || "#6B7280",
                    fontSize: inputs.bodyTextSize || "1.125rem"
                  }}
                >
                  {inputs.whyText || "We believe in the power of community and the importance of giving back to create lasting positive change. Every action we take is driven by our commitment to building a better future for all."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Team Section - Modern Grid Design */}
        {sections.find(s => s.name === "team")?.active && (
          <div className="text-center">
            <div className="mb-12">
              <h3 
                className="font-bold mb-4"
                style={{
                  color: inputs.p_color || "#1F2937",
                  fontSize: inputs.sectionTitleSize || "2rem"
                }}
              >
                Our Team
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>
            <p 
              className="leading-relaxed mb-12 max-w-2xl mx-auto text-lg"
              style={{
                color: inputs.s_color || "#6B7280",
                fontSize: inputs.bodyTextSize || "1.125rem"
              }}
            >
              {inputs.teamText || "Meet the dedicated individuals who make our mission possible. Our team brings together diverse expertise and shared passion for creating positive change."}
            </p>
            
            {inputs.showTeamPhotos && inputs.teamImage && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="group">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <img 
                      src={inputs.teamImage} 
                      alt="Team Member" 
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{borderRadius: customStyles.cardRadius}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 
                        className="font-bold mb-2"
                        style={{
                          color: "#ffffff",
                          fontSize: inputs.cardTitleSize || "1.25rem"
                        }}
                      >
                        John Doe
                      </h4>
                      <p 
                        style={{
                          color: "#ffffff",
                          fontSize: inputs.bodyTextSize || "1rem"
                        }}
                      >
                        Executive Director
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <img 
                      src={inputs.teamImage} 
                      alt="Team Member" 
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{borderRadius: customStyles.cardRadius}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 
                        className="font-bold mb-2"
                        style={{
                          color: "#ffffff",
                          fontSize: inputs.cardTitleSize || "1.25rem"
                        }}
                      >
                        Jane Smith
                      </h4>
                      <p 
                        style={{
                          color: "#ffffff",
                          fontSize: inputs.bodyTextSize || "1rem"
                        }}
                      >
                        Program Manager
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <img 
                      src={inputs.teamImage} 
                      alt="Team Member" 
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{borderRadius: customStyles.cardRadius}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 
                        className="font-bold mb-2"
                        style={{
                          color: "#ffffff",
                          fontSize: inputs.cardTitleSize || "1.25rem"
                        }}
                      >
                        Mike Johnson
                      </h4>
                      <p 
                        style={{
                          color: "#ffffff",
                          fontSize: inputs.bodyTextSize || "1rem"
                        }}
                      >
                        Community Outreach
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default AboutPage
