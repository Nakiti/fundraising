"use client"
import { getOrganizationService, getCampaignService, useApi, useToast } from "@/app/services";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaHeart, FaUsers, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import AddToCartButton from "@/app/components/AddToCartButton";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { useRouter } from "next/navigation";

const Organization = ({ params }) => {
  const organizationId = params.organizationId;
  const [organization, setOrganization] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { showError } = useToast();

  // Get service instances
  const organizationService = getOrganizationService();
  const campaignService = getCampaignService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch organization data
        const organizationResponse = await organizationService.getOrganization(organizationId);
        if (organizationResponse) {
          setOrganization(organizationResponse);
        }

        // Fetch all active campaigns
        const campaignResponse = await campaignService.getFilteredCampaigns(organizationId, { status: "active" });
        if (campaignResponse) {
          setCampaigns(campaignResponse);
        }

      } catch (err) {
        console.error('Error fetching organization data:', err);
        showError('Error', 'Failed to load organization. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organizationId, organizationService, campaignService, showError]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-96 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading organization...</p>
        </div>
      </div>
    );
  }

  return (
    <LandingPageContent 
      organization={organization} 
      campaigns={campaigns} 
      organizationId={organizationId}
    />
  );
};

// Separate component to use context
const LandingPageContent = ({ organization, campaigns, organizationId }) => {
  const router = useRouter();

  // Enhanced customization options
  const customStyles = {
    heroHeight: organization?.inputs?.heroHeight || "500px",
    sectionPadding: organization?.inputs?.sectionPadding || "80px",
    cardRadius: organization?.inputs?.cardRadius || "4px",
    buttonRadius: organization?.inputs?.buttonRadius || "4px",
    fontFamily: organization?.inputs?.fontFamily || "Inter, sans-serif",
    accentColor: organization?.inputs?.accentColor || "#1F2937",
    overlayOpacity: organization?.inputs?.overlayOpacity || "0.3",
    // Font sizes
    heroTitleSize: organization?.inputs?.heroTitleSize || "36px",
    heroSubtitleSize: organization?.inputs?.heroSubtitleSize || "16px",
    sectionTitleSize: organization?.inputs?.sectionTitleSize || "28px",
    bodyTextSize: organization?.inputs?.bodyTextSize || "14px",
    buttonTextSize: organization?.inputs?.buttonTextSize || "14px",
    cardTitleSize: organization?.inputs?.cardTitleSize || "18px"
  }

  // Toggle states (default to true if not set)
  const showVideoButton = organization?.inputs?.showVideoButton !== false
  const showHeroIcons = organization?.inputs?.showHeroIcons !== false
  const showFeatureIcons = organization?.inputs?.showFeatureIcons !== false
  const showCampaignBadges = organization?.inputs?.showCampaignBadges !== false
  const showTrustBadge = organization?.inputs?.showTrustBadge !== false
  const showProgressIndicators = organization?.inputs?.showProgressIndicators !== false
  const showStatistics = organization?.inputs?.showStatistics !== false
  const showHoverEffects = organization?.inputs?.showHoverEffects !== false

  return (
    <div 
      className="bg-white w-full"
      style={{
        backgroundColor: organization?.inputs?.bg_color || '#ffffff',
        fontFamily: customStyles.fontFamily
      }}
    >
      {/* Hero Banner */}
      <div className="relative w-full" style={{height: customStyles.heroHeight}}>
        <img
          className="w-full h-full object-cover"
          src={organization?.inputs?.bgImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"}
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
                  // Assuming a default section to scroll to, or you can pass a prop
                  // For now, let's scroll to the campaigns section
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

      {/* Main Content Section */}
      {organization?.sections?.[1]?.active && (
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
      )}

      {/* About Section */}
      {organization?.sections?.[2]?.active && (
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
                    {/* Assuming FaCheckCircle is available, otherwise remove or replace */}
                    {/* <FaCheckCircle className="w-5 h-5 text-gray-600" /> */}
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
      {organization?.sections?.[3]?.active && (
        <div 
          className="flex flex-col lg:flex-row items-center space-y-16 lg:space-y-0 lg:space-x-20 w-full px-8"
          style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}
        >
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                className="w-full h-96 object-cover rounded-xl shadow-2xl"
                src={organization?.inputs?.textImage || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
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
                color: organization?.inputs?.p_color || '#1f2937',
                fontSize: customStyles.sectionTitleSize
              }}
            >
              Our Impact
            </h2>
            <p 
              className="leading-relaxed text-gray-700" 
              style={{
                color: organization?.inputs?.s_color || '#6b7280',
                fontSize: customStyles.bodyTextSize
              }}
            >
              {organization?.inputs?.impactText || "Through our programs and initiatives, we've helped thousands of individuals and families. Our impact is measured not just in numbers, but in the positive changes we see in our community every day."}                
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
            
            {/* <button 
              className={`font-semibold transition-all duration-300 flex items-center space-x-2 ${showHoverEffects ? 'hover:scale-105' : ''}`}
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
            </button> */}
          </div>
        </div>
      )}

      {/* Triple Section */}
      {organization?.sections?.[5]?.active && (
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
      )}

      {/* Campaigns Section */}
      <div 
        className="px-8"
        style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}
        id="campaigns-section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="font-bold mb-6" 
              style={{
                color: organization?.inputs?.p_color || '#1f2937',
                fontSize: customStyles.sectionTitleSize
              }}
            >
              Active Campaigns
            </h2>
            <p 
              className="text-gray-600 max-w-3xl mx-auto" 
              style={{
                color: organization?.inputs?.s_color || '#6b7280',
                fontSize: customStyles.bodyTextSize
              }}
            >
              Join us in making a difference through our current fundraising initiatives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns && campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <div 
                  className={`bg-white border border-gray-100 overflow-hidden transition-all duration-200 ${showHoverEffects ? 'hover:border-gray-200 hover:shadow-sm' : ''}`}
                  key={campaign.id}
                  style={{
                    backgroundColor: organization?.inputs?.c_color || '#ffffff',
                    borderRadius: customStyles.cardRadius
                  }}
                >
                  <div className="relative">
                    <img 
                      src={campaign.image || "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                      className="object-cover w-full h-48"
                      alt={campaign.external_name}
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
                        color: organization?.inputs?.ct_color || '#1f2937',
                        fontSize: customStyles.cardTitleSize
                      }}
                    >
                      {campaign.external_name}
                    </h3>
                    <p 
                      className="text-gray-500 mb-4 leading-relaxed" 
                      style={{
                        color: organization?.inputs?.s_color || '#6b7280',
                        fontSize: customStyles.bodyTextSize
                      }}
                    >
                      {campaign.description || "Join us in making a difference through this important initiative that supports our community."}
                    </p>
                    <div className="space-y-2">
                      {/* Learn More Button */}
                      <button 
                        className={`w-full font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${showHoverEffects ? 'hover:bg-gray-50' : ''}`}
                        style={{
                          backgroundColor: organization?.inputs?.b_color || customStyles.accentColor,
                          color: organization?.inputs?.bt_color || '#FFFFFF',
                          borderRadius: customStyles.buttonRadius,
                          fontSize: customStyles.buttonTextSize,
                          padding: '12px 20px'
                        }}
                        onClick={() => router.push(`/organization/${organizationId}/campaign/${campaign.id}/donation-page`)}
                      >
                        <span>Learn More</span>
                        {showHeroIcons && <FaArrowRight className="w-3 h-3" />}
                      </button>

                      {/* Add to Cart Button */}
                      <AddToCartButton
                        campaignId={campaign.id}
                        campaignName={campaign.external_name}
                        size="medium"
                        variant="outline"
                        className="w-full"
                        onSuccess={(data) => {
                          if (data.action === 'added') {
                            // Could show a toast notification here
                            console.log(`Added ${data.campaignName} to cart`);
                          }
                        }}
                        onError={(error) => {
                          console.error('Cart error:', error);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-3 text-center">No active campaigns available.</p>
            )}
          </div>
          
          {/* Removed showMoreCampaigns logic as it's not directly tied to a state variable */}
        </div>
      </div>

    </div>
  );
};

export default Organization;
