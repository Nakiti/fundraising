"use client"
import { useState, useContext, act } from 'react';
import { IoIosClose } from "react-icons/io";
import { createCampaign, createCampaignDetails, createDonationForm, createPageSection, createDonationPage, createPeerFundraisingPage, createPeerLandingPage, createThankYouPage, createTicketPage, createTicketPurchasePage } from '@/app/services/createServices';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/context/authContext';

/*
   Component: Modal
   Description: A modal that allows the user to create campaigns of varying types
   Props:
      setShow: controls the state of the modal
      organizationId: id of the organization
*/
const Modal = ({setShow, organizationId }) => {
   const [activeTab, setActiveTab] = useState(0);
   const router = useRouter();
   const { currentUser } = useContext(AuthContext);
   const [internalName, setInternalName] = useState("");
   const [error, setError] = useState(false);

   const tabContent = [
      { title: 'Donation Form', content: 'donation' },
      { title: 'Crowdfunding', content: 'crowdfunding' },
      { title: 'Peer to Peer', content: 'peer-to-peer' },
      { title: 'Ticketed Event', content: 'ticketed-event' },
   ];

   /*
      Description: Depending on the type of campaign that is created, pages corresponding to that campaign
                  type are created
                  Donation Form and Thank You Page are created for all campaign Types
   */
   /*
      Currently page sections are created but not used. They are created to potentially give the user to
      enable and disable components of the display
   */
   const handleClick = async () => {
      if (internalName === "") {
         setError(true)
         return
      }
      setError(false)

      try {
         const id = await createCampaign(currentUser, organizationId);
         await createCampaignDetails(id, currentUser, tabContent[activeTab].content, internalName);

         if (tabContent[activeTab].content === "crowdfunding") {
            const donationPageId = await createDonationPage(id, currentUser);

            await createPageSection(donationPageId, "banner", true, currentUser);
            await createPageSection(donationPageId, "title", true, currentUser);
            await createPageSection(donationPageId, "desc", true, currentUser);
            await createPageSection(donationPageId, "donate", true, currentUser);

         } else if (tabContent[activeTab].content == "ticketed-event") {
            const ticketPageId = await createTicketPage(id, currentUser)
            const ticketPurchasePageId = await createTicketPurchasePage(id, currentUser)

            await createPageSection(ticketPageId, "banner", true, currentUser)
            await createPageSection(ticketPageId, "about", true, currentUser)
            await createPageSection(ticketPageId, "event", true, currentUser)

            console.log(ticketPurchasePageId)
            await createPageSection(ticketPurchasePageId, "title", true, currentUser)
         } else if (tabContent[activeTab].content == "peer-to-peer") {
            const peerLandingPageId = await createPeerLandingPage(id, currentUser)
            const peerFundraisingPageId = await createPeerFundraisingPage(id, currentUser)

            console.log("pageid", peerFundraisingPageId)

            await createPageSection(peerLandingPageId, "banner", true, currentUser);
            await createPageSection(peerLandingPageId, "description", true, currentUser);

            await createPageSection(peerFundraisingPageId, "banner", true, currentUser);
            await createPageSection(peerFundraisingPageId, "description", true, currentUser);
            await createPageSection(peerFundraisingPageId, "title", true, currentUser);
            // await createPageSection(peerFundraisingPageId, "description", true, currentUser);

         }
         const donationFormId = await createDonationForm(id, currentUser)
         await createPageSection(donationFormId, "header", currentUser)
         await createPageSection(donationFormId, "background", currentUser)
         await createPageSection(donationFormId, "buttons", currentUser)

         const thankyouPageId = await createThankYouPage(id, currentUser);
         await createPageSection(thankyouPageId, "message", true, currentUser);
         await createPageSection(thankyouPageId, "background", true, currentUser);

         router.push(`/org/${organizationId}/campaign/edit/${id}/details/about`);
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center z-50">
         <div className="bg-blue-800 p-6 w-2/3 rounded-t-lg flex flex-row justify-between">
            <h2 className="text-white text-2xl">Create New Campaign</h2>
            <button className="text-white" onClick={() => setShow(false)}>
               <IoIosClose className="h-8 w-8" />
            </button>
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
            <div className="w-3/4 px-6 py-6 bg-gray-100 flex flex-col">
               <h2 className="text-2xl font-semibold mb-4">{tabContent[activeTab].title}</h2>
               <div className='mt-4 mb-8 text-gray-700'>
                  {tabContent[activeTab].content == "donation" ? 
                     <p>Create a standard donation form that allows users to donate funds while collecting user information</p> :
                  tabContent[activeTab].content == "crowdfunding" ?
                     <p>Create a compelling story to drive donations to your cause</p> :
                  tabContent[activeTab].content == "peer-to-peer" ?
                     <p>Leverage the efforts of potential donors by giving users the opportunity to fundraise on your behalf</p> :
                  <p>Create an event which users can purchase tickets for and donate funds towards</p>
                  }
               </div>
               <div className="flex flex-col col-span-1 sm:col-span-2 w-3/4 mb-6">
                  <label className="text-gray-600 text-sm font-semibold mb-2">
                     Internal Campaign Name <span className="text-red-500">*</span>
                  </label>
                  <input
                     name="internalName"
                     type="text"
                     placeholder="Enter Internal Campaign Name"
                     className={`p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out ${
                        error ? 'border-red-500' : 'border-gray-300'
                     }`}
                     value={internalName}
                     onChange={(e) => setInternalName(e.target.value)}
                  />
                  {error && <p className="text-red-500 text-sm mt-1">This field is required.</p>}
               </div>
               <div className="mt-auto flex justify-center">
                  <button onClick={() => handleClick(tabContent[activeTab].content)}>
                     <p className="bg-blue-700 py-3 px-8 rounded-md text-md text-white text-center w-48">
                        Create
                     </p>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Modal