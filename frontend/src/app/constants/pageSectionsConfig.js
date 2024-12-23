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

export const initialDonationPageSections = [
   {id: 0, name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <BannerSection />},
   {id: 1, name: "title", displayText: "Title Section", active: true, required: true, dropdown: false, content: <TitleSection />},
   {id: 2, name: "desc", displayText: "Description Section", active: true, required: true, dropdown: false, content: <DescSection />},
   // {id: 3, name: "donate", displayText: "Donate Section", active: true, required: true, dropdown: false, content: <DonateSection />},
]

export const initialThankyouPageSections = [
   {id: 0, name: "message", displayText: "Message Section", active: true, required: true, dropdown: false, content: <MessageSection />},
   {id: 1, name: "background", displayText: "Background Section", active: true, required: true, dropdown: false, content: <BackgroundSection />},
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
   {id: 1, name: "title", displayText: "Background Section", active: true, required: true, dropdown: false, content: <DonationFormBackgroundSection />},
   {id: 2, name: "desc", displayText: "Buttons Section", active: true, required: true, dropdown: false, content: <DonationFormButtonsSection />},
]

export const initialTicketPurchaseSections = [
   {id: 1, name: "title", displayText: "Title Section", active: true, required: true, dropdown: false, content: <TicketPurchaseTitleSection />},

]