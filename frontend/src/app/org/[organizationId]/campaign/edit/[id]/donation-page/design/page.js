"use client"
import { useContext, useState } from "react"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";
import { getPageService } from "@/app/services";
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"
import { FaPalette, FaFont, FaMousePointer, FaRuler, FaSave, FaImage, FaUndo } from "react-icons/fa";

const Design = () => {
   const {campaignId, donationPageInputs, handleDonationPageInputsChange, donationPageSections, setDonationPageInputs} = useContext(DonationPageContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const [isLoading, setIsLoading] = useState(false)
   const [isDiscarding, setIsDiscarding] = useState(false)
   const [successMessage, setSuccessMessage] = useState("")
   
   const handleSave = async() => {
      setIsLoading(true)
      setError(false)
      setSuccessMessage("")
      
      try {
         // Get service instance
         const pageService = getPageService();
         
         // Update donation page
         await pageService.updateDonationPage(campaignId, donationPageInputs)
         
         // Update all sections in parallel (only those with valid IDs)
         const validSections = donationPageSections.filter(section => section.id && section.id > 0)
         if (validSections.length > 0) {
            const sectionPromises = validSections.map(section => 
               pageService.updatePageSection(section.id, section.active)
            )
            await Promise.all(sectionPromises)
         }
         
         setSuccessMessage("Donation page updated successfully!")
         setTimeout(() => setSuccessMessage(""), 3000)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      } finally {
         setIsLoading(false)
      }
   }

   const handleDiscard = async() => {
      setIsDiscarding(true)
      setError(false)
      setSuccessMessage("")
      
      try {
         const pageService = getPageService();
         const donationResponse = await pageService.getDonationPage(campaignId)
         
         setDonationPageInputs({
            // Basic Content
            headline: donationResponse.headline || "",
            description: donationResponse.description || "",
            subtitle: donationResponse.subtitle || "Fundraiser",
            mainHeadline: donationResponse.mainHeadline || "Making a Difference Together",
            mainText: donationResponse.mainText || "Our organization works tirelessly to create positive change in the community. Through innovative programs and dedicated volunteers, we're building a better future for everyone.",
            
            // Images
            banner_image: donationResponse.banner_image || "",
            small_image: donationResponse.small_image || "",
            
            // Colors
            bg_color: donationResponse.bg_color || "#ffffff",
            p_color: donationResponse.p_color || "#1f2937",
            s_color: donationResponse.s_color || "#3b82f6",
            b1_color: donationResponse.b1_color || "#3b82f6",
            b2_color: donationResponse.b2_color || "#6b7280",
            b3_color: donationResponse.b3_color || "#10b981",
            bt_color: donationResponse.bt_color || "#ffffff",
            
            // Banner Text Colors
            bannerTitleColor: donationResponse.bannerTitleColor || "#ffffff",
            bannerSubtitleColor: donationResponse.bannerSubtitleColor || "#e2e8f0",
            
            // Donation Amounts
            button1: donationResponse.button1 || 25,
            button2: donationResponse.button2 || 50,
            button3: donationResponse.button3 || 100,
            button4: donationResponse.button4 || 250,
            button5: donationResponse.button5 || 500,
            button6: donationResponse.button6 || 1000,
            
            // Campaign Stats
            goal_amount: donationResponse.goal_amount || 10000,
            raised_amount: donationResponse.raised_amount || 2450,
            donor_count: donationResponse.donor_count || 127,
            days_left: donationResponse.days_left || 23,
            
            // Layout Options
            show_progress: donationResponse.show_progress !== false,
            show_donor_count: donationResponse.show_donor_count !== false,
            show_days_left: donationResponse.show_days_left !== false,
            show_amount_grid: donationResponse.show_amount_grid !== false,
            
            // Button Text
            donate_button_text: donationResponse.donate_button_text || "Donate Now",
            share_button_text: donationResponse.share_button_text || "Share",
            
            // Footer
            footer_text: donationResponse.footer_text || "Your Organization",
            privacy_policy_url: donationResponse.privacy_policy_url || "#",
            terms_of_service_url: donationResponse.terms_of_service_url || "#",
            
            // Typography
            heroTitleSize: donationResponse.heroTitleSize || "36",
            heroSubtitleSize: donationResponse.heroSubtitleSize || "16",
            sectionTitleSize: donationResponse.sectionTitleSize || "28",
            bodyTextSize: donationResponse.bodyTextSize || "16",
            buttonTextSize: donationResponse.buttonTextSize || "16",
            cardTitleSize: donationResponse.cardTitleSize || "18",
            
            // Banner Typography
            bannerTitleSize: donationResponse.bannerTitleSize || "56",
            bannerSubtitleSize: donationResponse.bannerSubtitleSize || "20",
            
            // Layout
            heroHeight: donationResponse.heroHeight || "500",
            sectionPadding: donationResponse.sectionPadding || "80",
            cardRadius: donationResponse.cardRadius || "4",
            buttonRadius: donationResponse.buttonRadius || "4",
            
            // Visual Effects
            overlayOpacity: donationResponse.overlayOpacity || "0.3",
         })
         
         setSuccessMessage("Design reverted to last saved state!")
         setTimeout(() => setSuccessMessage(""), 3000)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      } finally {
         setIsDiscarding(false)
      }
   }

   const colorGroups = [
      {
         title: "Banner Text Colors",
         icon: <FaFont className="w-4 h-4" />,
         colors: [
            { name: "bannerTitleColor", label: "Banner Title Color", description: "Color for the main headline in the banner" },
            { name: "bannerSubtitleColor", label: "Banner Subtitle Color", description: "Color for the description text in the banner" }
         ]
      },
      {
         title: "Main Content Text Colors",
         icon: <FaFont className="w-4 h-4" />,
         colors: [
            { name: "p_color", label: "Primary Text Color", description: "Main text color for headings and important content" },
            { name: "s_color", label: "Secondary Text Color", description: "Color for body text and secondary content" }
         ]
      },
      {
         title: "Background Colors",
         icon: <FaPalette className="w-4 h-4" />,
         colors: [
            { name: "bg_color", label: "Background Color", description: "Main background color for the page" }
         ]
      },
      {
         title: "Banner Image Overlay",
         icon: <FaImage className="w-4 h-4" />,
         colors: [
            { name: "overlayOpacity", label: "Overlay Opacity", description: "Darkness of the overlay on banner images", type: "range", min: "0.1", max: "0.8", step: "0.1", defaultValue: "0.3" }
         ]
      },
      {
         title: "Button Styles",
         icon: <FaMousePointer className="w-4 h-4" />,
         colors: [
            { name: "b1_color", label: "Donate Button Color", description: "Background color for the main donate button" },
            { name: "bt_color", label: "Button Text Color", description: "Text color for button text" }
         ]
      }
   ]

   // const layoutOptions = [
   //    {
   //       name: "heroHeight",
   //       label: "Hero Section Height",
   //       type: "range",
   //       min: "300",
   //       max: "800",
   //       step: "50",
   //       defaultValue: "500",
   //       description: "Adjust the height of the main banner section"
   //    },
   //    {
   //       name: "sectionPadding",
   //       label: "Section Padding",
   //       type: "range",
   //       min: "40",
   //       max: "120",
   //       step: "20",
   //       defaultValue: "80",
   //       description: "Spacing between sections"
   //    },
   //    {
   //       name: "cardRadius",
   //       label: "Card Border Radius",
   //       type: "range",
   //       min: "0",
   //       max: "16",
   //       step: "2",
   //       defaultValue: "4",
   //       description: "Rounded corners for cards and containers"
   //    },
   //    {
   //       name: "buttonRadius",
   //       label: "Button Border Radius",
   //       type: "range",
   //       min: "0",
   //       max: "12",
   //       step: "2",
   //       defaultValue: "4",
   //       description: "Rounded corners for buttons"
   //    }
   // ]

   // const fontSizeOptions = [
   //    {
   //       name: "heroTitleSize",
   //       label: "Hero Title Size",
   //       type: "range",
   //       min: "24",
   //       max: "64",
   //       step: "2",
   //       defaultValue: "36",
   //       description: "Size of the main hero title"
   //    },
   //    {
   //       name: "heroSubtitleSize",
   //       label: "Hero Subtitle Size",
   //       type: "range",
   //       min: "14",
   //       max: "24",
   //       step: "1",
   //       defaultValue: "16",
   //       description: "Size of the hero subtitle/description"
   //    },
   //    {
   //       name: "sectionTitleSize",
   //       label: "Section Title Size",
   //       type: "range",
   //       min: "20",
   //       max: "48",
   //       step: "2",
   //       defaultValue: "28",
   //       description: "Size of section headings"
   //    },
   //    {
   //       name: "bodyTextSize",
   //       label: "Body Text Size",
   //       type: "range",
   //       min: "12",
   //       max: "18",
   //       step: "1",
   //       defaultValue: "16",
   //       description: "Size of body text and descriptions"
   //    },
   //    {
   //       name: "buttonTextSize",
   //       label: "Button Text Size",
   //       type: "range",
   //       min: "12",
   //       max: "18",
   //       step: "1",
   //       defaultValue: "16",
   //       description: "Size of button text"
   //    },
   //    {
   //       name: "cardTitleSize",
   //       label: "Card Title Size",
   //       type: "range",
   //       min: "14",
   //       max: "24",
   //       step: "1",
   //       defaultValue: "18",
   //       description: "Size of card titles"
   //    }
   // ]

   // const visualOptions = [
   //    {
   //       name: "overlayOpacity",
   //       label: "Hero Overlay Opacity",
   //       type: "range",
   //       min: "0.1",
   //       max: "0.8",
   //       step: "0.1",
   //       defaultValue: "0.3",
   //       description: "Darkness of the overlay on hero images"
   //    }
   // ]

   return (
      <div className="w-full space-y-4">
         <style jsx>{`
            input[type="range"]::-webkit-slider-thumb {
               appearance: none;
               height: 16px;
               width: 16px;
               border-radius: 50%;
               background: #3b82f6;
               cursor: pointer;
               border: 2px solid #ffffff;
               box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            input[type="range"]::-moz-range-thumb {
               height: 16px;
               width: 16px;
               border-radius: 50%;
               background: #3b82f6;
               cursor: pointer;
               border: 2px solid #ffffff;
               box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
         `}</style>
         {/* Color Customization */}
         {colorGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
               <div className="flex items-center space-x-2 mb-3">
                  <div className="p-1.5 bg-gray-50" style={{borderRadius: "4px"}}>
                     {group.icon}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{group.title}</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.colors.map((color, colorIndex) => (
                     <div key={colorIndex} className="space-y-1.5">
                        {color.type === "range" ? (
                           // Range slider for overlay opacity
                           <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                 <label className="text-xs font-medium text-gray-700">
                                    {color.label}
                                 </label>
                                 <span className="text-xs font-mono text-gray-400">
                                    {donationPageInputs[color.name] || color.defaultValue}
                                 </span>
                              </div>
                              <input 
                                 type="range"
                                 className="w-full h-2 bg-gray-200 appearance-none cursor-pointer rounded-lg"
                                 style={{
                                    borderRadius: "8px",
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((donationPageInputs[color.name] || color.defaultValue) - parseFloat(color.min)) / (parseFloat(color.max) - parseFloat(color.min)) * 100}%, #e5e7eb ${((donationPageInputs[color.name] || color.defaultValue) - parseFloat(color.min)) / (parseFloat(color.max) - parseFloat(color.min)) * 100}%, #e5e7eb 100%)`
                                 }}
                                 name={color.name}
                                 min={color.min}
                                 max={color.max}
                                 step={color.step}
                                 value={donationPageInputs[color.name] || color.defaultValue}
                                 onChange={handleDonationPageInputsChange}
                              />
                              <p className="text-xs text-gray-400">{color.description}</p>
                           </div>
                        ) : (
                           // Color picker for regular colors
                           <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-gray-700">
                                 {color.label}
                              </label>
                              <div className="relative">
                                 <input 
                                    type="color" 
                                    className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                                    style={{borderRadius: "4px"}}
                                    name={color.name}
                                    value={donationPageInputs[color.name]}
                                    onChange={handleDonationPageInputsChange}
                                 />
                                 <div 
                                    className="w-6 h-6 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors duration-200" 
                                    style={{ 
                                       backgroundColor: donationPageInputs[color.name],
                                       borderRadius: "4px"
                                    }}
                                 />
                              </div>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         ))}

         {/* Typography Customization */}
         {/* <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-4">
               <div className="p-1.5 bg-green-50" style={{borderRadius: "4px"}}>
                  <FaFont className="w-3 h-3 text-green-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Typography & Font Sizes</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-gray-700 border-b border-gray-200 pb-1">Banner Text</h4>
                  <div className="space-y-3">
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <label className="text-xs font-medium text-gray-700">Banner Title Size</label>
                           <span className="text-xs font-mono text-gray-400">
                              {donationPageInputs.bannerTitleSize || "56"}px
                           </span>
                        </div>
                        <input 
                           type="range"
                           className="w-full h-2 bg-gray-200 appearance-none cursor-pointer rounded-lg"
                           style={{
                              borderRadius: "8px",
                              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((donationPageInputs.bannerTitleSize || 56) - 32) / (80 - 32) * 100}%, #e5e7eb ${((donationPageInputs.bannerTitleSize || 56) - 32) / (80 - 32) * 100}%, #e5e7eb 100%)`
                           }}
                           name="bannerTitleSize"
                           min="32"
                           max="80"
                           step="2"
                           value={donationPageInputs.bannerTitleSize || "56"}
                           onChange={handleDonationPageInputsChange}
                        />
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <label className="text-xs font-medium text-gray-700">Banner Subtitle Size</label>
                           <span className="text-xs font-mono text-gray-400">
                              {donationPageInputs.bannerSubtitleSize || "20"}px
                           </span>
                        </div>
                        <input 
                           type="range"
                           className="w-full h-2 bg-gray-200 appearance-none cursor-pointer rounded-lg"
                           style={{
                              borderRadius: "8px",
                              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((donationPageInputs.bannerSubtitleSize || 20) - 14) / (28 - 14) * 100}%, #e5e7eb ${((donationPageInputs.bannerSubtitleSize || 20) - 14) / (28 - 14) * 100}%, #e5e7eb 100%)`
                           }}
                           name="bannerSubtitleSize"
                           min="14"
                           max="28"
                           step="1"
                           value={donationPageInputs.bannerSubtitleSize || "20"}
                           onChange={handleDonationPageInputsChange}
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-gray-700 border-b border-gray-200 pb-1">Main Content</h4>
                  <div className="space-y-3">
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <label className="text-xs font-medium text-gray-700">Section Title Size</label>
                           <span className="text-xs font-mono text-gray-400">
                              {donationPageInputs.sectionTitleSize || "36"}px
                           </span>
                        </div>
                        <input 
                           type="range"
                           className="w-full h-2 bg-gray-200 appearance-none cursor-pointer rounded-lg"
                           style={{
                              borderRadius: "8px",
                              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((donationPageInputs.sectionTitleSize || 36) - 24) / (48 - 24) * 100}%, #e5e7eb ${((donationPageInputs.sectionTitleSize || 36) - 24) / (48 - 24) * 100}%, #e5e7eb 100%)`
                           }}
                           name="sectionTitleSize"
                           min="24"
                           max="48"
                           step="2"
                           value={donationPageInputs.sectionTitleSize || "36"}
                           onChange={handleDonationPageInputsChange}
                        />
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <label className="text-xs font-medium text-gray-700">Body Text Size</label>
                           <span className="text-xs font-mono text-gray-400">
                              {donationPageInputs.bodyTextSize || "18"}px
                           </span>
                        </div>
                        <input 
                           type="range"
                           className="w-full h-2 bg-gray-200 appearance-none cursor-pointer rounded-lg"
                           style={{
                              borderRadius: "8px",
                              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((donationPageInputs.bodyTextSize || 18) - 14) / (22 - 14) * 100}%, #e5e7eb ${((donationPageInputs.bodyTextSize || 18) - 14) / (22 - 14) * 100}%, #e5e7eb 100%)`
                           }}
                           name="bodyTextSize"
                           min="14"
                           max="22"
                           step="1"
                           value={donationPageInputs.bodyTextSize || "18"}
                           onChange={handleDonationPageInputsChange}
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div> */}
         {/* <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-4">
               <div className="p-1.5 bg-green-50" style={{borderRadius: "4px"}}>
                  <FaFont className="w-3 h-3 text-green-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Typography & Font Sizes</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {fontSizeOptions.map((option, index) => (
                  <div key={index} className="space-y-2">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                           {option.label}
                        </label>
                        <span className="text-xs font-mono text-gray-400">
                           {donationPageInputs[option.name] || option.defaultValue}px
                        </span>
                     </div>
                     <input 
                        type={option.type}
                        className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer"
                        style={{borderRadius: "2px"}}
                        name={option.name}
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        value={donationPageInputs[option.name] || option.defaultValue}
                        onChange={handleDonationPageInputsChange}
                     />
                     <p className="text-xs text-gray-400">{option.description}</p>
                  </div>
               ))}
            </div>
         </div> */}

         {/* Layout Customization */}
         {/* <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-4">
               <div className="p-1.5 bg-blue-50" style={{borderRadius: "4px"}}>
                  <FaRuler className="w-3 h-3 text-blue-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Layout & Spacing</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {layoutOptions.map((option, index) => (
                  <div key={index} className="space-y-2">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                           {option.label}
                        </label>
                        <span className="text-xs font-mono text-gray-400">
                           {donationPageInputs[option.name] || option.defaultValue}{option.type === 'range' ? 'px' : ''}
                        </span>
                     </div>
                     <input 
                        type={option.type}
                        className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer"
                        style={{borderRadius: "2px"}}
                        name={option.name}
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        value={donationPageInputs[option.name] || option.defaultValue}
                        onChange={handleDonationPageInputsChange}
                     />
                     <p className="text-xs text-gray-400">{option.description}</p>
                  </div>
               ))}
            </div>
         </div> */}

         {/* Visual Effects */}
         {/* <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-2 mb-4">
               <div className="p-1.5 bg-purple-50" style={{borderRadius: "4px"}}>
                  <FaImage className="w-3 h-3 text-purple-600" />
               </div>
               <h3 className="text-sm font-medium text-gray-900">Visual Effects</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {visualOptions.map((option, index) => (
                  <div key={index} className="space-y-2">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                           {option.label}
                        </label>
                        <span className="text-xs font-mono text-gray-400">
                           {donationPageInputs[option.name] || option.defaultValue}
                        </span>
                     </div>
                     <input 
                        type="range"
                        className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer"
                        style={{borderRadius: "2px"}}
                        name={option.name}
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        value={donationPageInputs[option.name] || option.defaultValue}
                        onChange={handleDonationPageInputsChange}
                     />
                     <p className="text-xs text-gray-400">{option.description}</p>
                  </div>
               ))}
            </div>
         </div> */}

         {/* Save and Discard Actions */}
         <div className="bg-white border border-gray-100 p-4" style={{borderRadius: "4px"}}>
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-sm font-medium text-gray-900">Actions</h3>
                  {successMessage && (
                     <p className="text-xs text-green-600 mt-1">{successMessage}</p>
                  )}
               </div>
               <div className="flex items-center space-x-3">
                  <button 
                     className={`px-4 py-2 rounded-lg shadow-sm text-sm font-medium flex items-center space-x-2 transition-colors duration-200 ${
                        isDiscarding 
                           ? 'bg-gray-400 text-white cursor-not-allowed' 
                           : 'bg-gray-500 text-white hover:bg-gray-600'
                     }`}
                     onClick={handleDiscard}
                     disabled={isDiscarding || isLoading}
                  >
                     <FaUndo className="w-3 h-3" />
                     <span>{isDiscarding ? 'Discarding...' : 'Discard'}</span>
                  </button>
                  <button 
                     className={`px-6 py-2 rounded-lg shadow-sm text-sm font-medium flex items-center space-x-2 transition-colors duration-200 ${
                        isLoading 
                           ? 'bg-gray-400 text-white cursor-not-allowed' 
                           : 'bg-blue-600 text-white hover:bg-blue-700'
                     }`}
                     onClick={handleSave}
                     disabled={isLoading || isDiscarding}
                  >
                     <FaSave className="w-4 h-4" />
                     <span>{isLoading ? 'Saving...' : 'Save'}</span>
                  </button>
               </div>
            </div>
         </div>

         {/* Error Modal */}
         {error && (
            <ErrorModal
               message={errorMessage}
               setError={setError}
            />
         )}
      </div>
   )
}

export default Design