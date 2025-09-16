import { useState } from "react";
import BannerSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/bannerSection";
import DescSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/descSection";
import DonateSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/donateSection";
import TitleSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/titleSection";
import BackgroundSection from "../org/[organizationId]/campaign/components/previews/thankPage/sections/backgroundSection";
import MessageSection from "../org/[organizationId]/campaign/components/previews/thankPage/sections/messageSection";
import LandingBanner from "../org/[organizationId]/campaign/components/previews/ticketLanding/sections/bannerSection";
import LandingAbout from "../org/[organizationId]/campaign/components/previews/ticketLanding/sections/aboutSection";
import PurchaseSection from "../org/[organizationId]/campaign/components/previews/ticketLanding/sections/purchaseSection";
import EventSection from "../org/[organizationId]/campaign/components/previews/ticketLanding/sections/eventSection";
import PeerLandingBannerSection from "../org/[organizationId]/campaign/components/previews/peerLanding/sections/bannerSections";
import DescriptionSection from "../org/[organizationId]/campaign/components/previews/peerLanding/sections/descriptionSections";
import PeerFundraisingBannerSection from "../org/[organizationId]/campaign/components/previews/peerFundraising/sections/bannerSection";
import PeerFundraisingDescritpionSection from "../org/[organizationId]/campaign/components/previews/peerFundraising/sections/descriptionSection";
import PeerFundraisingTitleSection from "../org/[organizationId]/campaign/components/previews/peerFundraising/sections/titleSections";
import DonationFormBackgroundSection from "../org/[organizationId]/campaign/components/previews/donationForm/sections/backgroundSection";
import DonationFormHeaderSection from "../org/[organizationId]/campaign/components/previews/donationForm/sections/headerSection";
import DonationFormButtonsSection from "../org/[organizationId]/campaign/components/previews/donationForm/sections/buttonsSection";
import TicketPurchaseTitleSection from "../org/[organizationId]/campaign/components/previews/ticketPurchase/sections/titleSection";
import MainSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/mainSection";
// Organization page sections (About, Footer, Header, Landing)
import AboutBannerSection from "../org/[organizationId]/page/about/components/sections/bannerSection";
import StorySection from "../org/[organizationId]/page/about/components/sections/storySection";
import WhatSection from "../org/[organizationId]/page/about/components/sections/whatSection";
import WhySection from "../org/[organizationId]/page/about/components/sections/whySection";
import TeamSection from "../org/[organizationId]/page/about/components/sections/teamSection";

import ContactSection from "../org/[organizationId]/page/footer/components/sections/contactSection";
import SocialSection from "../org/[organizationId]/page/footer/components/sections/socialSection";

import LogoSection from "../org/[organizationId]/page/header/components/sections/logoSection";

import LandingBannerSection from "../org/[organizationId]/page/landing/components/sections/bannerSection";
import LandingAboutSection from "../org/[organizationId]/page/landing/components/sections/aboutSection";
import LandingImpactSection from "../org/[organizationId]/page/landing/components/sections/impactSection";
import LargeTextSection from "../org/[organizationId]/page/landing/components/sections/largeTextSection";
import TripleSection from "../org/[organizationId]/page/landing/components/sections/tripleSection";

export const initialDonationPageSections = [
   {id: 0, name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <BannerSection />},
   {id: 1, name: "title", displayText: "Main Section", active: true, required: true, dropdown: false, content: <MainSection />},
   // {id: 2, name: "donate", displayText: "Donate Section", active: true, required: true, dropdown: false, content: <DonateSection />},
]

export const initialThankyouPageSections = [
   {id: 0, name: "message", displayText: "Message Section", active: true, required: true, dropdown: false, content: <MessageSection />},
   {id: 1, name: "background", displayText: "Background Section", active: false, required: false, dropdown: false, content: <BackgroundSection />},
]

export const initialTicketPageSections = [
   {id: 0, name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <LandingBanner />},
   {id: 1, name: "about", displayText: "About Section", active: true, required: true, dropdown: false, content: <LandingAbout />},
   {id: 2, name: "event", displayText: "Event Section", active: true, required: true, dropdown: false, content: <EventSection />},
   // {id: 3, name: "purchase", displayText: "Purchase Section", active: true, required: true, dropdown: false, content: <PurchaseSection />},
]

export const initialPeerLandingPageSections = [
   {id: 0, name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <PeerLandingBannerSection />},
   {id: 1, name: "description", displayText: "About Section", active: true, required: true, dropdown: false, content: <DescriptionSection />},
]

export const initialPeerFundraisingPageSections = [
   {id: 0, name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <PeerFundraisingBannerSection />},
   {id: 1, name: "title", displayText: "Title Section", active: true, required: true, dropdown: false, content: <PeerFundraisingTitleSection />},
   {id: 2, name: "desc", displayText: "Description Section", active: true, required: false, dropdown: false, content: <PeerFundraisingDescritpionSection />},
]

export const initialDonationFormSections = [
   {id: 0, name: "header", displayText: "Header Section", active: true, required: true, dropdown: false, content: <DonationFormHeaderSection />},
   {id: 1, name: "background", displayText: "Background Section", active: false, required: false, dropdown: false, content: <DonationFormBackgroundSection />},
   {id: 2, name: "buttons", displayText: "Buttons Section", active: true, required: false, dropdown: false, content: <DonationFormButtonsSection />},
]

export const initialTicketPurchaseSections = [
   {id: 1, name: "title", displayText: "Title Section", active: true, required: true, dropdown: false, content: <TicketPurchaseTitleSection />},

]

// Organization: About Page Sections
export const initialAboutPageSections = [
   {id: 0, name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <AboutBannerSection />},
   {id: 1, name: "story", displayText: "Our Story", active: true, required: false, dropdown: false, content: <StorySection />},
   {id: 2, name: "what", displayText: "What We Do", active: false, required: false, dropdown: false, content: <WhatSection />},
   {id: 3, name: "why", displayText: "Why We Do It", active: false, required: false, dropdown: false, content: <WhySection />},
   {id: 4, name: "team", displayText: "Our Team", active: false, required: false, dropdown: false, content: <TeamSection />},
]

// Organization: Footer Page Sections
export const initialFooterPageSections = [
   {id: 0, name: "contact", displayText: "Footer Contact", active: true, required: true, dropdown: false, content: <ContactSection />},
   {id: 1, name: "social", displayText: "Social Media", active: true, required: false, dropdown: false, content: <SocialSection />},
]

// Organization: Header Page Sections
export const initialHeaderPageSections = [
   {id: 0, name: "logo", displayText: "Logo & Branding", active: true, required: true, dropdown: false, content: <LogoSection />},
]

// Organization: Landing Page Sections
export const initialLandingPageSections = [
   {id: 0, name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <LandingBannerSection />},
   {id: 1, name: "main", displayText: "Main Section", active: false, required: false, dropdown: false, content: <LargeTextSection />},
   {id: 2, name: "about", displayText: "About Section", active: false, required: false, dropdown: false, content: <LandingAboutSection />},
   {id: 3, name: "impact", displayText: "Impact Section", active: false, required: false, dropdown: false, content: <LandingImpactSection />},
   {id: 4, name: "featured", displayText: "Featured Campaign", active: false, required: false, dropdown: false, content: <LandingImpactSection />},
   {id: 5, name: "triple", displayText: "Triple Section", active: false, required: false, dropdown: false, content: <TripleSection />},
]