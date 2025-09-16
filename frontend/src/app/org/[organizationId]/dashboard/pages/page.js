"use client"
import { IoMdOpen } from "react-icons/io";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { FaGlobe, FaInfoCircle, FaEdit, FaPalette, FaCheck } from "react-icons/fa";
import { PageService } from "@/app/services/fetchService";
import { getPageService } from "@/app/services";

const Pages = ({params}) => {
   const organizationId = params.organizationId
   const [pageCards, setPageCards] = useState([])
   const [loading, setLoading] = useState(true)
   const [applyingTheme, setApplyingTheme] = useState(null)
   const [ids, setIds] = useState({
      landingPageId: null,
      aboutPageId: null,
      headerPageId: null,
      footerPageId: null
   })

   // Refined theme configurations
   const themes = [
      {
         id: 'modern-blue',
         name: 'Modern Blue',
         description: 'Clean, professional design with blue accents',
         colors: {
            bgColor: '#FFFFFF',
            pColor: '#1F2937',
            sColor: '#6B7280',
            cColor: '#F8FAFC',
            ctColor: '#1F2937',
            bColor: '#3B82F6',
            btColor: '#FFFFFF',
            // accentColor: '#1E40AF'
         },
         spacing: {
            // heroHeight: '600px',
            // sectionPadding: '100px',
            // cardRadius: '8px',
            // buttonRadius: '6px'
         },
         typography: {
            // heroTitleSize: '48px',
            // heroSubtitleSize: '18px',
            // sectionTitleSize: '32px',
            // bodyTextSize: '16px',
            // buttonTextSize: '16px',
            // cardTitleSize: '20px'
         }
      },
      {
         id: 'warm-orange',
         name: 'Warm Orange',
         description: 'Friendly and approachable with warm tones',
         colors: {
            bgColor: '#FFF7ED',
            pColor: '#1F2937',
            sColor: '#6B7280',
            cColor: '#FFFFFF',
            ctColor: '#1F2937',
            bColor: '#F97316',
            btColor: '#FFFFFF',
            // accentColor: '#EA580C'
         },
         spacing: {
            // heroHeight: '550px',
            // sectionPadding: '80px',
            // cardRadius: '12px',
            // buttonRadius: '8px'
         },
         typography: {
            // heroTitleSize: '44px',
            // heroSubtitleSize: '18px',
            // sectionTitleSize: '30px',
            // bodyTextSize: '16px',
            // buttonTextSize: '16px',
            // cardTitleSize: '22px'
         }
      },
      {
         id: 'elegant-purple',
         name: 'Elegant Purple',
         description: 'Sophisticated design with purple accents',
         colors: {
            bgColor: '#FAFAFA',
            pColor: '#1F2937',
            sColor: '#6B7280',
            cColor: '#FFFFFF',
            ctColor: '#1F2937',
            bColor: '#8B5CF6',
            btColor: '#FFFFFF',
            // accentColor: '#7C3AED'
         },
         spacing: {
            // heroHeight: '650px',
            // sectionPadding: '120px',
            // cardRadius: '16px',
            // buttonRadius: '10px'
         },
         typography: {
            // heroTitleSize: '52px',
            // heroSubtitleSize: '20px',
            // sectionTitleSize: '36px',
            // bodyTextSize: '18px',
            // buttonTextSize: '16px',
            // cardTitleSize: '24px'
         }
      },
      {
         id: 'minimal-gray',
         name: 'Minimal Gray',
         description: 'Clean and minimal with subtle accents',
         colors: {
            bgColor: '#FFFFFF',
            pColor: '#111827',
            sColor: '#4B5563',
            cColor: '#F9FAFB',
            ctColor: '#111827',
            bColor: '#6B7280',
            btColor: '#FFFFFF',
            // accentColor: '#374151'
         },
         spacing: {
            // heroHeight: '500px',
            // sectionPadding: '60px',
            // cardRadius: '4px',
            // buttonRadius: '4px'
         },
         typography: {
            // heroTitleSize: '40px',
            // heroSubtitleSize: '16px',
            // sectionTitleSize: '28px',
            // bodyTextSize: '14px',
            // buttonTextSize: '14px',
            // cardTitleSize: '18px'
         }
      }
   ]

   const applyThemeToAllPages = async (theme) => {
      setApplyingTheme(theme.id)
      
      try {
         const themeData = {
            ...theme.colors,
            ...theme.spacing,
            ...theme.typography,
            active: 1
         }
         
         console.log(`Applying ${theme.name} theme to all pages:`, themeData)
         const pageService = getPageService()

         // Apply theme to all pages concurrently
         const promises = [
            // Landing page
            (async () => {
               try {
                     // const landingPage = await PageService.getLandingPage(organizationId)
                  await pageService.updateLandingPage(organizationId, ids.landingPageId, themeData)
               } catch (error) {
                  if (error.message.includes('not found') || error.status === 404) {
                     const createData = await pageService.createLandingPage({
                        organization_id: organizationId,
                        user_id: 1,
                        title: 'Landing Page',
                        description: 'Organization landing page'
                     })
                     await pageService.updateLandingPage(organizationId, createData.pageId, themeData)
                  } else {
                     throw error
                  }
               }
            })(),
            
            // About page
            (async () => {
               try {
                  // const aboutPage = await PageService.getAboutPage(organizationId)
                  await pageService.updateAboutPage(organizationId, ids.aboutPageId, themeData)
               } catch (error) {
                  if (error.message.includes('not found') || error.status === 404) {
                     const createData = await pageService.createAboutPage({
                        organization_id: organizationId,
                        user_id: 1,
                        title: 'About Page',
                        description: 'Organization about page'
                     })
                     await pageService.updateAboutPage(organizationId, createData.pageId, themeData)
                  } else {
                     throw error
                  }
               }
            })(),
            
            // Header page
            (async () => {
               try {
                  // const headerPage = await PageService.getHeaderPage(organizationId)
                  const headerUpdateData = {
                     bgColor: theme.colors.bgColor,
                     textColor: theme.colors.pColor,
                     // accentColor: theme.colors.accentColor,
                     active: 1
                  }
                  await pageService.updateHeaderPage(organizationId, ids.headerPageId, headerUpdateData)
               } catch (error) {
                  if (error.message.includes('not found') || error.status === 404) {
                     const createData = await pageService.createHeaderPage({
                        organization_id: organizationId,
                        user_id: 1,
                     })
                     // const newHeaderUpdateData = {
                     //    bgColor: theme.colors.bg_color,
                     //    textColor: theme.colors.p_color,
                     //    accentColor: theme.colors.accent_color,
                     //    organizationName: "Organization",
                     //    logo: "",
                     //    active: true
                     // }
                     // await pageService.updateHeaderPage(organizationId, createData.pageId, newHeaderUpdateData)
                  } else {
                     throw error
                  }
               }
            })(),
            
            // Footer page
            (async () => {
               try {
                  // const footerPage = await PageService.getFooterPage(organizationId)
                  const footerUpdateData = {
                     bgColor: theme.colors.bgColor,
                     textColor: theme.colors.pColor,
                     linkColor: theme.colors.accentColor,
                     organizationName: footerPage.organizationName || "Organization",
                     logo: footerPage.logo || "",
                     active: 1
                  }
                  await pageService.updateFooterPage(organizationId, ids.footerPageId, footerUpdateData)
               } catch (error) {
                  if (error.message.includes('not found') || error.status === 404) {
                     const createData = await pageService.createFooterPage({
                        organization_id: organizationId,
                        user_id: 1,
                     })
                     // const newFooterUpdateData = {
                     //    bgColor: theme.colors.bg_color,
                     //    textColor: theme.colors.p_color,
                     //    linkColor: theme.colors.accent_color,
                     //    organizationName: "Organization",
                     //    logo: "",
                     //    active: true
                     // }
                     // await pageService.updateFooterPage(organizationId, createData.pageId, newFooterUpdateData)
                  } else {
                     throw error
                  }
               }
            })()
         ]

         await Promise.all(promises)
         await fetchPageStatus()
         
      } catch (error) {
         console.error('Error applying theme to all pages:', error)
      } finally {
         setApplyingTheme(null)
      }
   }

   const fetchPageStatus = async () => {
      try {
         setLoading(true)
         const pageService = getPageService()
         
         const [landingPage, aboutPage, headerPage, footerPage] = await Promise.all([
            pageService.getLandingPage(organizationId),
            pageService.getAboutPage(organizationId),
            pageService.getHeaderPage(organizationId),
            pageService.getFooterPage(organizationId)

         ])

         setIds({
            landingPageId: landingPage.data.id,
            aboutPageId: aboutPage.data.id,
            headerPageId: headerPage.data.id,
            footerPageId: footerPage.data.id
         })

         const cards = [
            {
               title: "Landing Page",
               description: "Edit the landing page for your organization",
               href: `/org/${organizationId}/page/landing`,
               icon: <FaGlobe className="w-6 h-6 text-blue-600" />,
               status: landingPage.data.active == 1 ? "active" : "draft"
            },
            {
               title: "About Page",
               description: "Edit the about page for your organization",
               href: `/org/${organizationId}/page/about`,
               icon: <FaInfoCircle className="w-6 h-6 text-purple-600" />,
               status: aboutPage.data.active == 1? "active" : "draft"
            },
            {
               title: "Header Design",
               description: "Customize your organization's header",
               href: `/org/${organizationId}/page/header`,
               icon: <FaEdit className="w-6 h-6 text-green-600" />,
               status: headerPage.data.active == 1 ? "active" : "draft"
            },
            {
               title: "Footer Design",
               description: "Customize your organization's footer",
               href: `/org/${organizationId}/page/footer`,
               icon: <FaEdit className="w-6 h-6 text-orange-600" />,
               status: footerPage.data.active == 1 ? "active" : "draft"
            },
         ]

         setPageCards(cards)
      } catch (error) {
         console.error("Error fetching page status:", error)
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
            {
               title: "Header Design",
               description: "Customize your organization's header",
               href: `/org/${organizationId}/page/header`,
               icon: <FaEdit className="w-6 h-6 text-green-600" />,
               status: "draft"
            },
            {
               title: "Footer Design",
               description: "Customize your organization's footer",
               href: `/org/${organizationId}/page/footer`,
               icon: <FaEdit className="w-6 h-6 text-orange-600" />,
               status: "draft"
            },
         ])
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchPageStatus()
   }, [organizationId])

   return (
      <div className="w-full bg-gray-50">
         <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
                  <p className="text-gray-600 mt-1">Manage your organization's public pages and apply consistent themes</p>
               </div>
            </div>

            {/* Quick Themes Section */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Quick Themes</h2>
                  <p className="text-gray-600">Apply professional themes to all pages at once</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {themes.map((theme) => (
                     <div key={theme.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200">
                        <div className="flex space-x-2 mb-3">
                           <div 
                              className="w-6 h-6 rounded border border-gray-200" 
                              style={{ backgroundColor: theme.colors.bColor }}
                           />
                           <div 
                              className="w-6 h-6 rounded border border-gray-200" 
                              style={{ backgroundColor: theme.colors.accentColor }}
                           />
                           <div 
                              className="w-6 h-6 rounded border border-gray-200" 
                              style={{ backgroundColor: theme.colors.pColor }}
                           />
                           <div 
                              className="w-6 h-6 rounded border border-gray-200" 
                              style={{ backgroundColor: theme.colors.sColor }}
                           />
                        </div>
                        
                        <h3 className="text-base font-medium text-gray-900 mb-1">{theme.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{theme.description}</p>
                        
                        <button
                           onClick={() => applyThemeToAllPages(theme)}
                           disabled={applyingTheme === theme.id}
                           className="w-full px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                        >
                           {applyingTheme === theme.id ? (
                              <>
                                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                 <span>Applying...</span>
                              </>
                           ) : (
                              <>
                                 <FaPalette className="w-4 h-4" />
                                 <span>Apply Theme</span>
                              </>
                           )}
                        </button>
                     </div>
                  ))}
               </div>
            </div> */}

            {/* Page Editor Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Page Editor</h2>
                  <p className="text-gray-600 mt-1">Customize individual pages for your organization</p>
               </div>
               
               <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {pageCards.map((page, index) => (
                        <Link 
                           key={index} 
                           href={page.href} 
                           className="group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                        >
                           <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                 <div className="p-2 bg-white rounded-lg group-hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                                    {page.icon}
                                 </div>
                                 <div>
                                    <div className="flex items-center space-x-2">
                                       <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                          {page.title}
                                       </h3>
                                       {loading ? (
                                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                             Loading...
                                          </span>
                                       ) : page.status === "active" ? (
                                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                             Active
                                          </span>
                                       ) : (
                                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                             Draft
                                          </span>
                                       )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                                 </div>
                              </div>
                              <IoMdOpen className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Pages