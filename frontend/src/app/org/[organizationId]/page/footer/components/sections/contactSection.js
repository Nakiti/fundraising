"use client"
import { useContext } from "react"
import { FooterPageContext } from "@/app/context/organizationPages/footerPageContext"

const ContactSection = () => {
   const { inputs, handleInputsChange } = useContext(FooterPageContext)

   return (
      <div className="space-y-3">
         {/* Organization Name */}
         <div className="space-y-1 mt-4">
            <label className="block text-xs font-medium text-gray-700">
               Organization Name
            </label>
            <input
               type="text"
               name="organizationName"
               value={inputs.organizationName || ""}
               onChange={handleInputsChange}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter organization name"
            />
         </div>

         {/* Tagline */}
         <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
               Tagline
            </label>
            <input
               type="text"
               name="tagline"
               value={inputs.tagline || ""}
               onChange={handleInputsChange}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter tagline"
            />
         </div>

         {/* Description */}
         <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
               Description
            </label>
            <textarea
               name="description"
               value={inputs.description || ""}
               onChange={handleInputsChange}
               rows={2}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter organization description"
            />
         </div>

         {/* Address */}
         <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
               Address
            </label>
            <textarea
               name="address"
               value={inputs.address || ""}
               onChange={handleInputsChange}
               rows={2}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter your organization's address"
            />
         </div>

         {/* Phone Number */}
         <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
               Phone Number
            </label>
            <input
               type="tel"
               name="phone"
               value={inputs.phone || ""}
               onChange={handleInputsChange}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter phone number"
            />
         </div>

         {/* Email */}
         <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
               Email Address
            </label>
            <input
               type="email"
               name="email"
               value={inputs.email || ""}
               onChange={handleInputsChange}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter email address"
            />
         </div>

         {/* Business Hours */}
         <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
               Business Hours
            </label>
            <textarea
               name="businessHours"
               value={inputs.businessHours || ""}
               onChange={handleInputsChange}
               rows={2}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter business hours (e.g., Mon-Fri: 9AM-5PM)"
            />
         </div>

         {/* Contact Form Link */}
         <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
               Contact Form URL
            </label>
            <input
               type="url"
               name="contactFormUrl"
               value={inputs.contactFormUrl || ""}
               onChange={handleInputsChange}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter contact form URL"
            />
         </div>
      </div>
   )
}

export default ContactSection
