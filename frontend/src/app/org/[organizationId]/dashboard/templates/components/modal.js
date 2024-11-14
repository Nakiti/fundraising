import { useState } from 'react';
import { IoIosClose } from "react-icons/io";
import Link from 'next/link';

const Modal = ({show, setShow}) => {
   const [activeTab, setActiveTab] = useState(0);

   // Sample content for each tab
   const tabContent = [
      { title: 'Donation Form', content: 'Donation Form' },
      { title: 'Crowdfunding', content: 'Crowdfunding' },
      { title: 'Peer to Peer', content: 'Peer to Peer' },
      { title: 'Ticketed Event', content: 'Ticketed Event' },
   ];

   return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center z-50">
         <div className='bg-blue-800 p-4 w-1/2 max-w-5xl rounded-t-lg flex flex-row justify-between'>
            <h2 className='text-white text-2xl'>Create Template</h2>
            <button className='text-white' onClick={() => setShow(false)}><IoIosClose className='h-6 w-6'/></button>
         </div>
         <div className="bg-white w-1/2 max-w-6xl space-y-10 verflow-hidden min-h-96 px-8 py-12">
            <div className="flex flex-col">
               <label className="text-gray-500 text-sm font-bold mb-1">
                  Template Name <span className="text-red-500">*</span>
               </label>
               <input
                  name="campaignName"
                  type="text"
                  placeholder="Enter Template Name"
                  className="p-3 border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>

            <div className='flex flex-col'>
               <label className="text-gray-500 text-sm font-bold mb-1">
                  Select Campaign Type <span className="text-red-500">*</span>
               </label>
               <select 
                  className="w-full p-3 border border-gray-400 rounded-sm" 
                  defaultValue=""
                  name="defaultDesignation"
               >
                  <option value="" disabled>Select an Option</option>
               </select>
            </div>
         </div>
         <div className='bg-gray-200 p-4 w-1/2 rounded-b-lg flex flex-row justify-around space-x-4'>
            <button className='text-gray-700 bg-gray-300 px-12 py-3 font-semibold rounded-md shadow-sm' onClick={() => setShow(false)}>Cancel</button>
            <button className='text-blue-700 bg-gray-300 px-12 py-3 font-semibold rounded-md shadow-sm' onClick={() => setShow(false)}>Create</button>
         </div>
      </div>
   );
};

export default Modal;
