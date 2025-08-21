"use client"
import { useState, useContext, useEffect } from "react"
import { useFormValidation, validationRules } from "../hooks/useFormValidation"
import Header from "../components/header"
import { AuthContext } from "../context/authContext"
import { Services, useFormSubmit, useToast } from "../services"
import { useRouter } from "next/navigation"

const CreateOrganization = () => {
   const { currentUser, isLoggedIn, loading } = useContext(AuthContext)
   const router = useRouter()
   const { showError, showSuccess } = useToast()

   // Redirect to login if not authenticated and not loading
   useEffect(() => {
      if (!loading && !isLoggedIn) {
         router.push('/login');
      }
   }, [loading, isLoggedIn, router]);

   // Form state (no validation for now)
   const [orgData, setOrgData] = useState({
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      country: "", 
      zip: "",
      url: ""
   });

   const handleChange = (fieldName, value) => {
      setOrgData(prev => ({ ...prev, [fieldName]: value }));
   };

   // Loading state
   const [createOrgLoading, setCreateOrgLoading] = useState(false);

   const handleRegister = async () => {
      console.log("click")
      setCreateOrgLoading(true);
      
      try {
         console.log("Form submitted with data:", orgData);
         
         // Remove URL field since backend doesn't use it
         const { url, ...organizationData } = orgData;
         console.log("Organization data:", organizationData);
         
         // Create organization
         const organizationId = await Services.Create.Organization.createOrganization(organizationData, currentUser.id);
         console.log("Organization created with ID:", organizationId);
         console.log("Organization ID type:", typeof organizationId);
         console.log("Organization ID structure:", JSON.stringify(organizationId, null, 2));
         
         // Create user-organization relation
         await Services.Create.User.createUserOrganizationRelation(currentUser.id, organizationId.organizationId, "active", "admin");
         console.log("User-organization relation created");
         
         // Create landing page with default data
         const landingPageData = {
            title: orgData.name,
            description: `Welcome to ${orgData.name}`,
            organization_id: organizationId.organizationId
         };
         console.log("Landing page data:", landingPageData);
         console.log("Organization ID:", organizationId.organizationId);
         const landingPage = await Services.Create.Organization.createLandingPage(landingPageData, organizationId.organizationId);
         console.log("Landing page created:", landingPage);
         
         // Create about page with default data
         const aboutPageData = {
            title: `About ${orgData.name}`,
            description: `Learn more about ${orgData.name}`,
            headline: `About ${orgData.name}`,
            organization_id: organizationId.organizationId
         };
         const aboutPage = await Services.Create.Organization.createAboutPage(aboutPageData, organizationId.organizationId);
         console.log("About page created:", aboutPage);
         
         // Create header page
         const headerPage = await Services.Create.Organization.createHeaderPage(organizationId.organizationId, currentUser.id);
         console.log("Header page created:", headerPage);
         
         // Create footer page
         const footerPage = await Services.Create.Organization.createFooterPage(organizationId.organizationId, currentUser.id);
         console.log("Footer page created:", footerPage);
         
         // Initialize sections for all pages
         await Services.Create.Organization.initializeLandingPageSections(organizationId.organizationId, landingPage.pageId, currentUser.id);
         await Services.Create.Organization.initializeAboutPageSections(organizationId.organizationId, aboutPage.pageId, currentUser.id);
         await Services.Create.Organization.initializeHeaderPageSections(organizationId.organizationId, headerPage.pageId, currentUser.id);
         await Services.Create.Organization.initializeFooterPageSections(organizationId.organizationId, footerPage.pageId, currentUser.id);
         console.log("Sections initialized");
         
         showSuccess('Organization Created', 'Your organization has been created successfully!');
         router.push("/profile");
      } catch (err) {
         console.error('Error creating organization:', err);
         showError('Creation Failed', err.message || 'Failed to create organization. Please try again.');
      } finally {
         setCreateOrgLoading(false);
      }
   };

   // Show loading spinner while auth is being checked
   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
         </div>
      );
   }

   // Don't render if not authenticated (will redirect to login)
   if (!isLoggedIn) {
      return null;
   }

   return (
      <div>
         <Header />
         <div className="p-8">
            <div className="max-w-4xl bg-white rounded-lg shadow-lg p-10 mx-auto">
               <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Register an Organization</h1>
            
               <div className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2">
                  <div className="col-span-2">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Organization Name</label>
                     <input
                        name="name"
                        type="text"
                        placeholder="Enter an Organization Name"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={orgData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={createOrgLoading}
                     />
                  </div>
            
                  <div className="col-span-2">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Organization URL</label>
                     <input
                        name="url"
                        type="url"
                        placeholder="Enter an Organization URL"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={orgData.url}
                        onChange={(e) => handleChange('url', e.target.value)}
                        disabled={createOrgLoading}
                     />
                  </div>
            
                  <div className="col-span-2">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Organization Email</label>
                     <input
                        name="email"
                        type="email"
                        placeholder="Enter an Organization Email"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={orgData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled={createOrgLoading}
                     />
                  </div>
            
                  <div className="col-span-2 md:col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Street Address</label>
                     <input
                        name="address"
                        type="text"
                        placeholder="Enter Street Address"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={orgData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        disabled={createOrgLoading}
                     />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">City</label>
                     <input
                        name="city"
                        type="text"
                        placeholder="Enter City"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={orgData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        disabled={createOrgLoading}
                     />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">State</label>
                     <input
                        name="state"
                        type="text"
                        placeholder="Enter State"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={orgData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        disabled={createOrgLoading}
                     />
                  </div>
            
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Country</label>
                     <input
                        name="country"
                        type="text"
                        placeholder="Enter Country"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={orgData.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        disabled={createOrgLoading}
                     />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Zipcode</label>
                     <input
                        name="zip"
                        type="text"
                        placeholder="Enter Zipcode"
                        className="p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={orgData.zip}
                        onChange={(e) => handleChange('zip', e.target.value)}
                        disabled={createOrgLoading}
                     />
                  </div>
               </div>
            
               <div className="flex items-center justify-center mt-8">
                  <button 
                     type="button"
                     onClick={handleRegister}
                     disabled={createOrgLoading}
                     className="py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition w-full md:w-1/4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {createOrgLoading ? (
                        <div className="flex items-center justify-center">
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Creating...
                        </div>
                     ) : (
                        'Register'
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default CreateOrganization