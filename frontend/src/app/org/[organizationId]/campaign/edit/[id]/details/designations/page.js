"use client"

import { FaTrash } from "react-icons/fa"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { getCampaignDesignations } from "@/app/services/fetchService"
import { deleteCampaignDesignationBatch } from "@/app/services/deleteService"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext"
import { AuthContext } from "@/app/context/authContext"
import { updateCampaignDetails } from "@/app/services/updateServices"
import { createCampaignDesignation } from "@/app/services/createServices"

const Designations = () => {
   const {designations, campaignDetails, handleCampaignDetailsChange, campaignId, campaignStatus, selectedDesignations, setSelectedDesignations, loading} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)

   const handleChange = (designation, isChecked) => {
      setSelectedDesignations(prev => {
         const exists = prev.some(item => item.id === designation.id)

         if (isChecked) {
            if (!exists) {
               return [...prev, designation]
            }
         } else {
            return prev.filter((item) => item.id !== designation.id)
         }
         return prev
      })
   }

   const handleRemove = (id) => {
      setSelectedDesignations(selectedDesignations.filter(item => item.id !== id))
   }  

   const handleSave = async() => {
      try {
         const existingRelations = await getCampaignDesignations(campaignId)
         const relationsToAdd = selectedDesignations.filter(designation =>!existingRelations.includes(designation))
         const relationsToRemove = existingRelations.filter(designation =>!selectedDesignations.includes(designation))

         console.log(relationsToAdd, relationsToRemove)
         if (relationsToAdd.length > 0) {
            await createCampaignDesignation(campaignId, relationsToAdd)
         }
         if (relationsToRemove.length > 0) {
            await deleteCampaignDesignationBatch(relationsToRemove)
         }

         await updateCampaignDetails(campaignId, campaignDetails, campaignStatus, currentUser)
      } catch (err) {
         console.log(err)
      }
   }

   // Show loading state while data is being fetched
   if (loading) {
      return (
         <div className="w-full max-w-4xl mx-auto py-8 px-6">
            <div className="animate-pulse">
               <div className="h-8 bg-gray-200 rounded mb-4"></div>
               <div className="h-4 bg-gray-200 rounded mb-8"></div>
               <div className="space-y-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="w-full max-w-4xl mx-auto py-8 px-6">
         <h1 className="text-4xl font-light text-gray-900 mb-4">Designations</h1>
         <h3 className="text-md text-gray-600 mb-8">Select the designations that users will be able to delegate their donation to:</h3>
         
         <div className="border-b border-gray-300 my-4"/>

         <div className="flex flex-row items-center py-4 w-full">
            <div className="flex flex-col w-1/3">
               <h1 className="text-xl font-semibold mb-2">Default <span className="text-red-500">*</span></h1>
               <p className="text-sm text-gray-600">Select the default designation that users will donate to.</p>
            </div>

            <div className="w-2/3 p-4">
               <select 
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={campaignDetails && (campaignDetails.defaultDesignation == 0 ? "" : campaignDetails.defaultDesignation)}
                  name="defaultDesignation"
                  onChange={handleCampaignDetailsChange}
               >
                  <option value="" disabled>Select an Option</option>
                  {designations && designations.map(item => (
                     <option value={item.id} key={item.id}>{item.title}</option>
                  ))}
               </select>
            </div>
         </div>

         <div className="border-b border-gray-300 my-4"/>

         <div className="px-2 py-4">
            <h1 className="text-xl font-semibold mb-2">Active Designations</h1>
            <p className="text-sm text-gray-600 w-1/2 mb-4">These are the designations that users will be able to direct their donations towards for this campaign.</p>

            {selectedDesignations && selectedDesignations.map((item, index) => (
               <div key={index} className="w-full p-4 bg-gray-100 flex flex-row justify-between rounded-md mb-2">
                  <p>{item.title}</p>
                  <button onClick={() => handleRemove(item.id)} className="text-gray-600 hover:text-red-500">
                     <FaTrash />
                  </button>
               </div>
            ))}
         </div>

         <div className="border-b border-gray-300 my-4"/>

         <div className="px-2 py-4">
            <h1 className="text-xl font-semibold mb-2">All Designations</h1>
            <p className="text-sm text-gray-600 w-1/2 mb-4">These are all active designations in your organization.</p>
            <div className="px-6">
               <table className="min-w-full bg-white border-gray-300 rounded-md">
                  <thead className="border-b border-gray-300">
                     <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Add</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Designation Title</th>
                     </tr>
                  </thead>
                  <tbody>
                     {designations && designations.map((item, index) => (
                        <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                           <td className="px-4 py-2 text-sm">
                              <input 
                                 type="checkbox" 
                                 value={item.id} 
                                 onChange={(e) => handleChange(item, e.target.checked)}
                                 checked={selectedDesignations && selectedDesignations.some(designation => designation.id === item.id)}
                                 className="focus:ring-2 focus:ring-blue-500"
                              />
                           </td>
                           <td className="px-4 py-2 text-sm text-start">{item.title}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
         <div className="w-full flex flex-row mt-6">
            <button 
               className="ml-auto bg-blue-600 px-6 py-3 w-40 rounded-md shadow-sm text-md text-white"
               onClick={handleSave}
            >
               Save
            </button>
         </div>
      </div>
   )
}

export default Designations