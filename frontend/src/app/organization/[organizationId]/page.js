"use client"
import { getAllCampaigns, getCampaignsFiltered, getOrganization } from "@/app/services/fetchService.js";
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
  const [visibleCampaigns, setVisibleCampaigns] = useState(4)

   const showMoreCampaigns = () => {
      setVisibleCampaigns((prev) => prev + 4); // Show 4 more campaigns on each click
   };

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

        const campaignResponse = await getCampaignsFiltered(organizationId, "active");
        setCampaigns(campaignResponse);

        console.log(campaignResponse)
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [organizationId]);

   return (
      <div className="bg-gray-50 min-h-screen">
         <div className="container mx-auto">
            {/* Heading */}
            <div className="relative w-full">
               {/* Image */}
               <img
                  className="w-full object-cover"
                  style={{height: "450px"}}
                  src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
                  alt="Organization"
               />

               {/* Overlay Content */}
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 bg-black bg-opacity-50">
                  {/* Organization Name */}
                  {organization && <h1 className="text-6xl font-semibold text-white">The Giving Foundation</h1>}

                  {/* Description */}
                  <p className="text-lg text-gray-200 w-11/12 md:w-2/3 lg:w-1/2 mx-auto">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>

                  {/* Buttons */}
                  <div className="flex justify-center space-x-4">
                     <button onClick={scrollToCampaigns} className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition">
                        Donate
                     </button>
                     <button className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition">
                        Share
                     </button>
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-x-8 justify-between w-full py-16 px-16">
               {/* Left Column: Text and Button */}
               <div className="md:w-1/2 space-y-6">
                  <h2 className="text-3xl text-gray-800">
                     About Our Organization
                  </h2>
                  <p className="text-md text-gray-600">
                     We are dedicated to making a difference in the community by supporting a wide range of causes. Our mission is to help those in need and create a positive impact through our various campaigns.
                  </p>
                  <button 
                     // onClick={() => router.push('/about')} 
                     className="bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm px-8 rounded-sm transition">
                     Learn More
                  </button>
               </div>

               {/* Right Column: Image */}
               <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
                  <img
                     className="w-full h-auto object-cover rounded-lg shadow-lg"
                     src="https://via.placeholder.com/500x300"
                     alt="About Us"
                  />
               </div>
            </div>


            {/* Active Campaigns */}
            <div id="campaigns" className="mt-8 mx-16 pb-12" ref={campaignsRef}>
               <h2 className="text-3xl mb-8 text-gray-800">Active Campaigns:</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 w-5/6 mx-auto">
               {campaigns && campaigns.length > 0 ? (
                  campaigns.slice(0, visibleCampaigns).map((campaign) => (
                     <Card key={campaign.id} {...campaign} organizationId={organizationId} />
                  ))
               ) : (
                  <p className="text-gray-500">No active campaigns available.</p>
               )}
               </div>
               {campaigns && visibleCampaigns < campaigns.length && (
                  <div className="flex justify-center mt-8">
                     <button 
                        onClick={showMoreCampaigns} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition">
                        Show More
                     </button>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default Organization;
