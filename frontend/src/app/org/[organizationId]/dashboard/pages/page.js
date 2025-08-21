"use client"
import { IoMdOpen } from "react-icons/io";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { FaGlobe, FaInfoCircle, FaEdit, FaPalette, FaCheck } from "react-icons/fa";
import { PageService } from "@/app/services/fetchService";

const Pages = ({params}) => {
   const organizationId = params.organizationId
   const [pageCards, setPageCards] = useState([])
   const [loading, setLoading] = useState(true)
   const [applyingTheme, setApplyingTheme] = useState(null)

   // Refined theme configurations
   const themes = [
      {
         id: 'modern-blue',
         name: 'Modern Blue',
         description: 'Clean, professional design with blue accents',
         colors: {
            bg_color: '#FFFFFF',
            p_color: '#1F2937',
            s_color: '#6B7280',
            c_color: '#F8FAFC',
            ct_color: '#1F2937',
            b_color: '#3B82F6',
            bt_color: '#FFFFFF',
            accent_color: '#1E40AF'
         },
         spacing: {
            hero_height: '600px',
            section_padding: '100px',
            card_radius: '8px',
            button_radius: '6px'
         },
         typography: {
            hero_title_size: '48px',
            hero_subtitle_size: '18px',
            section_title_size: '32px',
            body_text_size: '16px',
            button_text_size: '16px',
            card_title_size: '20px'
         }
      },
      {
         id: 'warm-orange',
         name: 'Warm Orange',
         description: 'Friendly and approachable with warm tones',
         colors: {
            bg_color: '#FFF7ED',
            p_color: '#1F2937',
            s_color: '#6B7280',
            c_color: '#FFFFFF',
            ct_color: '#1F2937',
            b_color: '#F97316',
            bt_color: '#FFFFFF',
            accent_color: '#EA580C'
         },
         spacing: {
            hero_height: '550px',
            section_padding: '80px',
            card_radius: '12px',
            button_radius: '8px'
         },
         typography: {
            hero_title_size: '44px',
            hero_subtitle_size: '18px',
            section_title_size: '30px',
            body_text_size: '16px',
            button_text_size: '16px',
            card_title_size: '22px'
         }
      },
      {
         id: 'elegant-purple',
         name: 'Elegant Purple',
         description: 'Sophisticated design with purple accents',
         colors: {
            bg_color: '#FAFAFA',
            p_color: '#1F2937',
            s_color: '#6B7280',
            c_color: '#FFFFFF',
            ct_color: '#1F2937',
            b_color: '#8B5CF6',
            bt_color: '#FFFFFF',
            accent_color: '#7C3AED'
         },
         spacing: {
            hero_height: '650px',
            section_padding: '120px',
            card_radius: '16px',
            button_radius: '10px'
         },
         typography: {
            hero_title_size: '52px',
            hero_subtitle_size: '20px',
            section_title_size: '36px',
            body_text_size: '18px',
            button_text_size: '16px',
            card_title_size: '24px'
         }
      },
      {
         id: 'minimal-gray',
         name: 'Minimal Gray',
         description: 'Clean and minimal with subtle accents',
         colors: {
            bg_color: '#FFFFFF',
            p_color: '#111827',
            s_color: '#4B5563',
            c_color: '#F9FAFB',
            ct_color: '#111827',
            b_color: '#6B7280',
            bt_color: '#FFFFFF',
            accent_color: '#374151'
         },
         spacing: {
            hero_height: '500px',
            section_padding: '60px',
            card_radius: '4px',
            button_radius: '4px'
         },
         typography: {
            hero_title_size: '40px',
            hero_subtitle_size: '16px',
            section_title_size: '28px',
            body_text_size: '14px',
            button_text_size: '14px',
            card_title_size: '18px'
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
            active: true
         }
         
         console.log(`Applying ${theme.name} theme to all pages:`, themeData)

         // Apply theme to all pages concurrently
         const promises = [
            // Landing page
            (async () => {
               try {
                  const landingPage = await PageService.getLandingPage(organizationId)
                  await PageService.updateLandingPage(landingPage.id, themeData)
               } catch (error) {
                  if (error.message.includes('not found') || error.status === 404) {
                     const createData = await PageService.createLandingPage({
                        organization_id: organizationId,
                        user_id: 1,
                        title: 'Landing Page',
                        description: 'Organization landing page'
                     })
                     await PageService.updateLandingPage(createData.pageId, themeData)
                  } else {
                     throw error
                  }
               }
            })(),
            
            // About page
            (async () => {
               try {
                  const aboutPage = await PageService.getAboutPage(organizationId)
                  // Use about page ID instead of organization ID
                  await PageService.updateAboutPage(aboutPage.id, themeData)
               } catch (error) {
                  if (error.message.includes('not found') || error.status === 404) {
                     const createData = await PageService.createAboutPage({
                        organization_id: organizationId,
                        user_id: 1,
                        title: 'About Page',
                        description: 'Organization about page'
                     })
                     // Use the created about page ID
                     await PageService.updateAboutPage(createData.pageId, themeData)
                  } else {
                     throw error
                  }
               }
            })(),
            
            // Header page
            (async () => {
               try {
                  const headerPage = await PageService.getHeaderPage(organizationId)
                  const headerUpdateData = {
                     bgColor: theme.colors.bg_color,
                     textColor: theme.colors.p_color,
                     accentColor: theme.colors.accent_color,
                     active: true
                  }
                  // Use header page ID instead of organization ID
                  await PageService.updateHeaderPage(headerPage.id, headerUpdateData)
               } catch (error) {
                  if (error.message.includes('not found') || error.status === 404) {
                     const createData = await PageService.createHeaderPage({
                        organization_id: organizationId,
                        user_id: 1,
                     })
                     const newHeaderUpdateData = {
                        bgColor: theme.colors.bg_color,
                        textColor: theme.colors.p_color,
                        accentColor: theme.colors.accent_color,
                        organizationName: "Organization",
                        logo: "",
                        active: true
                     }
                     // Use the created header page ID
                     await PageService.updateHeaderPage(createData.pageId, newHeaderUpdateData)
                  } else {
                     throw error
                  }
               }
            })(),
            
            // Footer page
            (async () => {
               try {
                  const footerPage = await PageService.getFooterPage(organizationId)
                  const footerUpdateData = {
                     bgColor: theme.colors.bg_color,
                     textColor: theme.colors.p_color,
                     linkColor: theme.colors.accent_color,
                     organizationName: footerPage.organization_name || "Organization",
                     logo: footerPage.logo || "",
                     active: true
                  }
                  // Use footer page ID instead of organization ID
                  await PageService.updateFooterPage(footerPage.id, footerUpdateData)
               } catch (error) {
                  if (error.message.includes('not found') || error.status === 404) {
                     const createData = await PageService.createFooterPage({
                        organization_id: organizationId,
                        user_id: 1,
                     })
                     const newFooterUpdateData = {
                        bgColor: theme.colors.bg_color,
                        textColor: theme.colors.p_color,
                        linkColor: theme.colors.accent_color,
                        organizationName: "Organization",
                        logo: "",
                        active: true
                     }
                     // Use the created footer page ID
                     await PageService.updateFooterPage(createData.pageId, newFooterUpdateData)
                  } else {
                     throw error
                  }
               }
            })()
         ]

         // Wait for all pages to be updated
         await Promise.all(promises)

         // Refresh page status after applying theme to all pages
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
         
         // Fetch all pages' status concurrently
         const [landingPage, aboutPage, headerPage, footerPage] = await Promise.all([
            PageService.getLandingPage(organizationId),
            PageService.getAboutPage(organizationId),
            PageService.getHeaderPage(organizationId),
            PageService.getFooterPage(organizationId)
         ])

         const cards = [
            {
               title: "Landing Page",
               description: "Edit the landing page for your organization",
               href: `/org/${organizationId}/page/landing`,
               icon: <FaGlobe className="w-6 h-6 text-blue-600" />,
               status: landingPage.active == 1 ? "active" : "draft"
            },
            {
               title: "About Page",
               description: "Edit the about page for your organization",
               href: `/org/${organizationId}/page/about`,
               icon: <FaInfoCircle className="w-6 h-6 text-purple-600" />,
               status: aboutPage.active == 1? "active" : "draft"
            },
            {
               title: "Header Design",
               description: "Customize your organization's header",
               href: `/org/${organizationId}/page/header`,
               icon: <FaEdit className="w-6 h-6 text-green-600" />,
               status: headerPage.active == 1 ? "active" : "draft"
            },
            {
               title: "Footer Design",
               description: "Customize your organization's footer",
               href: `/org/${organizationId}/page/footer`,
               icon: <FaEdit className="w-6 h-6 text-orange-600" />,
               status: footerPage.active == 1 ? "active" : "draft"
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
      <div className="w-full bg-gray-50 min-h-screen">
         <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
               <h1 className="text-3xl font-light text-gray-900 mb-1">Pages</h1>
               <p className="text-gray-600">Manage your organization's public pages and apply consistent themes</p>
            </div>

            {/* Themes Section */}
            <div className="mb-8">
               <div className="flex items-center justify-between mb-4">
                  <div>
                     <h2 className="text-xl font-light text-gray-900">Quick Themes</h2>
                     <p className="text-gray-600 mt-1">Apply professional themes to all pages at once</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {themes.map((theme) => (
                     <div key={theme.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
                        {/* Color Preview */}
                        <div className="flex space-x-2 mb-3">
                           <div 
                              className="w-6 h-6 rounded border border-gray-200" 
                              style={{ backgroundColor: theme.colors.b_color }}
                           />
                           <div 
                              className="w-6 h-6 rounded border border-gray-200" 
                              style={{ backgroundColor: theme.colors.accent_color }}
                           />
                           <div 
                              className="w-6 h-6 rounded border border-gray-200" 
                              style={{ backgroundColor: theme.colors.p_color }}
                           />
                           <div 
                              className="w-6 h-6 rounded border border-gray-200" 
                              style={{ backgroundColor: theme.colors.s_color }}
                           />
                        </div>
                        
                        <h3 className="text-base font-medium text-gray-900 mb-1">{theme.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{theme.description}</p>
                        
                        <button
                           onClick={() => applyThemeToAllPages(theme)}
                           disabled={applyingTheme === theme.id}
                           className="w-full px-3 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
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
            </div>

            {/* Pages Grid */}
            <div className="mb-8">
               <h2 className="text-xl font-light text-gray-900 mb-4">Page Editor</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pageCards.map((page, index) => (
                     <Link 
                        key={index} 
                        href={page.href} 
                        className="group bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200"
                     >
                        <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-200">
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
   )
}

export default Pages