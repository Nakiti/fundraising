"use client"
import Table from "./components/table"
import Summary from "./components/summary"
import Modal from "./components/modal"
import { useState, useEffect, useContext } from "react"
import Searchbar from "./components/searchbar"
import Filters from "./components/filters"
import { getCampaignService } from "@/app/services"
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"

/*
   Component: Campaigns
   Description: renders campaigns page
*/
const Campaigns = ({params}) => {
   const organizationId = params.organizationId
   const [showModal, setShowModal] = useState(false)
   const [campaigns, setCampaigns] = useState([])
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   useEffect(() => {
      /*
         Description: Fetches all organizations corresponding to the organization
      */
      const fetchData = async() => {
         try {
            const campaignService = getCampaignService();
            const response = await campaignService.getCampaignsByOrganization(organizationId)
            setCampaigns(response.data)
            console.log(response)
         } catch (err) {
            const handledError = errorHandler.handle(err)
            setErrorMessage(handledError.message)
            setError(true)
            setCampaigns([]) // Ensure data is an array even on error
         }
      }

      fetchData()
   }, [organizationId])

   return (
      <div className="w-full bg-gray-50">
         <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
                  <p className="text-gray-600 mt-1">Manage and track your fundraising campaigns</p>
               </div>
               <button 
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  onClick={() => setShowModal(true)}
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Campaign</span>
               </button>
            </div>

            {/* Summary Cards */}
            {campaigns && <Summary campaigns={campaigns}/>}

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                  <Searchbar setData={setCampaigns} organizationId={organizationId}/>
                  <Filters setData={setCampaigns} organizationId={organizationId}/>
               </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               {campaigns && <Table setData={setCampaigns} data={campaigns} organizationId={organizationId}/>}
            </div>
         </div>

         {/* Modals */}
         {showModal && <Modal setShow={setShowModal} organizationId={organizationId}/>}
         {error && <ErrorModal message={errorMessage} setError={setError} />}
      </div>
   )
}

export default Campaigns