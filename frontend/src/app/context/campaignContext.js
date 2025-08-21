"use client";
import { createContext, useEffect, useState, useCallback } from "react";
import { Services, useApi, useToast } from "../services";

export const CampaignContext = createContext();

export const CampaignContextProvider = ({ children }) => {
   // Campaign data state
   const [campaignDetails, setCampaignDetails] = useState(null);
   const [pageSections, setPageSections] = useState(null);
   const [thankYouPage, setThankYouPage] = useState(null);
   const [ticketPage, setTicketPage] = useState(null);
   const [donationPage, setDonationPage] = useState(null);
   const [peerLandingPage, setPeerLandingPage] = useState(null);
   const [peerFundraisingPage, setPeerFundraisingPage] = useState(null);
   const [ticketPurchasePage, setTicketPurchasePage] = useState(null);
   const [activeDesignations, setActiveDesignations] = useState(null);
   const [customQuestions, setCustomQuestions] = useState([]);
   const [campaignDesignations, setCampaignDesignations] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   
   // Campaign edit functionality state
   const [questionInputs, setQuestionInputs] = useState({
      phone: false,
      title: false,
      suffix: false,
      companyorganizationname: false,
      websiteurl: false
   });
   const [designations, setDesignations] = useState([]);
   const [selectedDesignations, setSelectedDesignations] = useState([]);
   const [tickets, setTickets] = useState([]);
   const [faqs, setFaqs] = useState([]);
   const [campaignType, setCampaignType] = useState("");
   const [campaignId, setCampaignId] = useState(null);
   const [organizationId, setOrganizationId] = useState(null);
   const [campaignStatus, setCampaignStatus] = useState("");
   
   // Global change tracking state
   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
   const [originalData, setOriginalData] = useState({});
   
   // Page-specific change tracking state
   const [pageChanges, setPageChanges] = useState({
      about: false,
      contact: false,
      sharing: false,
      questions: false,
      designations: false,
      tickets: false,
      faqs: false
   });

   const { showError } = useToast();

   // API hooks for data fetching - each one is clearly named for what it fetches
   const { execute: fetchCampaignDetails, loading: detailsLoading } = useApi(Services.Campaign.getCampaignDetails);
   const { execute: fetchPageSections, loading: sectionsLoading } = useApi(Services.Page.getPageSections);
   const { execute: fetchThankYouPage, loading: thankYouLoading } = useApi(Services.Page.getThankYouPage);
   const { execute: fetchTicketPage, loading: ticketLoading } = useApi(Services.Page.getTicketPage);
   const { execute: fetchDonationPage, loading: donationPageLoading } = useApi(Services.Page.getDonationPage);
   const { execute: fetchPeerLandingPage, loading: peerLandingLoading } = useApi(Services.Page.getPeerLandingPage);
   const { execute: fetchPeerFundraisingPage, loading: peerFundraisingLoading } = useApi(Services.Page.getPeerFundraisingPage);
   const { execute: fetchTicketPurchasePage, loading: ticketPurchaseLoading } = useApi(Services.Page.getTicketPurchasePage);
   const { execute: fetchActiveDesignations, loading: designationsLoading } = useApi(Services.Designation.getActiveDesignations);
   const { execute: fetchCustomQuestions, loading: questionsLoading } = useApi(Services.Content.getCustomQuestions);
   const { execute: fetchCampaignDesignations, loading: campaignDesignationsLoading } = useApi(Services.Designation.getCampaignDesignations);
   const { execute: fetchFaqs, loading: faqsLoading } = useApi(Services.Content.getFaqs);

   // Handler functions
   const handleQuestionInputsChange = (e) => {
      const { name, checked } = e.target;
      setQuestionInputs(prev => ({
         ...prev,
         [name]: checked
      }));
      setHasUnsavedChanges(true);
      setPageHasChanges('questions', true);
   };

   const handleCampaignDetailsChange = (e) => {
      const { name, value } = e.target;
      setCampaignDetails(prev => ({
         ...prev,
         [name]: value
      }));
      setHasUnsavedChanges(true);
      
      // Update page-specific changes based on the field being changed
      if (['campaignName', 'internalName', 'goal', 'url'].includes(name)) {
         setPageHasChanges('about', true);
      }
      if (['contactEmail', 'contactPhone'].includes(name)) {
         setPageHasChanges('contact', true);
      }
      if (['socialTitle', 'socialDescription', 'campaignUrl'].includes(name)) {
         setPageHasChanges('sharing', true);
      }
   };

   // Function to mark changes as saved
   const markChangesAsSaved = () => {
      setHasUnsavedChanges(false);
      // Update original data to current state
      setOriginalData({
         campaignDetails,
         questionInputs,
         selectedDesignations,
         tickets,
         faqs,
         customQuestions
      });
      // Reset all page changes
      setPageChanges({
         about: false,
         contact: false,
         sharing: false,
         questions: false,
         designations: false,
         tickets: false,
         faqs: false
      });
   };

   // Function to mark page-specific changes as saved
   const markPageChangesAsSaved = (pageName) => {
      setPageChanges(prev => ({
         ...prev,
         [pageName]: false
      }));
   };

   // Function to set page-specific changes
   const setPageHasChanges = (pageName, hasChanges) => {
      setPageChanges(prev => ({
         ...prev,
         [pageName]: hasChanges
      }));
   };

   // Function to check if data has changed
   const checkForChanges = () => {
      const currentData = {
         campaignDetails,
         questionInputs,
         selectedDesignations,
         tickets,
         faqs,
         customQuestions
      };

      // Deep comparison of current data vs original data
      const hasChanges = JSON.stringify(currentData) !== JSON.stringify(originalData);
      setHasUnsavedChanges(hasChanges);
      return hasChanges;
   };

   // Wrapper functions to track changes for setters
   const setSelectedDesignationsWithTracking = (designations) => {
      setSelectedDesignations(designations);
      setHasUnsavedChanges(true);
      setPageHasChanges('designations', true);
   };

   const setTicketsWithTracking = (tickets) => {
      setTickets(tickets);
      setHasUnsavedChanges(true);
      setPageHasChanges('tickets', true);
   };

   const setFaqsWithTracking = (faqs) => {
      setFaqs(faqs);
      setHasUnsavedChanges(true);
      setPageHasChanges('faqs', true);
   };

   const setCustomQuestionsWithTracking = (questions) => {
      setCustomQuestions(questions);
      setHasUnsavedChanges(true);
      setPageHasChanges('questions', true);
   };

   // Main function to fetch all campaign data
   const fetchCampaignData = useCallback(async (campaignId, organizationId) => {
      // Validate required parameters
      if (!campaignId) {
         console.warn('No campaign ID provided for fetchCampaignData');
         return;
      }

      if (!organizationId) {
         console.warn('No organization ID provided for fetchCampaignData');
         return;
      }

      console.log('Starting to fetch campaign data for campaignId:', campaignId, 'organizationId:', organizationId);

      setLoading(true);
      setError(null);
      setCampaignId(campaignId);
      setOrganizationId(organizationId);

      try {
         // Step 1: Fetch campaign details first to get the campaign type
         console.log('Fetching campaign details...');
         const campaignDetailsResponse = await fetchCampaignDetails(campaignId);
         console.log("Campaign details received:", campaignDetailsResponse);

         if (!campaignDetailsResponse) {
            throw new Error('Failed to fetch campaign details');
         }

         // Step 2: Set campaign details state
         setCampaignDetails({
            campaignName: campaignDetailsResponse.external_name || "",
            internalName: campaignDetailsResponse.internal_name || "",
            goal: campaignDetailsResponse.goal || 0,
            url: campaignDetailsResponse.url || "",
            defaultDesignation: campaignDetailsResponse.default_designation || 0
         });

         // Step 2.5: Set question inputs state from backend data
         setQuestionInputs({
            phone: campaignDetailsResponse.show_phone || false,
            title: campaignDetailsResponse.show_title || false,
            suffix: campaignDetailsResponse.show_suffix || false,
            companyorganizationname: campaignDetailsResponse.show_company_name || false,
            websiteurl: campaignDetailsResponse.show_website_url || false
         });

         // Store original data for change tracking
         setOriginalData({
            campaignDetails: {
               campaignName: campaignDetailsResponse.external_name || "",
               internalName: campaignDetailsResponse.internal_name || "",
               goal: campaignDetailsResponse.goal || 0,
               url: campaignDetailsResponse.url || "",
               defaultDesignation: campaignDetailsResponse.default_designation || 0
            },
            questionInputs: {
               phone: campaignDetailsResponse.show_phone || false,
               title: campaignDetailsResponse.show_title || false,
               suffix: campaignDetailsResponse.show_suffix || false,
               companyorganizationname: campaignDetailsResponse.show_company_name || false,
               websiteurl: campaignDetailsResponse.show_website_url || false
            },
            selectedDesignations: [],
            tickets: [],
            faqs: [],
            customQuestions: []
         });

         const campaignType = campaignDetailsResponse.type || "";
         setCampaignType(campaignType);
         setCampaignStatus(campaignDetailsResponse.status || "");

         console.log('Campaign type determined:', campaignType);

         // Step 3: Fetch all the common data that every campaign type needs
         console.log('Fetching common campaign data...');
         
         // Fetch page sections (common to all campaigns)
         console.log('Fetching page sections...');
         const pageSectionsResponse = await fetchPageSections(campaignId);
         if (pageSectionsResponse) {
            setPageSections(pageSectionsResponse);
            console.log('Page sections set successfully');
         } else {
            console.warn('Failed to fetch page sections');
         }

         // Fetch thank you page (common to all campaigns)
         console.log('Fetching thank you page...');
         const thankYouPageResponse = await fetchThankYouPage(campaignId);
         if (thankYouPageResponse) {
            setThankYouPage(thankYouPageResponse);
            console.log('Thank you page set successfully');
         } else {
            console.warn('Failed to fetch thank you page');
         }

         // Fetch active designations (common to all campaigns)
         console.log('Fetching active designations...');
         const activeDesignationsResponse = await fetchActiveDesignations(organizationId);
         if (activeDesignationsResponse) {
            setActiveDesignations(activeDesignationsResponse);
            setDesignations(activeDesignationsResponse);
            console.log('Active designations set successfully');
         } else {
            console.warn('Failed to fetch active designations');
         }

         // Fetch custom questions (common to all campaigns)
         console.log('Fetching custom questions...');
         const customQuestionsResponse = await fetchCustomQuestions(campaignId);
         console.log("questions! ", customQuestionsResponse)
         if (customQuestionsResponse) {
            setCustomQuestions(customQuestionsResponse);
            console.log('Custom questions set successfully');
         } else {
            console.warn('Failed to fetch custom questions');
         }

         // Fetch campaign designations (common to all campaigns)
         console.log('Fetching campaign designations...');
         const campaignDesignationsResponse = await fetchCampaignDesignations(campaignId);
         if (campaignDesignationsResponse) {
            setCampaignDesignations(campaignDesignationsResponse);
            setSelectedDesignations(campaignDesignationsResponse);
            console.log('Campaign designations set successfully');
         } else {
            console.warn('Failed to fetch campaign designations');
         }

         // Fetch FAQs (common to all campaigns)
         console.log('Fetching FAQs...');
         const faqsResponse = await fetchFaqs(campaignId);
         if (faqsResponse) {
            setFaqs(faqsResponse);
            console.log('FAQs set successfully');
         } else {
            console.warn('Failed to fetch FAQs');
         }

         // Step 4: Fetch campaign type-specific data
         console.log('Fetching campaign type-specific data for type:', campaignType);
         
         if (campaignType === 'donation') {
            console.log('Donation campaign - no additional pages needed');
         }
         
         else if (campaignType === 'crowdfunding') {
            console.log('Crowdfunding campaign - fetching donation page...');
            const donationPageResponse = await fetchDonationPage(campaignId);
            if (donationPageResponse) {
               setDonationPage(donationPageResponse);
               console.log('Donation page set successfully for crowdfunding campaign');
            } else {
               console.warn('Failed to fetch donation page for crowdfunding campaign');
            }
         }
         
         else if (campaignType === 'peer-to-peer') {
            console.log('Peer-to-peer campaign - fetching peer landing page...');
            const peerLandingPageResponse = await fetchPeerLandingPage(campaignId);
            if (peerLandingPageResponse) {
               setPeerLandingPage(peerLandingPageResponse);
               console.log('Peer landing page set successfully');
            } else {
               console.warn('Failed to fetch peer landing page');
            }

            console.log('Peer-to-peer campaign - fetching peer fundraising page...');
            const peerFundraisingPageResponse = await fetchPeerFundraisingPage(campaignId);
            if (peerFundraisingPageResponse) {
               setPeerFundraisingPage(peerFundraisingPageResponse);
               console.log('Peer fundraising page set successfully');
            } else {
               console.warn('Failed to fetch peer fundraising page');
            }
         }
         
         else if (campaignType === 'ticketed-event') {
            console.log('Ticketed event campaign - fetching ticket page...');
            const ticketPageResponse = await fetchTicketPage(campaignId);
            if (ticketPageResponse) {
               setTicketPage(ticketPageResponse);
               console.log('Ticket page set successfully');
            } else {
               console.warn('Failed to fetch ticket page');
            }

            console.log('Ticketed event campaign - fetching ticket purchase page...');
            const ticketPurchasePageResponse = await fetchTicketPurchasePage(campaignId);
            if (ticketPurchasePageResponse) {
               setTicketPurchasePage(ticketPurchasePageResponse);
               console.log('Ticket purchase page set successfully');
            } else {
               console.warn('Failed to fetch ticket purchase page');
            }
         }
         
         else {
            console.warn('Unknown campaign type:', campaignType);
         }

         console.log('Campaign data fetching completed successfully');

         // Update original data with all fetched data for change tracking
         setOriginalData(prev => ({
            ...prev,
            selectedDesignations: campaignDesignationsResponse || [],
            tickets: [], // Will be updated when tickets are fetched
            faqs: faqsResponse || [],
            customQuestions: customQuestionsResponse || []
         }));

      } catch (err) {
         console.error('Error fetching campaign data:', err);
         setError(err.message || 'Failed to load campaign data');
         showError('Error', 'Failed to load campaign data. Please try again.');
      } finally {
         setLoading(false);
         console.log('Campaign data loading finished');
      }
   }, [fetchCampaignDetails, fetchPageSections, fetchThankYouPage, fetchTicketPage, fetchDonationPage, fetchPeerLandingPage, fetchPeerFundraisingPage, fetchTicketPurchasePage, fetchActiveDesignations, fetchCustomQuestions, fetchCampaignDesignations, fetchFaqs, showError]);

   const clearError = () => {
      setError(null);
   };

   // Calculate overall loading state by checking all individual loading states
   const isAnyLoading = loading || 
                       detailsLoading || 
                       sectionsLoading || 
                       thankYouLoading || 
                       ticketLoading || 
                       donationPageLoading || 
                       peerLandingLoading || 
                       peerFundraisingLoading || 
                       ticketPurchaseLoading || 
                       designationsLoading || 
                       questionsLoading || 
                       campaignDesignationsLoading || 
                       faqsLoading;

   const value = {
      // Campaign data
      campaignDetails,
      pageSections,
      thankYouPage,
      ticketPage,
      donationPage,
      peerLandingPage,
      peerFundraisingPage,
      ticketPurchasePage,
      activeDesignations,
      customQuestions,
      setCustomQuestions,
      campaignDesignations,
      
      // Loading and error states
      loading: isAnyLoading,
      error,
      clearError,
      
      // Main function to fetch campaign data
      fetchCampaignData,
      
      // Campaign edit functionality
      questionInputs,
      handleQuestionInputsChange,
      designations,
      selectedDesignations,
      setSelectedDesignations,
      tickets,
      setTickets,
      faqs,
      setFaqs,
      campaignType,
      campaignId,
      organizationId,
      campaignStatus,
      handleCampaignDetailsChange,
      
      // Global change tracking
      hasUnsavedChanges,
      markChangesAsSaved,
      checkForChanges,
      
      // Page-specific change tracking
      pageChanges,
      markPageChangesAsSaved,
      setPageHasChanges,
      
      // Wrapper setters with change tracking
      setSelectedDesignationsWithTracking,
      setTicketsWithTracking,
      setFaqsWithTracking,
      setCustomQuestionsWithTracking
   };

   return (
      <CampaignContext.Provider value={value}>
         {children}
      </CampaignContext.Provider>
   );
};
