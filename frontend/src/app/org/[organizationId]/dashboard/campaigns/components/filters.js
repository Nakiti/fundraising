import { FaRegCheckCircle } from "react-icons/fa";
import { IoMegaphoneOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { getCampaignsFiltered, getCampaignsDateRange } from "@/app/services/fetchService";

const Filters = ({setData, organizationId}) => {
   const [startDate, setStartDate] = useState(null);
   const [endDate, setEndDate] = useState(null);

   const handleFilter = async (e) => {
      const response = await getCampaignsFiltered(organizationId, e.target.value)
      setData(response)
   }

   const handleDateChange = async (dates) => {
      const [start, end] = dates;
      setStartDate(start)
      setEndDate(end)

      if (start && end) {
         const response = await getCampaignsDateRange(start, end, organizationId);
         setData(response);
      } else {
         const response = await getCampaignsFiltered(organizationId, "all")
         setData(response)
      }
   };

   return (
<div className="flex flex-row mt-4 space-x-4">
  {/* Status Filter */}
  <div className="relative inline-flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
    <FaRegCheckCircle className="absolute left-3 text-gray-500" />
    <select
      className="pl-10 pr-4 py-2 text-sm text-gray-700 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      defaultValue="temp"
      onChange={handleFilter}
    >
      <option value="temp" disabled>Status</option>
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>

  {/* Campaign Type Filter */}
  <div className="relative inline-flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
    <IoMegaphoneOutline className="absolute left-3 text-gray-500" />
    <select
      className="pl-10 pr-4 py-2 text-sm text-gray-700 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      defaultValue="temp"
      onChange={handleFilter}
    >
      <option value="temp" disabled>Campaign Type</option>
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>

  {/* Date Range Picker */}
  <div className="relative inline-flex items-center bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-4 py-2">
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