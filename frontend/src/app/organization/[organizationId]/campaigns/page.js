"use client"
import { Services, useApi, useToast } from "@/app/services";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaHeart, FaUsers, FaCalendarAlt, FaChartLine } from "react-icons/fa";

const Campaigns = ({ params }) => {
  const organizationId = params.organizationId;
  const [organization, setOrganization] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { showError } = useToast();

  // API hooks for data fetching
  const { execute: fetchOrganization } = useApi(Services.Organization.getOrganization);
  const { execute: fetchCampaigns } = useApi(Services.Campaign.getFilteredCampaigns);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch organization data
        const organizationResponse = await fetchOrganization(organizationId);
        if (organizationResponse) {
          setOrganization(organizationResponse);
        }

        // Fetch all active campaigns
        const campaignResponse = await fetchCampaigns(organizationId, "active");
        if (campaignResponse) {
          setCampaigns(campaignResponse);
        }

      } catch (err) {
        console.error('Error fetching campaigns data:', err);
        showError('Error', 'Failed to load campaigns. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organizationId, fetchOrganization, fetchCampaigns, showError]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  const getCampaignTypeIcon = (campaignType) => {
    switch (campaignType) {
      case 'crowdfunding':
        return <FaHeart className="w-5 h-5 text-red-500" />;
      case 'ticketed-event':
        return <FaCalendarAlt className="w-5 h-5 text-blue-500" />;
      case 'peer-to-peer':
        return <FaUsers className="w-5 h-5 text-green-500" />;
      default:
        return <FaChartLine className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCampaignTypeLabel = (campaignType) => {
    switch (campaignType) {
      case 'crowdfunding':
        return 'Crowdfunding';
      case 'ticketed-event':
        return 'Event';
      case 'peer-to-peer':
        return 'Peer Fundraising';
      default:
        return 'Campaign';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Active Campaigns
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join us in making a difference through our current fundraising initiatives. 
              Every contribution helps us create positive change in our community.
            </p>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {campaigns && campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Campaign Image */}
                <div className="relative">
                  <img 
                    src={campaign.image || "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                    className="w-full h-48 object-cover"
                    alt={campaign.external_name}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white bg-opacity-90 p-2 rounded-lg">
                      {getCampaignTypeIcon(campaign.campaign_type)}
                    </div>
                  </div>
                </div>

                {/* Campaign Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {getCampaignTypeLabel(campaign.campaign_type)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: {campaign.id}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {campaign.external_name}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {campaign.description || "Join us in making a difference through this important initiative that supports our community and creates lasting positive impact."}
                  </p>

                  {/* Campaign Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">
                        {campaign.goal_amount ? `$${campaign.goal_amount.toLocaleString()}` : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">Goal</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">
                        {campaign.current_amount ? `$${campaign.current_amount.toLocaleString()}` : '$0'}
                      </div>
                      <div className="text-xs text-gray-500">Raised</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {campaign.goal_amount && campaign.current_amount && (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((campaign.current_amount / campaign.goal_amount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link 
                    href={`/organization/${organizationId}/campaign/${campaign.id}`}
                    className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>View Campaign</span>
                    <FaArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Campaigns</h3>
              <p className="text-gray-600 mb-6">
                There are currently no active campaigns. Check back soon for new fundraising initiatives!
              </p>
              <Link 
                href={`/organization/${organizationId}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                Back to Organization
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">
              Questions about our campaigns? Contact us at{' '}
              <a 
                href={`mailto:${organization?.contact_email || 'contact@organization.com'}`}
                className="text-blue-600 hover:text-blue-700"
              >
                {organization?.contact_email || 'contact@organization.com'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
