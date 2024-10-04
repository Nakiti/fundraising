"use client"
import { getAllCampaigns, getOrganization } from "@/app/services/fetchService.js";
import { useEffect, useState, useRef } from "react";
import Card from "./components/card";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const Organization = ({ params }) => {
  const organizationId = params.organizationId;
  const [organization, setOrganization] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const campaignsRef = useRef(null)

   const scrollToCampaigns = () => {
      if (campaignsRef.current) {
      campaignsRef.current.scrollIntoView({ behavior: "smooth" });
      }
   };

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
      <div className="bg-white min-h-screen">
         <div className="container mx-auto px-12 py-12">
            {/* Heading */}
            <h1 className="text-5xl font-bold text-gray-800 text-center mb-6">My Organization Name</h1>

            {/* Description */}
            <p className="text-lg text-gray-600 text-center mb-8 w-full md:w-2/3 lg:w-1/2 mx-auto">
               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            {/* Buttons */}
            <div className="flex justify-center space-x-4 mb-10">
               <button onClick={scrollToCampaigns} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition">Donate</button>
               <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition">Share</button>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
               <img 
                  className="w-full h-64 object-cover rounded-lg shadow-lg transform transition hover:scale-105"
                  src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg" 
                  alt="Image 1" 
               />
               <img 
                  className="w-full h-64 object-cover rounded-lg shadow-lg transform transition hover:scale-105"
                  src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
                  alt="Image 2" 
               />
               <img 
                  className="w-full h-64 object-cover rounded-lg shadow-lg transform transition hover:scale-105"
                  src="https://www.shutterstock.com/image-photo/beautiful-pink-flower-anemones-fresh-260nw-1028135845.jpg"
                  alt="Image 3" 
               />
               <img 
                  className="w-full h-64 object-cover rounded-lg shadow-lg transform transition hover:scale-105"
                  src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
                  alt="Image 4" 
               />
            </div>

            {/* Active Campaigns */}
            <div id="campaigns" className="mt-12" ref={campaignsRef}>
               <h2 className="text-3xl font-semibold mb-8 text-gray-800">Active Campaigns:</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
