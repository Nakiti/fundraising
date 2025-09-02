"use client";
import { createContext, useEffect, useState, useCallback } from "react";
import { 
  getCampaignService, 
  getPageService, 
  getDesignationService, 
  useToast,
  getContentService
} from "../services";

export const CampaignContext = createContext();

export const CampaignContextProvider = ({ children }) => {
   // Campaign data state
   const [campaignDetails, setCampaignDetails] = useState(null);
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

   // Get service instances


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
      if (['defaultDesignation'].includes(name)) {
         setPageHasChanges('designations', true);
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
   const fetchCampaignData = async (campaignId, organizationId) => {
      const campaignService = getCampaignService();
      const pageService = getPageService();
      const designationService = getDesignationService();
      const contentService = getContentService();

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
         const campaignDetailsResponse = await campaignService.getCampaignDetails(campaignId);
         console.log("Campaign details received:", campaignDetailsResponse);

         if (!campaignDetailsResponse) {
            throw new Error('Failed to fetch campaign details');
         }

         console.log("campaignDetailsResponse", campaignDetailsResponse)

         // Step 2: Set campaign details state
         setCampaignDetails({
            campaignName: campaignDetailsResponse.data.external_name || "",
            internalName: campaignDetailsResponse.data.internal_name || "",
            goal: campaignDetailsResponse.data.goal || 0,
            url: campaignDetailsResponse.data.url || "",
            defaultDesignation: campaignDetailsResponse.data.default_designation || 0
         });

         // Step 2.5: Set question inputs state from backend data
         setQuestionInputs({
            phone: campaignDetailsResponse.data.show_phone || false,
            title: campaignDetailsResponse.data.show_title || false,
            suffix: campaignDetailsResponse.data.show_suffix || false,
            companyorganizationname: campaignDetailsResponse.data.show_company_name || false,
            websiteurl: campaignDetailsResponse.data.show_website_url || false
         });

         // Store original data for change tracking
         setOriginalData({
            campaignDetails: {
               campaignName: campaignDetailsResponse.data.external_name || "",
               internalName: campaignDetailsResponse.data.internal_name || "",
               goal: campaignDetailsResponse.data.goal || 0,
               url: campaignDetailsResponse.data.url || "",
               defaultDesignation: campaignDetailsResponse.data.default_designation || 0
            },
            questionInputs: {
               phone: campaignDetailsResponse.data.show_phone || false,
               title: campaignDetailsResponse.data.show_title || false,
               suffix: campaignDetailsResponse.data.show_suffix || false,
               companyorganizationname: campaignDetailsResponse.data.show_company_name || false,
               websiteurl: campaignDetailsResponse.data.show_website_url || false
            },
            selectedDesignations: [],
            tickets: [],
            faqs: [],
            customQuestions: []
         });

         const campaignType = campaignDetailsResponse.data.type || "";
         setCampaignType(campaignType);
         setCampaignStatus(campaignDetailsResponse.data.status || "");

         // Step 3: Fetch all the common data that every campaign type needs
         

         // Fetch active designations (common to all campaigns)
         const activeDesignationsResponse = await designationService.getActiveDesignations(organizationId);
         if (activeDesignationsResponse) {
            setActiveDesignations(activeDesignationsResponse.data);
            setDesignations(activeDesignationsResponse.data);
         } else {
            console.warn('Failed to fetch active designations');
            setDesignations([]); // Ensure designations is always an array
         }

         // Fetch custom questions (common to all campaigns)
         const customQuestionsResponse = await contentService.getCustomQuestions(campaignId);
         if (customQuestionsResponse) {
            setCustomQuestions(customQuestionsResponse.data);
         } else {
            console.warn('Failed to fetch custom questions');
         }

         // Fetch campaign designations (common to all campaigns)
         const campaignDesignationsResponse = await designationService.getDesignationsByCampaign(campaignId);
         console.log("campaignDesignationsResponse", campaignDesignationsResponse)
         if (campaignDesignationsResponse) {
            setCampaignDesignations(campaignDesignationsResponse.data);
            setSelectedDesignations(campaignDesignationsResponse.data);
         } else {
            console.warn('Failed to fetch campaign designations');
         }

         // Fetch FAQs (common to all campaigns)
         const faqsResponse = await campaignService.getFaqs(campaignId);
         if (faqsResponse) {
            setFaqs(faqsResponse.data);
         } else {
            console.warn('Failed to fetch FAQs');
         }

         // Step 4: Fetch campaign type-specific data
         
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
      }
   };

   const clearError = () => {
      setError(null);
   };

   const value = {
      // Campaign data
      campaignDetails,
      activeDesignations,
      customQuestions,
      setCustomQuestions,
      campaignDesignations,
      
      // Loading and error states
      loading,
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
