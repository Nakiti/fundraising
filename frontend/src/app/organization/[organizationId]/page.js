"use client"
import { getCampaignsFiltered, getLandingPage, getOrganization } from "@/app/services/fetchService.js";
import { useEffect, useState, useRef } from "react";
import Card from "./components/card";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const Organization = ({ params }) => {
  const organizationId = params.organizationId;
  const [organization, setOrganization] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const campaignsRef = useRef(null)
  const [visibleCampaigns, setVisibleCampaigns] = useState(3)
  const [landingPageStyles, setLandingPageStyles] = useState(null)

   const showMoreCampaigns = () => {
      setVisibleCampaigns((prev) => prev + 3);
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

        const landingPageResponse = await getLandingPage(organizationId)
        setLandingPageStyles(landingPageResponse)

        console.log(landingPageResponse)
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [organizationId]);

   return (
      <div 
         className="bg-gray-50 min-h-screen"
         style={{backgroundColor: landingPageStyles && landingPageStyles.bg_color}}
      >
         {organization && landingPageStyles && <div className="container mx-auto">
            <div className="relative w-full">
               <img
                  className="w-full object-cover"
                  style={{height: "550px"}}
                  src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                  alt="Organization"
               />
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 bg-black bg-opacity-50">
                  <h1 style={{color: landingPageStyles.p_color}} className="text-6xl font-semibold text-white">Our Organization</h1>
                  <p style={{color: landingPageStyles.p_color}} className="text-lg text-gray-200 w-11/12 md:w-2/3 lg:w-1/2 mx-auto">
                     {landingPageStyles.description}
                  </p>
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
            <div className="flex flex-row w-full px-8 mt-12 space-x-12">
               <div className="w-2/3">
                  <h1 className="text-5xl font-bold text-blue-800">YOUR HEADLINE</h1>
                  <p className="text-xl text-gray-700 mt-8">
                     As UCLA moves into its second century, we look back on the achievements and accomplishments that have made us the No. 1 public research university in the nation—and with your help, we look forward to a new era of innovation and transformation.
                  </p>
                  <p className="text-xl text-gray-700 mt-8">
                     Now, more than ever, your support is essential to enabling UCLA’s excellence across all disciplines, along with sustaining our university’s mission of education, research and service. It demonstrates confidence in our ability to adapt during this time of growth and transition—tackling the major challenges facing our communities and helping to build a better, brighter future with Bruins leading the way.
                  </p>
                  <p className="text-xl text-gray-700 mt-8">
                     Now, more than ever, your support is essential to enabling UCLA’s excellence across all disciplines, along with sustaining our university’s mission of education, research and service. It demonstrates confidence in our ability to adapt during this time of growth and transition—tackling the major challenges facing our communities and helping to build a better, brighter future with Bruins leading the way.
                  </p>
               </div>
               <div className="w-1/3">
                  <h1 className="text-2xl font-bold text-center mt-12">Featured Campaigns:</h1>
                  <div className="mt-6 space-y-4">
                     <div className="flex flex-row items-center shadow-sm border border-gray-400 rounded-md"> 
                        <img 
                           src="404image" 
                           className="h-16 w-16 rounded-lg mr-4 object-cover border-2 border-dashed"
                        />
                        <p className="text-lg">Campaign Name</p>
                     </div>
                     <div className="flex flex-row items-center shadow-sm border border-gray-400 rounded-md"> 
                        <img 
                           src="404image" 
                           className="h-16 w-16 rounded-lg mr-4 object-cover border-2 border-dashed"
                        />
                        <p className="text-lg">Campaign Name</p>
                     </div>
                     <div className="flex flex-row items-center shadow-sm border border-gray-400 rounded-md"> 
                        <img 
                           src="404image" 
                           className="h-16 w-16 rounded-lg mr-4 object-cover border-2 border-dashed"
                        />
                        <p className="text-lg">Campaign Name</p>
                     </div>
                  </div>
                  <button className="text-md w-full px-10 py-3 bg-blue-800 text-white rounded-md mt-8">Explore Campaigns</button>
               </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-12 justify-between w-full py-8 px-8 mt-16">
               <div className="md:w-1/2 space-y-6">
                  <h2 style={{color: landingPageStyles.s_color}} className="text-3xl text-gray-800">
                     About Our Organization
                  </h2>
                  <p style={{color: landingPageStyles.s_color}} className="text-lg text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore                  </p>
                  <button 
                     className="bg-blue-600 hover:bg-blue-700 text-white py-2 text-md px-8 rounded-sm transition">
                     Learn More
                  </button>
               </div>
               <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
                  <img
                     className="w-full h-80 object-cover rounded-sm"
                     src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                     alt="About Us"
                  />
               </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-12 mt-16 justify-between w-full px-8">
               <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
                  <img
                     className="w-full h-80 object-cover rounded-sm"
                     src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                     alt="About Us"
                  />
               </div>
               <div className="md:w-1/2 space-y-6 ">
                  <h2 style={{color: landingPageStyles.s_color}} className="text-3xl text-gray-800 ">
                     Our Impact
                  </h2>
                  <p style={{color: landingPageStyles.s_color}} className="text-lg text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore                  </p>
                  <button 
                     // onClick={() => router.push('/about')} 
                     className="bg-blue-600 hover:bg-blue-700 text-white py-2 text-md px-8 rounded-sm transition">
                     Learn More
                  </button>
               </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-12 justify-between w-full py-8 px-8 mt-16">
               <div className="md:w-1/2 space-y-6">
                  <h2 style={{color: landingPageStyles.s_color}} className="text-3xl text-gray-800">
                     About Our Organization
                  </h2>
                  <p style={{color: landingPageStyles.s_color}} className="text-lg text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore                  </p>
                  <button 
                     // onClick={() => router.push('/about')} 
                     className="bg-blue-600 hover:bg-blue-700 text-white py-2 text-md px-8 rounded-sm transition">
                     Learn More
                  </button>
               </div>

               <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
                  <img
                     className="w-full h-80 object-cover rounded-sm"
                     src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                     alt="About Us"
                  />
               </div>
            </div>
            <div className="mx-8 grid grid-cols-3 gap-16 mt-16">
               <div className="flex flex-col">
                  <img
                     className="w-full h-48 object-cover rounded-sm"
                     src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                     alt="About Us"
                  />
                  <h1 className="text-2xl my-4 text-blue-800">Title</h1>
                  <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis</p>
               </div>
               <div className="flex flex-col">
                  <img
                     className="w-full h-48 object-cover rounded-sm"
                     src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                     alt="About Us"
                  />
                  <h1 className="text-2xl my-4 text-blue-800">Title</h1>
                  <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis</p>
               </div>
               <div className="flex flex-col">
                  <img
                     className="w-full h-48 object-cover rounded-sm"
                     src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                     alt="About Us"
                  />
                  <h1 className="text-2xl my-4 text-blue-800">Title</h1>
                  <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis</p>
               </div>
            </div>
            <div className="mt-24 mx-8 pb-12" ref={campaignsRef}>
               <h2 className="text-3xl mb-8 text-gray-800 ">Active Campaigns:</h2>
               <div className="grid grid-cols-3 gap-6">
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
         </div>}

         <footer className="bg-blue-800 px-12 py-8">
            <p className="text-white">Contact: sdfsdfsdfdsf</p>
         </footer>
      </div>
   );
};

export default Organization;
