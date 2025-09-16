"use client"
// import Link from "next/link"; // Replaced with <a> tag to resolve import error
import React, { useState, useEffect } from "react";
// Using react-icons for icons
import { FaArrowLeft, FaSave, FaUndo, FaEye, FaPalette, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
// import { useTheme } from "@/app/hooks/useTheme"; // Mocked below
// import { useFormSubmit } from "@/app/hooks/useApi"; // Mocked below
// import { getDefaultTheme, validateThemeData } from "@/app/utils/themeUtils"; // Mocked below

// --- MOCKED UTILS & HOOKS ---
// These are placeholder functions to make the component runnable without the original files.

const getDefaultTheme = () => ({
  primary_color: '#3b82f6',
  secondary_color: '#6366f1',
  accent_color: '#ec4899',
  background_color: '#f8fafc',
  surface_color: '#ffffff',
  text_primary_color: '#1e293b',
  text_secondary_color: '#475569',
  text_muted_color: '#94a3b8',
  button_background_color: '#3b82f6',
  button_text_color: '#ffffff',
  button_hover_color: '#2563eb',
  border_color: '#e2e8f0',
  divider_color: '#cbd5e1',
  success_color: '#22c55e',
  error_color: '#ef4444',
  warning_color: '#f59e0b',
});

const validateThemeData = (data) => {
  for (const key in data) {
    if (!/^#[0-9a-f]{6}$/i.test(data[key])) {
      // throw new Error(`Invalid hex code for ${key}`);
      console.warn(`Invalid hex code for ${key}: ${data[key]}`);
    }
  }
  return true;
};

const useTheme = (organizationId, options) => {
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        // Simulate fetching theme
        const timer = setTimeout(() => {
            setTheme(getDefaultTheme());
        }, 500);
        return () => clearTimeout(timer);
    }, [organizationId]);
    
    return {
        theme,
        loading: !theme,
        error: null,
        saveTheme: async (data) => { console.log("Saving theme:", data); return Promise.resolve(); },
        deleteTheme: async () => { console.log("Deleting theme"); return Promise.resolve(); },
        getColor: (key) => theme ? theme[key] : '',
        applyTheme: (data) => {
            console.log("Applying preview theme:", data);
            // In a real app, this would manipulate CSS variables on the document root
            document.documentElement.style.setProperty('--primary-color', data.primary_color);
            document.documentElement.style.setProperty('--background-color', data.background_color);
        }
    };
};

const useFormSubmit = (submitFunction, options) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            await submitFunction(data);
            setSuccess(true);
            if (options.autoReset) {
                setTimeout(() => setSuccess(false), options.autoResetDelay || 3000);
            }
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, success, error };
};


