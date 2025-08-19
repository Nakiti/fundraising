"use client";
import { useContext, useState } from "react";
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext";
import { FaShare, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaClock, FaUsers, FaArrowRight } from "react-icons/fa";

const Display = () => {
   const { ticketsPageInputs, handleTicketsPageInputs } = useContext(TicketPageContext);
   
   return (
      <div 
         className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
         style={{ 
            backgroundColor: ticketsPageInputs.bg_color || '#f8fafc',
            color: ticketsPageInputs.p_color || '#1f2937'
         }}
      >
         {/* Hero Section */}
         <div className="relative">
            {/* Background Image */}
            <div className="w-full h-screen bg-gradient-to-r from-orange-600 to-red-600 relative overflow-hidden">
               {ticketsPageInputs.bgImage ? (
                  <img
                     src={ticketsPageInputs.bgImage}
                     alt="Event Banner"
                     className="w-full h-full object-cover opacity-90"
                  />
               ) : (
                  <div className="w-full h-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
                     <FaTicketAlt className="text-white text-8xl opacity-50" />
                  </div>
               )}
               
               {/* Overlay */}
               <div className="absolute inset-0 bg-black/40"></div>
               
               {/* Header */}
               <div className="absolute top-0 left-0 right-0 p-6">
                  <div className="flex justify-between items-center">
                     <h1 className="text-white text-xl font-semibold">Event Tickets</h1>
                     <button className="text-white hover:text-orange-200 transition-colors duration-200">
                        <FaShare className="text-lg" />
                     </button>
                  </div>
               </div>

               {/* Hero Content */}
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <h1 
                     className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                     style={{ color: ticketsPageInputs.p_color || '#ffffff' }}
                  >
                     {ticketsPageInputs.title || "Amazing Event"}
                  </h1>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
                     <div className="flex items-center space-x-2 text-white/90">
                        <FaCalendarAlt className="text-orange-300" />
                        <span className="text-lg">{ticketsPageInputs.date || "December 15, 2024"}</span>
                     </div>
                     <div className="flex items-center space-x-2 text-white/90">
                        <FaMapMarkerAlt className="text-orange-300" />
                        <span className="text-lg">{ticketsPageInputs.address || "123 Event Center, City, State"}</span>
                     </div>
                  </div>
                  
                  <button 
                     className="inline-flex items-center px-8 py-4 text-lg font-semibold text-orange-600 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                     <FaTicketAlt className="mr-3" />
                     Get Tickets Now
                     <FaArrowRight className="ml-3" />
                  </button>
               </div>
            </div>
         </div>

         {/* Content Section */}
         <div className="max-w-6xl mx-auto px-6 py-16">
            {/* About Section */}
            <div className="text-center mb-16">
               <h2 
                  className="text-4xl font-bold mb-8"
                  style={{ color: ticketsPageInputs.p_color || '#1f2937' }}
               >
                  About the Event
               </h2>
               <p 
                  className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
                  style={{ color: ticketsPageInputs.s_color || '#6b7280' }}
               >
                  {ticketsPageInputs.aboutDescription || "Join us for an unforgettable evening filled with amazing performances, great food, and wonderful company. This is an event you won't want to miss!"}
               </p>
            </div>

            {/* Event Details */}
            <div className="grid md:grid-cols-2 gap-12 mb-16">
               {/* Venue Information */}
               <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 
                     className="text-2xl font-bold mb-6"
                     style={{ color: ticketsPageInputs.p_color || '#1f2937' }}
                  >
                     {ticketsPageInputs.venue || "Event Venue"}
                  </h3>
                  <div className="space-y-4">
                     <div className="flex items-start space-x-3">
                        <FaMapMarkerAlt className="text-orange-600 mt-1 flex-shrink-0" />
                        <div>
                           <p className="font-medium">{ticketsPageInputs.address || "123 Event Center"}</p>
                           <p className="text-gray-600">City, State 12345</p>
                        </div>
                     </div>
                     <div className="flex items-start space-x-3">
                        <FaClock className="text-orange-600 mt-1 flex-shrink-0" />
                        <div>
                           <p className="font-medium">Doors Open</p>
                           <p className="text-gray-600">6:00 PM</p>
                        </div>
                     </div>
                     <div className="flex items-start space-x-3">
                        <FaUsers className="text-orange-600 mt-1 flex-shrink-0" />
                        <div>
                           <p className="font-medium">Capacity</p>
                           <p className="text-gray-600">500 guests</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-orange-50 rounded-xl">
                     <h4 className="font-semibold mb-2">Guest Instructions</h4>
                     <p className="text-sm text-gray-600">
                        {ticketsPageInputs.instructions || "Please arrive 15 minutes before the event. Dress code is business casual. Parking is available on-site."}
                     </p>
                  </div>
               </div>

               {/* Venue Image */}
               <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <img 
                     src={ticketsPageInputs.venueImage || "https://via.placeholder.com/600x400"}
                     alt="Venue"
                     className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                     <h4 className="font-semibold mb-2">Venue Highlights</h4>
                     <ul className="text-sm text-gray-600 space-y-1">
                        <li>• State-of-the-art sound system</li>
                        <li>• Comfortable seating</li>
                        <li>• Full-service bar</li>
                        <li>• Accessible facilities</li>
                     </ul>
                  </div>
               </div>
            </div>

            {/* Tickets Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
               <div className="text-center mb-8">
                  <h2 
                     className="text-3xl font-bold mb-4"
                     style={{ color: ticketsPageInputs.p_color || '#1f2937' }}
                  >
                     Available Tickets
                  </h2>
                  <p 
                     className="text-lg text-gray-600"
                     style={{ color: ticketsPageInputs.s_color || '#6b7280' }}
                  >
                     Choose your preferred ticket type
                  </p>
               </div>

               <div className="grid md:grid-cols-3 gap-6">
                  {/* General Admission */}
                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-200">
                     <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">General Admission</h3>
                        <div className="text-3xl font-bold text-orange-600 mb-4">$25</div>
                        <ul className="text-sm text-gray-600 space-y-2 mb-6">
                           <li>• General seating</li>
                           <li>• Event access</li>
                           <li>• Refreshments included</li>
                        </ul>
                        <button className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-semibold">
                           Select
                        </button>
                     </div>
                  </div>

                  {/* VIP */}
                  <div className="border-2 border-orange-500 rounded-xl p-6 bg-orange-50 relative">
                     <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Popular</span>
                     </div>
                     <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">VIP Experience</h3>
                        <div className="text-3xl font-bold text-orange-600 mb-4">$75</div>
                        <ul className="text-sm text-gray-600 space-y-2 mb-6">
                           <li>• Premium seating</li>
                           <li>• Meet & greet</li>
                           <li>• Exclusive access</li>
                           <li>• Complimentary drinks</li>
                        </ul>
                        <button className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-semibold">
                           Select
                        </button>
                     </div>
                  </div>

                  {/* Premium */}
                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-200">
                     <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">Premium</h3>
                        <div className="text-3xl font-bold text-orange-600 mb-4">$50</div>
                        <ul className="text-sm text-gray-600 space-y-2 mb-6">
                           <li>• Reserved seating</li>
                           <li>• Priority access</li>
                           <li>• Premium refreshments</li>
                        </ul>
                        <button className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-semibold">
                           Select
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
               <h2 
                  className="text-3xl font-bold mb-6"
                  style={{ color: ticketsPageInputs.p_color || '#1f2937' }}
               >
                  Don't Miss Out!
               </h2>
               <p 
                  className="text-xl text-gray-600 mb-8"
                  style={{ color: ticketsPageInputs.s_color || '#6b7280' }}
               >
                  Limited tickets available. Secure your spot today.
               </p>
               <button 
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  style={{ backgroundColor: ticketsPageInputs.b1_color || '#ea580c' }}
               >
                  <FaTicketAlt className="mr-3" />
                  Purchase Tickets
                  <FaArrowRight className="ml-3" />
               </button>
            </div>
         </div>

         {/* Footer */}
         <div className="bg-gray-900 text-white py-12">
            <div className="max-w-6xl mx-auto px-6 text-center">
               <p className="text-gray-400 text-sm">
                  &copy; {new Date().getFullYear()} Your Organization. All rights reserved.
               </p>
               <div className="mt-2 space-x-4 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
                  <span className="text-gray-600">|</span>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Display