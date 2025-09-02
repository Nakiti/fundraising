import { FaRegCheckCircle } from "react-icons/fa";
import { IoMegaphoneOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { getCampaignService, getTransactionService } from "@/app/services";
import { errorHandler } from "@/app/services/apiClient";

const Filters = ({setData, organizationId}) => {
   const [startDate, setStartDate] = useState(null);
   const [endDate, setEndDate] = useState(null);
   const [campaigns, setCampaigns] = useState(null)

   const handleFilter = async (e) => {
      try {
         const transactionService = getTransactionService();
         const response = await transactionService.getFilteredTransactions(organizationId, e.target.value)
         setData(response)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Transaction filter error:', handledError.message);
      }
   }

   const handleDateChange = async (dates) => {
      const [start, end] = dates;
      setStartDate(start)
      setEndDate(end)

      try {
         if (start && end) {
            const transactionService = getTransactionService();
            const response = await transactionService.getTransactionsOverTime(start, end, organizationId);
            setData(response);
         } else {
            const transactionService = getTransactionService();
            const response = await transactionService.getTransactionsByOrg(organizationId)
            setData(response)
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Transaction date filter error:', handledError.message);
      }
   };

   const handleCampaignFilter = async(e) => {
      try {
         const campaignId = e.target.value;
         if (campaignId === 'all') {
            const transactionService = getTransactionService();
            const response = await transactionService.getTransactionsByOrg(organizationId);
            setData(response);
         } else {
            const transactionService = getTransactionService();
            const response = await transactionService.getTransactionsByCampaignInOrg(campaignId, organizationId);
            setData(response);
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Transaction campaign filter error:', handledError.message);
      }
   }

   useEffect(() => {
      const fetchData = async() => {
         try {
            const campaignService = getCampaignService();
         const response = await campaignService.getCampaignsByOrganization(organizationId)
            setCampaigns(response)
         } catch (err) {
            const handledError = errorHandler.handle(err)
            console.error('Campaign fetch error:', handledError.message);
         }
      }

      fetchData()
   }, [])

   return (
      <div className="flex flex-row space-x-4">
  <div className="relative inline-flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
  <FaRegCheckCircle className="absolute left-3 text-gray-500" />
            <select
               className="pl-10 pr-4 py-3 text-sm text-gray-700 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors h-12"
               defaultValue="temp"
               onChange={handleFilter}
            >
               <option value="temp" disabled>Status</option>
               <option value="all">All</option>
               <option value="Completed">Completed</option>
               <option value="Pending">Pending</option>
               <option value="Failed">Failed</option>
            </select>
         </div>
         {/* <div className="relative inline-flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
            <IoMegaphoneOutline className="absolute left-3 text-gray-500" />
            <select
               className="pl-10 pr-4 py-2 text-sm text-gray-700 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
               defaultValue="temp"
               onChange={handleCampaignFilter}
            >
               <option value="temp" disabled>Campaign</option>
               <option value="all">All Campaigns</option>
               {campaigns && campaigns.map((item) => (
                  <option key={item.id} value={item.id}>{item.campaign_name}</option>
               ))}
            </select>
         </div> */}
         <div className="relative inline-flex items-center bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-4 py-3 h-12">
            <FaRegCalendarAlt className="text-gray-500" />

            <DatePicker
               className="ml-3 text-gray-700 font-semibold text-sm focus:outline-none"
               placeholderText="Select date range"
               selected={startDate}
               onChange={handleDateChange}
               startDate={startDate}
               endDate={endDate}
               selectsRange
               isClearable
            />
         </div>
      </div>
   )
}

export default Filters