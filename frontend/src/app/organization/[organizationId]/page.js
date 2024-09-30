"use client"
import { getAllCampaigns, getOrganization } from "@/app/services/fetchService.js";
import { useEffect, useState } from "react";
import Card from "./card";
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation, Autoplay} from "swiper/modules"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/autoplay"
import Header from "./components/header";

const Organization = ({ params }) => {
  const organizationId = params.organizationId;
  const [organization, setOrganization] = useState(null);
  const [campaigns, setCampaigns] = useState(null);

  const images = [
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    "https://www.shutterstock.com/image-photo/beautiful-pink-flower-anemones-fresh-260nw-1028135845.jpg",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationResponse = await getOrganization(organizationId);
        setOrganization(organizationResponse);

        const campaignResponse = await getAllCampaigns(organizationId);
        setCampaigns(campaignResponse);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [organizationId]);

   return (
      <div>
         <Header />
         <div className="flex flex-col justify-center w-full max-w-full">
            {/* Heading */}
            {organization && <h1 className="text-5xl font-bold text-gray-800 mb-4 mt-8 text-center w-full">{organization.name}</h1>}

            {/* Description */}
            {organization && <p className="text-lg text-gray-700 mb-6 w-3/4 mx-auto">{organization.description}"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>}

            {/* Image Slideshow */}
            <div className="w-full mb-8">
            <Swiper
               modules={[Navigation, Autoplay]}
               spaceBetween={30}
               slidesPerView={1}
               centeredSlides={true}
               navigation={true}
               loop={true}
               autoplay={{ delay: 10000 }}
            >
               {images.map((image, index) => (
                  <SwiperSlide key={index}>
                  <img
                     src={image}
                     alt={`Slide ${index + 1}`}
                     className="w-full h-screen object-cover"
                  />
                  </SwiperSlide>
               ))}
            </Swiper>
            </div>

            {/* Active Campaigns */}
            <div className="w-11/12 mx-auto">
            <h2 className="font-bold text-2xl mb-4">Active Campaigns:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
               {campaigns ? (
                  campaigns.map((campaign) => (
                  <Card key={campaign.id} {...campaign} organizationId={organizationId} />
                  ))
               ) : (
                  <p className="text-gray-500">No active campaigns available.</p>
               )}
            </div>
            </div>
         </div>
      </div>
   );
};

export default Organization;
