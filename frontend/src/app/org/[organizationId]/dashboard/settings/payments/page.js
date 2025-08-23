"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { StripeService } from '@/app/services/stripeService'
import { FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa'

const PaymentSettings = () => {
   const params = useParams()
   const organizationId = params.organizationId
   
   const [accountStatus, setAccountStatus] = useState(null)
   const [loading, setLoading] = useState(true)
   const [setupLoading, setSetupLoading] = useState(false)
   const [error, setError] = useState("")
   const [success, setSuccess] = useState("")

   useEffect(() => {
      fetchAccountStatus()
   }, [organizationId])

   const fetchAccountStatus = async () => {
      try {
         setLoading(true)
         setError("")
         
         const status = await StripeService.getAccountStatus(organizationId)
         setAccountStatus(status)
      } catch (err) {
         console.error('Failed to fetch account status:', err)
         setError('Failed to load payment settings. Please try again.')
      } finally {
         setLoading(false)
      }
   }

   const handleSetupStripe = async () => {
      try {
         setSetupLoading(true)
         setError("")
         
         // Create Connect account
         await StripeService.createConnectAccount(organizationId, 'admin@example.com', 'US')
         
         // Create account link for onboarding
         const accountLink = await StripeService.createAccountLink(
            organizationId,
            `${window.location.origin}/org/${organizationId}/dashboard/settings/payments`,
            `${window.location.origin}/org/${organizationId}/dashboard/settings/payments`
         )
         
         // Redirect to Stripe onboarding
         window.location.href = accountLink.url
         
      } catch (err) {
         console.error('Failed to setup Stripe:', err)
         setError('Failed to setup Stripe Connect. Please try again.')
         setSetupLoading(false)
      }
   }

   const handleCompleteSetup = async () => {
      try {
         setSetupLoading(true)
         setError("")
         
         const accountLink = await StripeService.createAccountLink(
            organizationId,
            `${window.location.origin}/org/${organizationId}/dashboard/settings/payments`,
            `${window.location.origin}/org/${organizationId}/dashboard/settings/payments`
         )
         
         window.location.href = accountLink.url
         
      } catch (err) {
         console.error('Failed to create account link:', err)
         setError('Failed to complete setup. Please try again.')
         setSetupLoading(false)
      }
   }

   const getStatusColor = (status) => {
      switch (status) {
         case 'enabled':
            return 'text-green-600'
         case 'restricted':
            return 'text-yellow-600'
         case 'pending':
            return 'text-blue-600'
         default:
            return 'text-gray-600'
      }
   }

   const getStatusIcon = (status) => {
      switch (status) {
         case 'enabled':
            return <FaCheckCircle className="text-green-600" />
         case 'restricted':
            return <FaExclamationTriangle className="text-yellow-600" />
         case 'pending':
            return <FaSpinner className="animate-spin text-blue-600" />
         default:
            return <FaCreditCard className="text-gray-600" />
      }
   }

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
               <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
               <p className="text-gray-600">Loading payment settings...</p>
            </div>
         </div>
      )
   }

   return (
      <div className="max-w-4xl mx-auto p-6">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Settings</h1>
            <p className="text-gray-600">
               Configure Stripe Connect to receive donations directly to your organization's account.
            </p>
         </div>

         {/* Error Display */}
         {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
               {error}
            </div>
         )}

         {/* Success Display */}
         {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
               {success}
            </div>
         )}

         {/* Account Status Card */}
         <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-semibold text-gray-900">Stripe Connect Account</h2>
               {accountStatus?.hasStripeAccount && (
                  <div className="flex items-center space-x-2">
                     {getStatusIcon(accountStatus.accountStatus)}
                     <span className={`font-medium ${getStatusColor(accountStatus.accountStatus)}`}>
                        {accountStatus.accountStatus?.toUpperCase() || 'UNKNOWN'}
                     </span>
                  </div>
               )}
            </div>

            {!accountStatus?.hasStripeAccount ? (
               <div className="text-center py-8">
                  <FaCreditCard className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Stripe Account</h3>
                  <p className="text-gray-600 mb-6">
                     Set up Stripe Connect to start receiving donations directly to your organization.
                  </p>
                  <button
                     onClick={handleSetupStripe}
                     disabled={setupLoading}
                     className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
                  >
                     {setupLoading ? (
                        <>
                           <FaSpinner className="animate-spin mr-2" />
                           Setting up...
                        </>
                     ) : (
                        <>
                           <FaCreditCard className="mr-2" />
                           Setup Stripe Connect
                        </>
                     )}
                  </button>
               </div>
            ) : (
               <div className="space-y-4">
                  {/* Account Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Account ID
                        </label>
                        <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                           {accountStatus.stripeAccountId}
                        </p>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Status
                        </label>
                        <div className="flex items-center space-x-2">
                           {getStatusIcon(accountStatus.accountStatus)}
                           <span className={`text-sm font-medium ${getStatusColor(accountStatus.accountStatus)}`}>
                              {accountStatus.accountStatus?.toUpperCase() || 'UNKNOWN'}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Capabilities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Charges Enabled
                        </label>
                        <div className="flex items-center space-x-2">
                           {accountStatus.chargesEnabled ? (
                              <FaCheckCircle className="text-green-600" />
                           ) : (
                              <FaExclamationTriangle className="text-red-600" />
                           )}
                           <span className={`text-sm font-medium ${accountStatus.chargesEnabled ? 'text-green-600' : 'text-red-600'}`}>
                              {accountStatus.chargesEnabled ? 'Yes' : 'No'}
                           </span>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Payouts Enabled
                        </label>
                        <div className="flex items-center space-x-2">
                           {accountStatus.payoutsEnabled ? (
                              <FaCheckCircle className="text-green-600" />
                           ) : (
                              <FaExclamationTriangle className="text-red-600" />
                           )}
                           <span className={`text-sm font-medium ${accountStatus.payoutsEnabled ? 'text-green-600' : 'text-red-600'}`}>
                              {accountStatus.payoutsEnabled ? 'Yes' : 'No'}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Requirements */}
                  {accountStatus.requirements && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Requirements
                        </label>
                        <div className="bg-gray-50 p-3 rounded">
                           <ul className="text-sm text-gray-700 space-y-1">
                              {accountStatus.requirements.currently_due && accountStatus.requirements.currently_due.length > 0 ? (
                                 accountStatus.requirements.currently_due.map((requirement, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                       <FaExclamationTriangle className="text-yellow-600 flex-shrink-0" />
                                       <span>{requirement}</span>
                                    </li>
                                 ))
                              ) : (
                                 <li className="flex items-center space-x-2">
                                    <FaCheckCircle className="text-green-600 flex-shrink-0" />
                                    <span>All requirements completed</span>
                                 </li>
                              )}
                           </ul>
                        </div>
                     </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4">
                     {!accountStatus.onboardingCompleted && (
                        <button
                           onClick={handleCompleteSetup}
                           disabled={setupLoading}
                           className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                           {setupLoading ? (
                              <>
                                 <FaSpinner className="animate-spin mr-2" />
                                 Loading...
                              </>
                           ) : (
                              <>
                                 <FaExternalLinkAlt className="mr-2" />
                                 Complete Setup
                              </>
                           )}
                        </button>
                     )}
                     
                     <button
                        onClick={fetchAccountStatus}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 flex items-center"
                     >
                        <FaSpinner className="mr-2" />
                        Refresh Status
                     </button>
                  </div>
               </div>
            )}
         </div>

         {/* Information Card */}
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How Stripe Connect Works</h3>
            <div className="space-y-3 text-sm text-blue-800">
               <p>
                  <strong>Direct Payments:</strong> Donations go directly to your organization's Stripe account, not through our platform.
               </p>
               <p>
                  <strong>Faster Access:</strong> You can access funds immediately and manage payouts through your own Stripe dashboard.
               </p>
               <p>
                  <strong>Compliance:</strong> Each organization maintains their own compliance and tax reporting requirements.
               </p>
               <p>
                  <strong>Fees:</strong> Standard Stripe processing fees apply (2.9% + 30¢ per transaction).
               </p>
            </div>
         </div>
      </div>
   )
}

export default PaymentSettings
