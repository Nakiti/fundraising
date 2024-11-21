"use client"
import { useState, useContext } from 'react';
import { IoIosClose } from "react-icons/io";
import { createCampaign, createCampaignDetails, createPageSection, createThankYouPage } from '@/app/services/createServices';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/context/authContext';
import { createDonationPage, createPreview } from '@/app/services/campaignService';

const Modal = ({show, setShow, organizationId}) => {
   const [activeTab, setActiveTab] = useState(0);
   const router = useRouter()
   const {currentUser} = useContext(AuthContext)

   const tabContent = [
      { title: 'Donation Form', content: 'donation' },
      { title: 'Crowdfunding', content: 'crowdfunding' },
      { title: 'Peer to Peer', content: 'peer-to-peer' },
      { title: 'Ticketed Event', content: 'ticketed-event' },
   ];

   const handleClick = async (type) => {
      try {
         const id = await createCampaign(currentUser, organizationId)
         console.log(currentUser)
         await createCampaignDetails(id, currentUser, tabContent[activeTab].content)

         if (tabContent[activeTab].content == "donation") {
            const donationPageId = await createDonationPage(id, currentUser)
            const thankyouPageId = await createThankYouPage(id, currentUser)

            console.log("donationidsf, ", donationPageId)

            await createPageSection(donationPageId, "banner", true, currentUser)
            await createPageSection(donationPageId, "title", true, currentUser)
            await createPageSection(donationPageId, "desc", true, currentUser)
            await createPageSection(donationPageId, "donate", true, currentUser)

            await createPageSection(thankyouPageId, "message", true, currentUser)
            await createPageSection(thankyouPageId, "background", true, currentUser)
         } else if (tabContent[activeTab].content == "crowdfunding") { 
         
         } else if (tabContent[activeTab].content == "peer-to-peer") { 
         
         } else {

         }



         router.push(`/org/${organizationId}/campaign/edit/${id}/details/about`)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center z-50">
         <div className='bg-blue-800 p-6 w-2/3 rounded-t-lg flex flex-row justify-between'>
            <h2 className='text-white text-2xl'>Create New Camapign</h2>
            <button className='text-white' onClick={() => setShow(false)}><IoIosClose className='h-8 w-8'/></button>
         </div>
         <div className="bg-white w-2/3 rounded-b-lg shadow-lg flex overflow-hidden min-h-96">
            <div className="w-1/4 py-6">
               {tabContent.map((tab, index) => (
                  <button
                     key={index}
                     onClick={() => setActiveTab(index)}
                     className={`block w-full text-left py-4 px-4 mb-2 text-md ${
                        activeTab === index
                           ? 'bg-blue-100 border-l-4 border-blue-800 font-semibold'
                           : 'text-gray-700'
                     }`}
                  >
                     {tab.title}
                  </button>
               ))}
            </div>
            <div className="w-3/4 px-6 py-6 bg-gray-200">
               <h2 className="text-2xl font-semibold mb-4">{tabContent[activeTab].title}</h2>
               <p className="text-gray-700">{tabContent[activeTab].content}</p>
               <button onClick={() => handleClick(tabContent[activeTab].content)}>
                  <p className="bg-blue-700 py-3 px-8 mt-64 ml-56 rounded-md text-md text-white text-center w-48">Create</p>
               </button> 
            </div>
         </div>
      </div>
   );
};

export default Modal;
