"use client"
import { useContext } from "react"
import { AboutPageContext } from "@/app/context/organizationPages/aboutPageContext"
import { FaPlay } from "react-icons/fa"

const AboutPageDisplay = () => {
   const {inputs, sections} = useContext(AboutPageContext)

   // Apply dynamic styles based on customization settings
   const customStyles = {
      heroHeight: inputs.heroHeight || "500px",
      sectionPadding: inputs.sectionPadding || "80px",
      cardRadius: inputs.cardRadius || "4px",
      buttonRadius: inputs.buttonRadius || "4px",
      fontFamily: "Inter, system-ui, sans-serif",
      accentColor: inputs.accentColor || "#1F2937",
      overlayOpacity: inputs.overlayOpacity || "0.3"
   }

   return (
      <div className="bg-white max-w-6xl mx-auto" style={{backgroundColor: inputs.bg_color}}>
         {/* Hero Section - Always visible */}
         <div className="relative w-full" style={{height: customStyles.heroHeight}}>
            <img
               className="w-full object-cover h-full"
               src={inputs.bgImage || "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"}
               alt="Organization"
            />
            <div 
               className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6"
               style={{
                  backgroundColor: `rgba(0, 0, 0, ${customStyles.overlayOpacity})`
               }}
            >
               <h1 
                  className="font-semibold text-white"
                  style={{
                     color: inputs.p_color,
                     fontSize: inputs.heroTitleSize
                  }}
               >
                  {inputs.headline || "About Us"}
               </h1>
               {inputs.showVideoButton && (
                  <button 
                     className="flex items-center space-x-2 px-4 py-2 text-white border border-white hover:bg-white hover:text-black transition-colors duration-200"
                     style={{
                        borderRadius: customStyles.buttonRadius,
                        fontSize: inputs.buttonTextSize
                     }}
                  >
                     <FaPlay className="w-3 h-3" />
                     <span>Watch Our Story</span>
                  </button>
               )}
            </div>
         </div>

         {/* Main Content */}
         <div className="max-w-4xl mx-auto px-6" style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}>
            {/* About Section - Always visible */}
            <div className="text-center mb-16">
               <h2 
                  className="font-semibold mb-6"
                  style={{
                     color: inputs.p_color,
                     fontSize: inputs.sectionTitleSize
                  }}
               >
                  Our Story
               </h2>
               <p 
                  className="leading-relaxed"
                  style={{
                     color: inputs.s_color,
                     fontSize: inputs.bodyTextSize
                  }}
               >
                  {inputs.aboutText || "We are dedicated to making a positive impact in our community through innovative solutions and unwavering commitment to our mission."}
               </p>
            </div>

            {/* What We Do Section - Controlled by section manager */}
            {sections.find(s => s.name === "what")?.active && (
               <div className="mb-16">
                  <h3 
                     className="text-center font-semibold mb-6"
                     style={{
                        color: inputs.p_color,
                        fontSize: inputs.sectionTitleSize
                     }}
                  >
                     What We Do
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                     <div className="text-center">
                        <p 
                           className="leading-relaxed"
                           style={{
                              color: inputs.s_color,
                              fontSize: inputs.bodyTextSize
                           }}
                        >
                           {inputs.whatText || "We provide innovative solutions to address the most pressing challenges facing our community."}
                        </p>
                     </div>
                     {inputs.aboutImage && (
                        <div>
                           <img 
                              src={inputs.aboutImage} 
                              alt="About" 
                              className="w-full h-48 object-cover"
                              style={{borderRadius: customStyles.cardRadius}}
                           />
                        </div>
                     )}
                  </div>
               </div>
            )}

            {/* Why We Do It Section - Controlled by section manager */}
            {sections.find(s => s.name === "why")?.active && (
               <div className="mb-16">
                  <h3 
                     className="text-center font-semibold mb-6"
                     style={{
                        color: inputs.p_color,
                        fontSize: inputs.sectionTitleSize
                     }}
                  >
                     Why We Do It
                  </h3>
                  <div className="text-center">
                     <p 
                        className="leading-relaxed max-w-2xl mx-auto"
                        style={{
                           color: inputs.s_color,
                           fontSize: inputs.bodyTextSize
                        }}
                     >
                        {inputs.whyText || "We believe in the power of community and the importance of giving back to create lasting positive change."}
                     </p>
                  </div>
               </div>
            )}

            {/* Team Section - Controlled by section manager */}
            {sections.find(s => s.name === "team")?.active && (
               <div className="text-center">
                  <h3 
                     className="font-semibold mb-8"
                     style={{
                        color: inputs.p_color,
                        fontSize: inputs.sectionTitleSize
                     }}
                  >
                     Our Team
                  </h3>
                  <p 
                     className="leading-relaxed mb-8"
                     style={{
                        color: inputs.s_color,
                        fontSize: inputs.bodyTextSize
                     }}
                  >
                     {inputs.teamText || "Meet the dedicated individuals who make our mission possible."}
                  </p>
                  
                  {inputs.showTeamPhotos && inputs.teamImage && (
                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                           <img 
                              src={inputs.teamImage} 
                              alt="Team Member" 
                              className="w-32 h-32 mx-auto mb-4 object-cover"
                              style={{borderRadius: customStyles.cardRadius}}
                           />
                           <h4 
                              className="font-semibold mb-2"
                              style={{
                                 color: inputs.p_color,
                                 fontSize: inputs.cardTitleSize
                              }}
                           >
                              John Doe
                           </h4>
                           <p 
                              style={{
                                 color: inputs.s_color,
                                 fontSize: inputs.bodyTextSize
                              }}
                           >
                              Executive Director
                           </p>
                        </div>
                        <div className="text-center">
                           <img 
                              src={inputs.teamImage} 
                              alt="Team Member" 
                              className="w-32 h-32 mx-auto mb-4 object-cover"
                              style={{borderRadius: customStyles.cardRadius}}
                           />
                           <h4 
                              className="font-semibold mb-2"
                              style={{
                                 color: inputs.p_color,
                                 fontSize: inputs.cardTitleSize
                              }}
                           >
                              Jane Smith
                           </h4>
                           <p 
                              style={{
                                 color: inputs.s_color,
                                 fontSize: inputs.bodyTextSize
                              }}
                           >
                              Program Manager
                           </p>
                        </div>
                        <div className="text-center">
                           <img 
                              src={inputs.teamImage} 
                              alt="Team Member" 
                              className="w-32 h-32 mx-auto mb-4 object-cover"
                              style={{borderRadius: customStyles.cardRadius}}
                           />
                           <h4 
                              className="font-semibold mb-2"
                              style={{
                                 color: inputs.p_color,
                                 fontSize: inputs.cardTitleSize
                              }}
                           >
                              Mike Johnson
                           </h4>
                           <p 
                              style={{
                                 color: inputs.s_color,
                                 fontSize: inputs.bodyTextSize
                              }}
                           >
                              Community Outreach
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   )
}

export default AboutPageDisplay