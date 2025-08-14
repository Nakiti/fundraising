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

   // Form validation
   const {
      values: orgData,
      errors,
      touched,
      isValid,
      handleChange,
      handleBlur,
      handleSubmit,
      reset
   } = useFormValidation(
      {
         name: "",
         email: "",
         address: "",
         city: "",
         state: "",
         country: "", 
         zip: "",
         url: ""
      },
      {
         name: validationRules.organizationName,
         email: validationRules.email,
         address: validationRules.required,
         city: validationRules.required,
         state: validationRules.required,
         country: validationRules.required,
         zip: [
            { type: 'required', fieldName: 'Zipcode' },
            { type: 'custom', validator: (value) => {
               if (value && !/^\d{5}(-\d{4})?$/.test(value)) {
                  throw new Error('Please enter a valid zipcode');
               }
            }}
         ],
         url: validationRules.url
      },
      { validateOnChange: true, validateOnBlur: true }
   )

   // API hooks for creating organization
   const { submit: createOrg, loading: createOrgLoading } = useFormSubmit(
      async (data) => {
         const organizationId = await Services.Create.Organization.createOrganization(data, currentUser.id);
         await Services.Create.User.createUserOrganizationRelation(currentUser.id, organizationId, "active", "admin");
         return organizationId;
      }
   );

   const handleRegister = async (formData) => {
      try {
         await createOrg(formData);
         showSuccess('Organization Created', 'Your organization has been created successfully!');
         router.push("/profile");
      } catch (err) {
         console.error('Error creating organization:', err);
         showError('Creation Failed', err.message || 'Failed to create organization. Please try again.');
         throw err; // Re-throw to let the form handle it
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
            
               <form onSubmit={handleSubmit(handleRegister)} className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2">
                  <div className="col-span-2">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Organization Name</label>
                     <input
                        name="name"
                        type="text"
                        placeholder="Enter an Organization Name"
                        className={`p-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full ${
                           touched.name && errors.name
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        value={orgData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        disabled={createOrgLoading}
                     />
                     {touched.name && errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                     )}
                  </div>
            
                  <div className="col-span-2">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Organization URL</label>
                     <input
                        name="url"
                        type="url"
                        placeholder="Enter an Organization URL"
                        className={`p-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full ${
                           touched.url && errors.url
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        value={orgData.url}
                        onChange={(e) => handleChange('url', e.target.value)}
                        onBlur={() => handleBlur('url')}
                        disabled={createOrgLoading}
                     />
                     {touched.url && errors.url && (
                        <p className="mt-1 text-sm text-red-600">{errors.url}</p>
                     )}
                  </div>
            
                  <div className="col-span-2">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Organization Email</label>
                     <input
                        name="email"
                        type="email"
                        placeholder="Enter an Organization Email"
                        className={`p-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full ${
                           touched.email && errors.email
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        value={orgData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        disabled={createOrgLoading}
                     />
                     {touched.email && errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                     )}
                  </div>
            
                  <div className="col-span-2 md:col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Street Address</label>
                     <input
                        name="address"
                        type="text"
                        placeholder="Enter Street Address"
                        className={`p-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full ${
                           touched.address && errors.address
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        value={orgData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        onBlur={() => handleBlur('address')}
                        disabled={createOrgLoading}
                     />
                     {touched.address && errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                     )}
                  </div>
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">City</label>
                     <input
                        name="city"
                        type="text"
                        placeholder="Enter City"
                        className={`p-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full ${
                           touched.city && errors.city
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        value={orgData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        onBlur={() => handleBlur('city')}
                        disabled={createOrgLoading}
                     />
                     {touched.city && errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                     )}
                  </div>
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">State</label>
                     <input
                        name="state"
                        type="text"
                        placeholder="Enter State"
                        className={`p-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full ${
                           touched.state && errors.state
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        value={orgData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        onBlur={() => handleBlur('state')}
                        disabled={createOrgLoading}
                     />
                     {touched.state && errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                     )}
                  </div>
            
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Country</label>
                     <input
                        name="country"
                        type="text"
                        placeholder="Enter Country"
                        className={`p-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full ${
                           touched.country && errors.country
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        value={orgData.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        onBlur={() => handleBlur('country')}
                        disabled={createOrgLoading}
                     />
                     {touched.country && errors.country && (
                        <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                     )}
                  </div>
                  <div className="col-span-1">
                     <label className="block text-gray-700 text-sm font-medium mb-2">Zipcode</label>
                     <input
                        name="zip"
                        type="text"
                        placeholder="Enter Zipcode"
                        className={`p-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full ${
                           touched.zip && errors.zip
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        value={orgData.zip}
                        onChange={(e) => handleChange('zip', e.target.value)}
                        onBlur={() => handleBlur('zip')}
                        disabled={createOrgLoading}
                     />
                     {touched.zip && errors.zip && (
                        <p className="mt-1 text-sm text-red-600">{errors.zip}</p>
                     )}
                  </div>
               </form>
            
               <div className="flex items-center justify-center mt-8">
                  <button 
                     type="submit"
                     disabled={createOrgLoading || !isValid}
                     className="py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition w-full md:w-1/4 disabled:opacity-50 disabled:cursor-not-allowed"
                     onClick={() => handleSubmit(handleRegister)()}
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