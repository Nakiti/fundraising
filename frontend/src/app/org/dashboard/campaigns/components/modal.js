"use client"
import { useState } from 'react';
import { IoIosClose } from "react-icons/io";
import Link from 'next/link';

const Modal = ({show, setShow}) => {
   const [activeTab, setActiveTab] = useState(0);

   // Sample content for each tab
   const tabContent = [
      { title: 'Donation Form', content: 'donation-form' },
      // { title: 'Crowdfunding', content: 'Crowdfunding' },
      { title: 'Peer to Peer', content: 'peer-to-peer' },
      { title: 'Ticketed Event', content: 'ticketed-event' },
   ];

   return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center z-50">
         <div className='bg-blue-800 p-4 w-3/4 max-w-6xl rounded-t-lg flex flex-row justify-between'>
            <h2 className='text-white text-lg font-semibold'>Create New Camapign</h2>
            <button className='text-white' onClick={() => setShow(false)}><IoIosClose className='h-6 w-6'/></button>
         </div>
         <div className="bg-white w-3/4 max-w-6xl rounded-sm shadow-lg flex overflow-hidden min-h-96">
            {/* Left side (Tabs) */}
            <div className="w-1/4 bg-gray-100 py-2">
               {tabContent.map((tab, index) => (
                  <button
                     key={index}
                     onClick={() => setActiveTab(index)}
                     className={`block w-full text-left py-4 px-4 mb-2 text-md ${
                        activeTab === index
                           ? 'bg-blue-500 text-white'
                           : 'text-gray-700'
                     }`}
                  >
                     {tab.title}
                  </button>
               ))}
            </div>

            {/* Right side (Content) */}
            <div className="w-3/4 px-6 pt-6 ">
               <h2 className="text-2xl font-semibold mb-4">{tabContent[activeTab].title}</h2>
               <p className="text-gray-700">{tabContent[activeTab].content}</p>

               <Link href={{pathname: "/org/campaign/new/details/about", query: {type: tabContent[activeTab].content}}} >
                  <p className="bg-blue-700 py-3 px-8 mt-56 ml-56 rounded-md text-md text-white text-center w-48">Create</p>
               </Link> 
            </div>
         </div>
      </div>
   );
};

export default Modal;
