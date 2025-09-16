"use client"
import { FaArrowRight } from "react-icons/fa";
import AddToCartButton from "@/app/components/AddToCartButton";

export default function CampaignsSection({ organization, organizationId, campaigns, customStyles, showCampaignBadges, showHeroIcons, showHoverEffects, router }) {
  return (
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
                    <AddToCartButton
                      campaignId={campaign.id}
                      campaignName={campaign.external_name}
                      size="medium"
                      variant="outline"
                      className="w-full"
                      onSuccess={() => {}}
                      onError={() => {}}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center">No active campaigns available.</p>
          )}
        </div>
      </div>
    </div>
  );
}