/*
   Component: Theme
   Description: Renders a modernized theme page, allowing users to change organization theme colors.
*/
const Theme = ({params = {organizationId: '123'}}) => {
   const organizationId = params.organizationId
   const [themeData, setThemeData] = useState(getDefaultTheme())
   const [hasChanges, setHasChanges] = useState(false)
   const [previewMode, setPreviewMode] = useState(false)
   
   // Get theme data and management functions
   const { 
      theme: currentTheme, 
      loading, 
      error, 
      saveTheme, 
      deleteTheme, 
      getColor,
      applyTheme 
   } = useTheme(organizationId, { autoApply: false })
   
   // Form submission handler
   const { submit: saveThemeData, loading: saving, success, error: saveError } = useFormSubmit(
      async (data) => {
         return await saveTheme(data)
      },
      { autoReset: true, autoResetDelay: 3000 }
   )
   
   // Load current theme data when available
   useEffect(() => {
      if (currentTheme) {
         setThemeData(currentTheme)
         setHasChanges(false)
      }
   }, [currentTheme])
   
   // Handle color changes
   const handleColorChange = (colorKey, value) => {
      // Basic hex color validation
      if (value.startsWith('#') && (value.length <= 7)) {
         const validHex = value.match(/^#([0-9a-f]{0,6})$/i);
         if (validHex) {
              setThemeData(prev => ({ ...prev, [colorKey]: value }));
              setHasChanges(true);
         }
      }
   }
   
   useEffect(() => {
    if (previewMode && hasChanges) {
        applyTheme(themeData);
    }
   }, [themeData, previewMode, hasChanges, applyTheme]);

   
   // Handle save
   const handleSave = async () => {
      try {
         validateThemeData(themeData)
         await saveThemeData(themeData)
         setHasChanges(false)
         setPreviewMode(false)
      } catch (error) {
         console.error('Failed to save theme:', error)
      }
   }
   
   // Handle reset to defaults
   const handleReset = async () => {
      try {
         await deleteTheme()
         const defaultTheme = getDefaultTheme();
         setThemeData(defaultTheme)
         if(previewMode) {
            applyTheme(defaultTheme);
         }
         setHasChanges(false)
      } catch (error) {
         console.error('Failed to reset theme:', error)
      }
   }
   

   // A modern, reusable color picker component
   const ColorPicker = ({ label, colorKey, description }) => (
      <div>
         <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
         <div className="flex items-center gap-3">
            <div className="relative w-6 h-6">
               <input 
                  type="color" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  value={themeData[colorKey] || '#ffffff'}
                  onChange={(e) => handleColorChange(colorKey, e.target.value)}
               />
               <div 
                  className="w-6 h-6 rounded-lg border-2 border-slate-300 cursor-pointer shadow-sm" 
                  style={{ backgroundColor: themeData[colorKey] || '#ffffff' }}  
               />
            </div>
            <div className="relative flex-1">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">#</span>
               <input
                  type="text"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={(themeData[colorKey] || '').replace('#', '')}
                  onChange={(e) => handleColorChange(colorKey, `#${e.target.value.replace(/[^0-9a-f]/gi, '')}`)}
                  placeholder="hexcode"
                  maxLength={6}
               />
            </div>
         </div>
         {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
      </div>
   )

   // Loading state with a modern spinner
   if (loading) {
      return (
         <div className="w-full bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
               <p className="text-slate-600">Loading theme settings...</p>
            </div>
         </div>
      )
   }
   
   const colorSections = [
        { 
            title: 'Brand Colors', 
            items: [
                { label: "Primary Color", colorKey: "primary_color", description: "Main brand color for important elements." },
                { label: "Secondary Color", colorKey: "secondary_color", description: "Supporting brand color." },
               //  { label: "Accent Color", colorKey: "accent_color", description: "Highlights and interactive elements." },
            ]
        },
        {
            title: 'Background Colors',
            items: [
                { label: "Background", colorKey: "background_color", description: "Main background for pages." },
               //  { label: "Surface", colorKey: "surface_color", description: "Background for cards and containers." },
            ]
        },
        {
            title: 'Text Colors',
            items: [
                { label: "Primary Text", colorKey: "text_primary_color", description: "For headings and important content." },
                { label: "Secondary Text", colorKey: "text_secondary_color", description: "For descriptions and body text." },
               //  { label: "Muted Text", colorKey: "text_muted_color", description: "For less important content." },
            ]
        },
        {
            title: 'Interactive Elements',
            items: [
                { label: "Button Background", colorKey: "button_background_color", description: "Background for primary buttons." },
                { label: "Button Text", colorKey: "button_text_color", description: "Text color for primary buttons." },
               //  { label: "Button Hover", colorKey: "button_hover_color", description: "Hover state for primary buttons." },
            ]
        },
      //   {
      //       title: 'UI Elements',
      //       items: [
      //           { label: "Border Color", colorKey: "border_color", description: "For borders and dividers." },
      //           { label: "Divider Color", colorKey: "divider_color", description: "For section dividers." },
      //       ]
      //   },
      //   {
      //       title: 'Status Colors',
      //       items: [
      //           { label: "Success", colorKey: "success_color", description: "For success messages and states." },
      //           { label: "Error", colorKey: "error_color", description: "For error messages and states." },
      //           { label: "Warning", colorKey: "warning_color", description: "For warning messages and states." },
      //       ]
      //   }
    ];

   // Main component render
   return (
      <div className="w-full h-full overflow-y-auto font-sans">
      <div className="p-6 bg-gray-50">
         <div className="w-full h-full p-8 bg-white rounded-lg shadow-sm">
            <a 
               href={`/org/${organizationId}/dashboard/settings`}
               className="text-gray-700 flex flex-row items-center space-x-2 mb-4"
            >
               <FaArrowLeft className="text-gray-700 w-4 h-4"/>
               <p>Settings</p>
            </a>
            <div className="p-6">
               <h1 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center gap-3">
                  <FaPalette className="w-8 h-8 text-blue-600"/>
                  Theme Settings
               </h1>
               <p className="text-gray-700">Customize your organization's color scheme and branding.</p>
            </div>
            
            {/* Success/Error Messages */}
            <div className="px-6 space-y-4 mb-6">
                {success && (
                   <div className="flex items-start gap-3 p-4 bg-green-100 border border-green-200 text-green-800 rounded-lg">
                      <FaCheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                      <div>
                         <h3 className="font-semibold">Success</h3>
                         <p className="text-sm">Theme saved successfully!</p>
                      </div>
                   </div>
                )}
                {(error || saveError) && (
                   <div className="flex items-start gap-3 p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg">
                      <FaExclamationCircle className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                       <div>
                         <h3 className="font-semibold">Error</h3>
                         <p className="text-sm">{error?.message || saveError?.message || 'An error occurred.'}</p>
                      </div>
                   </div>
                )}
            </div>

            <div className="w-full max-w-5xl p-6">
               <h2 className="text-xl font-semibold text-gray-800 mb-6">Color Palette:</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
                  {colorSections.map(section => (
                     <div key={section.title}>
                        <h3 className="text-lg font-medium text-gray-800 mb-4">{section.title}</h3>
                        <div className="space-y-6">
                         {section.items.map(item => (
                             <ColorPicker key={item.colorKey} {...item} />
                         ))}
                        </div>
                     </div>
                  ))}
               </div>

               <div className="flex justify-end items-center gap-3 mt-8 pt-6 border-t">
                   <button
                     onClick={handleReset}
                     className="px-6 py-2 bg-white text-gray-700 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                  >
                     Reset to Default
                  </button>
                  <button
                     onClick={handleSave}
                     disabled={!hasChanges || saving}
                     className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                     {saving ? 'Saving...' : 'Save Changes'}
                  </button>
               </div>
            </div>
         </div>
      </div>
   </div>
   )
}

export default Theme;

