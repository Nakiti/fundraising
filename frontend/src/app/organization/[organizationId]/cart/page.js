"use client"
import { useContext, useEffect } from "react";
import { DonationContext } from "@/app/context/organizationPages/donationContext";
import Link from "next/link";
import { IoIosClose } from "react-icons/io";


const Cart = ({params}) => {
   const {donations, setDonations} = useContext(DonationContext)
   const organizationId = params.organizationId
   let subtotal = 0

   const handleDelete = (id) => {
      setDonations(donations.filter(item => item.id !== id))
   }

   return (
      <div className="flex flex-col items-center p-4 bg-white min-h-screen">
         <h1 className="text-3xl font-bold mb-6 mt-6 px-12 text-start w-full">Your Donations:</h1>

         {/* Container for donations list and summary */}
         <div className="w-full max-w-6xl bg-white p-4 flex justify-between">

            {/* Left side - Donation Items */}
            <div className="w-7/12 space-y-8">
               {donations && donations.map(item => {
                  return (
                     <div className="flex justify-between items-center border-b pb-4">
                        <div className="flex items-center space-x-4">
                           <img
                              src={item.campaignImage}
                              alt="Product"
                              className="w-20 h-20 object-cover rounded-md"
                           />
                           <div>
                              <h2 className="text-lg font-semibold">{item.campaignTitle}</h2>
                              <p className="text-sm text-gray-500">{item.designationTitle}</p>
                           </div>
                        </div>
                        <div className="flex items-center space-x-4">
                           <span className="text-lg font-semibold">${item.amount}</span>
                           <button
                              className="text-red-500 hover:text-red-700 focus:outline-none"
                              onClick={() => handleDelete(item.id)} // Add your delete function here
                           >
                              <IoIosClose className="h-8 w-8"/>
                           </button>
                        </div>
                     </div>
                  )}
               )}
            </div>

            {/* Right side - Summary and Checkout */}
            <div className="w-4/12 bg-gray-50 p-6 rounded-sm">
               <div className="mb-4">
                  <div className="flex justify-between">
                     <span className="text-lg font-semibold">Subtotal</span>
                     <span className="text-lg font-semibold">${donations.map((item) =>  {
                        subtotal += Number(item.amount);
                        return subtotal
                     })}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                     <span className="text-sm text-gray-500">Transaction Fees</span>
                     <span className="text-sm text-gray-500">${subtotal * .05}</span>
                  </div>
                  <div className="flex justify-between mt-4 border-t pt-4">
                     <span className="text-xl font-bold">Total</span>
                     <span className="text-xl font-bold">${subtotal + subtotal * .05}</span>
                  </div>
               </div>

               {/* Action buttons */}
               <div className="flex flex-col space-y-4">
                  <Link href={`/organization/${organizationId}`} className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-center">
                     Add More Gifts
                  </Link>

                  <button className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                     Proceed to Checkout
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Cart;
