"use client";
import { useContext, useState } from "react";
import { TicketPurchasePageContext } from "@/app/context/campaignPages/ticketPurchasePageContext";
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaLock, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Display = () => {
   const { ticketPurchaseInputs, handleTicketPurchaseInputsChange } = useContext(TicketPurchasePageContext);
   
   return (
      <div 
         className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
         style={{ 
            backgroundColor: ticketPurchaseInputs.bg_color || '#f8fafc',
            color: ticketPurchaseInputs.p_color || '#1f2937'
         }}
      >
         {/* Header */}
         <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                     <button className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                        <FaArrowLeft className="text-lg" />
                     </button>
                     <h1 className="text-xl font-semibold">Purchase Tickets</h1>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                     <FaLock className="text-green-600" />
                     <span>Secure Checkout</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
               {/* Main Content */}
               <div className="lg:col-span-2">
                  {/* Event Info */}
                  <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                     <div className="flex items-start space-x-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                           <FaTicketAlt className="text-white text-3xl" />
                        </div>
                        <div className="flex-1">
                           <h2 
                              className="text-2xl font-bold mb-2"
                              style={{ color: ticketPurchaseInputs.p_color || '#1f2937' }}
                           >
                              {ticketPurchaseInputs.headline || "Amazing Concert Event"}
                           </h2>
                           <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                              <div className="flex items-center space-x-2">
                                 <FaCalendarAlt className="text-orange-500" />
                                 <span>December 15, 2024</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <FaMapMarkerAlt className="text-orange-500" />
                                 <span>123 Event Center</span>
                              </div>
                           </div>
                           <p 
                              className="text-gray-600 leading-relaxed"
                              style={{ color: ticketPurchaseInputs.s_color || '#6b7280' }}
                           >
                              {ticketPurchaseInputs.description || "Join us for an unforgettable evening of music and entertainment. Don't miss out on this incredible experience!"}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Ticket Selection */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                     <h3 
                        className="text-xl font-bold mb-6"
                        style={{ color: ticketPurchaseInputs.p_color || '#1f2937' }}
                     >
                        Select Your Tickets
                     </h3>
                     
                     <div className="space-y-6">
                        {/* General Admission */}
                        <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 transition-all duration-200">
                           <div className="flex items-start justify-between">
                              <div className="flex-1">
                                 <div className="flex items-center space-x-4 mb-4">
                                    <input
                                       type="checkbox"
                                       className="w-5 h-5 border-gray-300 rounded text-orange-600 focus:ring-orange-500"
                                    />
                                    <div>
                                       <h4 className="text-lg font-semibold">General Admission</h4>
                                       <p className="text-sm text-gray-600">Standard seating with great views</p>
                                    </div>
                                 </div>
                                 <div className="ml-9">
                                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                                       <li>• General seating area</li>
                                       <li>• Event access</li>
                                       <li>• Refreshments included</li>
                                       <li>• Available until Dec 31, 2024</li>
                                    </ul>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end space-y-4">
                                 <div className="text-right">
                                    <div className="text-2xl font-bold text-orange-600">$25</div>
                                    <div className="text-sm text-gray-500">per ticket</div>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium">Quantity:</label>
                                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                                       <option>0</option>
                                       <option>1</option>
                                       <option>2</option>
                                       <option>3</option>
                                       <option>4</option>
                                    </select>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* VIP Experience */}
                        <div className="border-2 border-orange-500 rounded-xl p-6 bg-orange-50 relative">
                           <div className="absolute -top-3 left-6">
                              <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Popular</span>
                           </div>
                           <div className="flex items-start justify-between">
                              <div className="flex-1">
                                 <div className="flex items-center space-x-4 mb-4">
                                    <input
                                       type="checkbox"
                                       className="w-5 h-5 border-gray-300 rounded text-orange-600 focus:ring-orange-500"
                                       defaultChecked
                                    />
                                    <div>
                                       <h4 className="text-lg font-semibold">VIP Experience</h4>
                                       <p className="text-sm text-gray-600">Premium seating with exclusive benefits</p>
                                    </div>
                                 </div>
                                 <div className="ml-9">
                                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                                       <li>• Premium reserved seating</li>
                                       <li>• Meet & greet with performers</li>
                                       <li>• Exclusive VIP lounge access</li>
                                       <li>• Complimentary drinks & snacks</li>
                                       <li>• Available until Dec 31, 2024</li>
                                    </ul>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end space-y-4">
                                 <div className="text-right">
                                    <div className="text-2xl font-bold text-orange-600">$75</div>
                                    <div className="text-sm text-gray-500">per ticket</div>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium">Quantity:</label>
                                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                                       <option>0</option>
                                       <option>1</option>
                                       <option>2</option>
                                       <option>3</option>
                                       <option>4</option>
                                    </select>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Premium */}
                        <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 transition-all duration-200">
                           <div className="flex items-start justify-between">
                              <div className="flex-1">
                                 <div className="flex items-center space-x-4 mb-4">
                                    <input
                                       type="checkbox"
                                       className="w-5 h-5 border-gray-300 rounded text-orange-600 focus:ring-orange-500"
                                    />
                                    <div>
                                       <h4 className="text-lg font-semibold">Premium</h4>
                                       <p className="text-sm text-gray-600">Enhanced experience with priority access</p>
                                    </div>
                                 </div>
                                 <div className="ml-9">
                                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                                       <li>• Reserved premium seating</li>
                                       <li>• Priority entry</li>
                                       <li>• Premium refreshments</li>
                                       <li>• Dedicated service</li>
                                       <li>• Available until Dec 31, 2024</li>
                                    </ul>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end space-y-4">
                                 <div className="text-right">
                                    <div className="text-2xl font-bold text-orange-600">$50</div>
                                    <div className="text-sm text-gray-500">per ticket</div>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium">Quantity:</label>
                                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                                       <option>0</option>
                                       <option>1</option>
                                       <option>2</option>
                                       <option>3</option>
                                       <option>4</option>
                                    </select>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Order Summary */}
               <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                     <h3 
                        className="text-xl font-bold mb-6 pb-4 border-b border-gray-200"
                        style={{ color: ticketPurchaseInputs.p_color || '#1f2937' }}
                     >
                        Order Summary
                     </h3>
                     
                     <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                           <span className="text-gray-600">VIP Experience (1)</span>
                           <span className="font-semibold">$75.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-600">Service Fee</span>
                           <span className="font-semibold">$5.00</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                           <div className="flex justify-between items-center">
                              <span className="text-lg font-bold">Total</span>
                              <span className="text-2xl font-bold text-orange-600">$80.00</span>
                           </div>
                        </div>
                     </div>

                     <button 
                        className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                        style={{ backgroundColor: ticketPurchaseInputs.b1_color || '#ea580c' }}
                     >
                        <FaCreditCard className="text-lg" />
                        <span>Proceed to Payment</span>
                        <FaArrowRight className="text-lg" />
                     </button>

                     <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                           By proceeding, you agree to our Terms of Service and Privacy Policy
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Footer */}
         <div className="bg-gray-900 text-white py-12 mt-16">
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