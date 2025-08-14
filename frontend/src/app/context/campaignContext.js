"use client";
import { createContext, useEffect, useState } from "react";
import { Services, useApi, useToast } from "../services";

export const CampaignContext = createContext();

export const CampaignContextProvider = ({ children }) => {
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
   
   // Additional state for campaign edit functionality
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
   const [campaignStatus, setCampaignStatus] = useState("");

   const { showError } = useToast();

   // API hooks for data fetching
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
   };

   const handleCampaignDetailsChange = (e) => {
      const { name, value } = e.target;
      setCampaignDetails(prev => ({
         ...prev,
         [name]: value
      }));
   };

   // Helper function to determine which pages to fetch based on campaign type
   const getPagesToFetch = (campaignType) => {
      const basePages = [
         fetchPageSections(campaignId),
         fetchThankYouPage(campaignId),
         fetchActiveDesignations(),
         fetchCustomQuestions(campaignId),
         fetchCampaignDesignations(campaignId),
         fetchFaqs(campaignId)
      ];

      switch (campaignType) {
         case 'donation':
            return [...basePages];
         
         case 'crowdfunding':
            return [...basePages, fetchDonationPage(campaignId)];
         
         case 'peer-to-peer':
            return [...basePages, fetchPeerLandingPage(campaignId), fetchPeerFundraisingPage(campaignId)];
         
         case 'ticketed-event':
            return [...basePages, fetchTicketPage(campaignId), fetchTicketPurchasePage(campaignId)];
         
         default:
            return basePages;
      }
   };

   const fetchCampaignData = async (campaignId) => {
      if (!campaignId) return;

      setLoading(true);
      setError(null);
      setCampaignId(campaignId);

      try {
         // First, fetch campaign details to determine the type
         const detailsResponse = await fetchCampaignDetails(campaignId);
         
         if (detailsResponse) {
            setCampaignDetails(detailsResponse);
            const campaignType = detailsResponse.campaignType || "";
            setCampaignType(campaignType);
            setCampaignStatus(detailsResponse.status || "");

            // Now fetch only the relevant pages based on campaign type
            const pagesToFetch = getPagesToFetch(campaignType);
            
            const [
               sectionsResponse,
               thankYouResponse,
               ...otherResponses
            ] = await Promise.allSettled(pagesToFetch);

            // Handle base page responses
            if (sectionsResponse.status === 'fulfilled' && sectionsResponse.value) {
               setPageSections(sectionsResponse.value);
            }

            if (thankYouResponse.status === 'fulfilled' && thankYouResponse.value) {
               setThankYouPage(thankYouResponse.value);
            }

            // Handle type-specific page responses
            let responseIndex = 2; // Start after sections and thank you page

            // Handle designations
            if (otherResponses[responseIndex]?.status === 'fulfilled' && otherResponses[responseIndex]?.value) {
               setActiveDesignations(otherResponses[responseIndex].value);
               setDesignations(otherResponses[responseIndex].value);
            }
            responseIndex++;

            // Handle custom questions
            if (otherResponses[responseIndex]?.status === 'fulfilled' && otherResponses[responseIndex]?.value) {
               setCustomQuestions(otherResponses[responseIndex].value);
            }
            responseIndex++;

            // Handle campaign designations
            if (otherResponses[responseIndex]?.status === 'fulfilled' && otherResponses[responseIndex]?.value) {
               setCampaignDesignations(otherResponses[responseIndex].value);
               setSelectedDesignations(otherResponses[responseIndex].value);
            }
            responseIndex++;

            // Handle FAQs
            if (otherResponses[responseIndex]?.status === 'fulfilled' && otherResponses[responseIndex]?.value) {
               setFaqs(otherResponses[responseIndex].value);
            }
            responseIndex++;

            // Handle type-specific pages
            switch (campaignType) {
               case 'crowdfunding':
                  if (otherResponses[responseIndex]?.status === 'fulfilled' && otherResponses[responseIndex]?.value) {
                     setDonationPage(otherResponses[responseIndex].value);
                  }
                  break;
               
               case 'peer-to-peer':
                  if (otherResponses[responseIndex]?.status === 'fulfilled' && otherResponses[responseIndex]?.value) {
                     setPeerLandingPage(otherResponses[responseIndex].value);
                  }
                  responseIndex++;
                  if (otherResponses[responseIndex]?.status === 'fulfilled' && otherResponses[responseIndex]?.value) {
                     setPeerFundraisingPage(otherResponses[responseIndex].value);
                  }
                  break;
               
               case 'ticketed-event':
                  if (otherResponses[responseIndex]?.status === 'fulfilled' && otherResponses[responseIndex]?.value) {
                     setTicketPage(otherResponses[responseIndex].value);
                  }
                  responseIndex++;
                  if (otherResponses[responseIndex]?.status === 'fulfilled' && otherResponses[responseIndex]?.value) {
                     setTicketPurchasePage(otherResponses[responseIndex].value);
                  }
                  break;
            }

            // Handle rejected promises
            const allResponses = [sectionsResponse, thankYouResponse, ...otherResponses];
            const rejectedPromises = allResponses.filter(promise => promise.status === 'rejected');

            if (rejectedPromises.length > 0) {
               showError('Data Loading Error', 'Some campaign data failed to load. Please refresh the page.');
            }
         }

      } catch (err) {
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
      loading: loading || detailsLoading || sectionsLoading || thankYouLoading || 
               ticketLoading || donationPageLoading || peerLandingLoading || 
               peerFundraisingLoading || ticketPurchaseLoading || designationsLoading || 
               questionsLoading || campaignDesignationsLoading || faqsLoading,
      error,
      clearError,
      fetchCampaignData,
      // Additional properties for campaign edit functionality
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
      campaignStatus,
      handleCampaignDetailsChange
   };

   return (
      <CampaignContext.Provider value={value}>
         {children}
      </CampaignContext.Provider>
   );
};
