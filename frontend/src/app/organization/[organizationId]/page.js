"use client"
import { getOrganizationService, getCampaignService, useToast, getPageService } from "@/app/services";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroBanner from "./components/DonationPage/HeroBanner";
import MainContentSection from "./components/DonationPage/MainContentSection";
import AboutSection from "./components/DonationPage/AboutSection";
import ImpactSection from "./components/DonationPage/ImpactSection";
import ProgramsSection from "./components/DonationPage/ProgramsSection";
import CampaignsSection from "./components/DonationPage/CampaignsSection";

const Organization = ({ params }) => {
  const organizationId = params.organizationId;
  const [organization, setOrganization] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [landingPage, setLandingPage] = useState(null);
  
  const { showError } = useToast();

  // Get service instances
  const organizationService = getOrganizationService();
  const campaignService = getCampaignService();
  const pageService = getPageService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch organization data
        const organizationResponse = await organizationService.getOrganization(organizationId);
        if (organizationResponse) {
          console.log("organizationResponse", organizationResponse.data)
          setOrganization(organizationResponse.data);
        }

        const landingPageResponse = await pageService.getLandingPage(organizationId);
        if (landingPageResponse) {
          setLandingPage(landingPageResponse.data);
        }
        console.log("landingPageResponse", landingPageResponse)

        // Fetch all active campaigns
        const campaignResponse = await campaignService.getFilteredCampaigns(organizationId, { status: "active" });
        if (campaignResponse) {
          setCampaigns(campaignResponse.data);
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
  const showHeroIcons = organization?.inputs?.showHeroIcons !== false
  const showFeatureIcons = organization?.inputs?.showFeatureIcons !== false
  const showCampaignBadges = organization?.inputs?.showCampaignBadges !== false
  const showTrustBadge = organization?.inputs?.showTrustBadge !== false
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
      {landingPage && <div>
        <HeroBanner 
          organization={organization}
          landingPage={landingPage}
          customStyles={customStyles}
          showHeroIcons={showHeroIcons}
          showHoverEffects={showHoverEffects}
        />

        {/* Main Content Section */}
        {organization?.sections?.[1]?.active && (
          <MainContentSection 
            organization={organization}
            customStyles={customStyles}
            showFeatureIcons={showFeatureIcons}
            showHoverEffects={showHoverEffects}
          />
        )}

        {/* About Section */}
        {organization?.sections?.[2]?.active && (
          <AboutSection 
            organization={organization}
            customStyles={customStyles}
            showStatistics={showStatistics}
            showHeroIcons={showHeroIcons}
            showTrustBadge={showTrustBadge}
          />
        )}

        {/* Impact Section */}
        {organization?.sections?.[3]?.active && (
          <ImpactSection 
            organization={organization}
            customStyles={customStyles}
            showStatistics={showStatistics}
          />
        )}

        {/* Triple Section */}
        {organization?.sections?.[5]?.active && (
          <ProgramsSection 
            organization={organization}
            customStyles={customStyles}
            showFeatureIcons={showFeatureIcons}
            showHoverEffects={showHoverEffects}
            showHeroIcons={showHeroIcons}
          />
        )}

        <CampaignsSection 
          organization={organization}
          organizationId={organizationId}
          campaigns={campaigns}
          customStyles={customStyles}
          showCampaignBadges={showCampaignBadges}
          showHeroIcons={showHeroIcons}
          showHoverEffects={showHoverEffects}
          router={router}
        />
      </div>}
    </div>
  );
};

// Removed unused LandingPageContent

export default Organization;
