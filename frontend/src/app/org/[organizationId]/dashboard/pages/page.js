"use client"
import { IoMdOpen } from "react-icons/io";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { FaGlobe, FaShoppingCart, FaInfoCircle, FaChartLine, FaEdit } from "react-icons/fa";
import { PageService } from "@/app/services/fetchService";

const Pages = ({params}) => {
   const organizationId = params.organizationId
   const [pageCards, setPageCards] = useState([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const fetchPageStatus = async () => {
         try {
            setLoading(true)
            
            // Fetch both pages' status concurrently
            const [landingPage, aboutPage] = await Promise.all([
               PageService.getLandingPage(organizationId),
               PageService.getAboutPage(organizationId)
            ])

            const cards = [
               {
                  title: "Landing Page",
                  description: "Edit the landing page for your organization",
                  href: `/org/${organizationId}/page/landing`,
                  icon: <FaGlobe className="w-6 h-6 text-blue-600" />,
                  status: landingPage.active ? "active" : "draft"
               },
               {
                  title: "About Page",
                  description: "Edit the about page for your organization",
                  href: `/org/${organizationId}/page/about`,
                  icon: <FaInfoCircle className="w-6 h-6 text-purple-600" />,
                  status: aboutPage.active ? "active" : "draft"
               },
            ]

            setPageCards(cards)
         } catch (error) {
            console.error("Error fetching page status:", error)
            // Fallback to default cards if API fails
            setPageCards([
               {
                  title: "Landing Page",
                  description: "Edit the landing page for your organization",
                  href: `/org/${organizationId}/page/landing`,
                  icon: <FaGlobe className="w-6 h-6 text-blue-600" />,
                  status: "draft"
               },
               {
                  title: "About Page",
                  description: "Edit the about page for your organization",
                  href: `/org/${organizationId}/page/about`,
                  icon: <FaInfoCircle className="w-6 h-6 text-purple-600" />,
                  status: "draft"
               },
            ])
         } finally {
            setLoading(false)
         }
      }

      fetchPageStatus()
   }, [organizationId])

   return (
      <div className="w-full h-full bg-gray-50">
         <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Organization Pages</h1>
                  <p className="text-gray-600 mt-1">Manage and customize your organization's public pages</p>
               </div>
            </div>

            {/* Pages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {pageCards.map((page, index) => (
                  <Link 
                     key={index} 
                     href={page.href} 
                     className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200"
                  >
                     <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                           <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-200">
                              {page.icon}
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                 <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                    {page.title}
                                 </h3>
                                 {loading ? (
                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                       Loading...
                                    </span>
                                 ) : page.status === "todo" ? (
                                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                       Coming Soon
                                    </span>
                                 ) : page.status === "active" ? (
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                       Active
                                    </span>
                                 ) : page.status === "draft" ? (
                                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                       Draft
                                    </span>
                                 ) : (
                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                       Unknown
                                    </span>
                                 )}
                              </div>
                              <p className="text-sm text-gray-600 mt-2">{page.description}</p>
                           </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400 group-hover:text-blue-600 transition-colors duration-200">
                           <FaEdit className="w-4 h-4" />
                           <IoMdOpen className="w-4 h-4" />
                        </div>
                     </div>
                  </Link>
               ))}
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                     <FaInfoCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                     <h3 className="text-lg font-medium text-gray-900 mb-2">Page Management Tips</h3>
                     <div className="text-sm text-gray-600 space-y-2">
                        <p>• Each page can be customized with your organization's branding and content</p>
                        <p>• Changes are saved automatically as you edit</p>
                        <p>• Preview your changes before publishing to ensure everything looks perfect</p>
                        <p>• Some pages are still in development and will be available soon</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Pages