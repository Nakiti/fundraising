import { useState } from "react";
import BannerSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/bannerSection";
import DescSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/descSection";
import DonateSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/donateSection";
import TitleSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/titleSection";
import BackgroundSection from "../org/[organizationId]/campaign/components/previews/thankPage/sections/backgroundSection";
import MessageSection from "../org/[organizationId]/campaign/components/previews/thankPage/sections/messageSection";
import LandingBanner from "../org/[organizationId]/campaign/components/previews/landingPage/sections/bannerSection";
import LandingAbout from "../org/[organizationId]/campaign/components/previews/landingPage/sections/aboutSection";
import PurchaseSection from "../org/[organizationId]/campaign/components/previews/landingPage/sections/purchaseSection";
import EventSection from "../org/[organizationId]/campaign/components/previews/landingPage/sections/eventSection";


export const [donationPageSections, setDonationPageSections] = useState([
   {id: 0, name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <BannerSection />},
   {id: 1, name: "title", displayText: "Title Section", active: true, required: true, dropdown: false, content: <TitleSection />},
   {id: 2, name: "desc", displayText: "Description Section", active: true, required: false, dropdown: false, content: <DescSection />},
   {id: 3, name: "donate", displayText: "Donate Section", active: true, required: true, dropdown: false, content: <DonateSection />},
])

export const [thankyouPageSections, setThankyouPageSections] = useState([
   {name: "message", displayText: "Message Section", active: true, required: true, dropdown: false, content: <MessageSection />},
   {name: "background", displayText: "Background Section", active: true, required: true, dropdown: false, content: <BackgroundSection />},
])

export const [ticketPageSections, setTicketPageSections] = useState([
   {id: 0, name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <LandingBanner />},
   {id: 1, name: "about", displayText: "About Section", active: true, required: true, dropdown: false, content: <LandingAbout />},
   {id: 1, name: "event", displayText: "Event Section", active: true, required: true, dropdown: false, content: <EventSection />},
   {id: 2, name: "purchase", displayText: "Purchase Section", active: true, required: true, dropdown: false, content: <PurchaseSection />},
])
