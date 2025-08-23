"use client"
import Link from "next/link"
import Table from "./components/table"
import Modal from "./components/modal"
import { useState } from "react"

const Events = ({params}) => {
   const [showModal, setShowModal] = useState(false)
   const organizationId = params.organizationId
   const [data, setData] = useState(null)

   return (
      <div className="w-full bg-gray-50">
         <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Events</h1>
                  <p className="text-gray-600 mt-1">Manage and track your fundraising events</p>
               </div>
               <button 
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  onClick={() => setShowModal(true)}
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create New Event</span>
               </button>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <Table />
            </div>
         </div>

         {/* Modals */}
         {showModal && <Modal setShow={setShowModal} organizationId={organizationId}/>}
      </div>
   )
}

export default Events