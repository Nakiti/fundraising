"use client"
import { FaBell, FaPlus } from "react-icons/fa"
import Modal from "../../campaigns/components/modal"

const DashboardHeader = ({ 
   title = "Dashboard", 
   description = "Welcome back! Here's what's happening with your organization.",
   onRefresh,
   loading,
   showModal,
   setShowModal,
   organizationId
}) => {
   return (
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{description}</p>
         </div>
         <div className="flex items-center space-x-3">
            <button 
               onClick={onRefresh}
               disabled={loading}
               className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors duration-200 disabled:opacity-50"
               title="Refresh dashboard"
            >
               <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
               </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors duration-200">
               <FaBell className="w-5 h-5" />
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
               <FaPlus className="w-4 h-4" />
               <span>New Campaign</span>
            </button>
         </div>
         
         {showModal && <Modal setShow={setShowModal} organizationId={organizationId}/>}
      </div>
   )
}

export default DashboardHeader
