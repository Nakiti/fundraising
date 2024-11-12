import { FaRegCheckCircle } from "react-icons/fa";
import { IoMegaphoneOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import {getAllCampaigns, getTransactionsByCampaign, getTransactionsByOrg, getTransactionsFiltered, getTransactionsOverTime } from "@/app/services/fetchService";

const Filters = ({setData, organizationId}) => {
   const [startDate, setStartDate] = useState(null);
   const [endDate, setEndDate] = useState(null);
   const [campaigns, setCampaigns] = useState(null)

   const handleFilter = async (e) => {
      const response = await getTransactionsFiltered(organizationId, e.target.value)
      setData(response)
   }

   const handleDateChange = async (dates) => {
      const [start, end] = dates;
      setStartDate(start)
      setEndDate(end)

      if (start && end) {
         const response = await getTransactionsOverTime(start, end, organizationId);
         setData(response);
      } else {
         const response = await getTransactionsByOrg(organizationId)
         setData(response)
      }
   };

   const handleCampaignFilter = async(e) => {
      try {
         const response = await getTransactionsByCampaign(e.target.value)
         setData(response)
      } catch (err) {
         console.log(err)
      }
   }

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await getAllCampaigns(organizationId)
            setCampaigns(response)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <div className="flex flex-row mt-4 space-x-4">
         <div className="relative inline-flex items-center">
            <FaRegCheckCircle className="absolute left-3 text-gray-800" />
            <select
               className="text-gray-800 font-semibold pl-8 pr-4 py-2 text-sm rounded-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
         <div className="relative inline-flex items-center">
            <IoMegaphoneOutline className="absolute left-3 text-gray-800" />
            <select
               className="text-gray-800 font-semibold pl-8 pr-4 py-2 text-sm rounded-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
               defaultValue="temp"
               onChange={handleCampaignFilter}
            >
               <option value="temp" disabled>Campaign</option>
               {campaigns && campaigns.map((item) => (
                  <option value={item.id}>{item.campaign_name}</option>
               ))}
            </select>
         </div>
         <div className="relative inline-flex items-center border border-gray-600 px-4">
            <FaRegCalendarAlt className="text-gray-800" />

            <DatePicker
               className="text-gray-800 font-semibold pl-8 py-2 text-sm rounded-sm  focus:outline-none"
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