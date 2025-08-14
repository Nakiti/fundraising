import { FaRegCheckCircle } from "react-icons/fa";
import { IoMegaphoneOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { CampaignService } from "@/app/services/fetchService";
import { errorHandler } from "@/app/services/apiClient";

/*
   Component: Filters
   Description: A component which allows the user to filter the organizations that are retrieved
   Props:
      - setData: function to update the data displayed
      - organizationId: id of current organization
*/
const Filters = ({setData, organizationId}) => {
   const [startDate, setStartDate] = useState(null);
   const [endDate, setEndDate] = useState(null);
   const [status, setStatus] = useState("all")
   const [type, setType] = useState("all")

   /*
      Description: Changes filter to the value which the user inputs
   */
   const handleFilter = async (e) => {
      if (e.target.name == "status") {
         setStatus(e.target.value)
      } else if (e.target.name == "type") {
         setType(e.target.value)
      }
   }

   /*
      Description: Fetches campaigns that fall within the specified date range
                  if one of the start/end values are null, it defaults to retreiving all campaigns
      Props:
         - dates: the start and end dates
   */
   const handleDateChange = async (dates) => {
      const [start, end] = dates;
      setStartDate(start)
      setEndDate(end)

      try {
         if (start && end) {
            const response = await CampaignService.getCampaignsByDateRange(start, end, organizationId);
            setData(response);
         } else {
            const response = await CampaignService.getFilteredCampaigns(organizationId, "all")
            setData(response)
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Date filter error:', handledError.message);
      }
   }

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await CampaignService.getFilteredCampaigns(organizationId, status, type)
            setData(response)
         } catch (err) {
            const handledError = errorHandler.handle(err)
            console.error('Filter error:', handledError.message);
         }
      }

      fetchData()
   }, [status, type])

   return (
      <div className="flex flex-wrap gap-3">
         {/* Status Dropdown */}
         <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <FaRegCheckCircle className="h-4 w-4 text-gray-400" />
            </div>
            <select
               className="pl-10 pr-8 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
               value={status}
               onChange={handleFilter}
               name="status"
            >
               <option value="all">All Status</option>
               <option value="active">Active</option>
               <option value="inactive">Inactive</option>
            </select>
         </div>

         {/* Type Dropdown */}
         <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <IoMegaphoneOutline className="h-4 w-4 text-gray-400" />
            </div>
            <select
               className="pl-10 pr-8 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
               value={type}
               onChange={handleFilter}
               name="type"
            >
               <option value="all">All Types</option>
               <option value="donation">Donation</option>
               <option value="ticketed-event">Ticketed Event</option>
            </select>
         </div>

         {/* Date Range Picker */}
         <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <FaRegCalendarAlt className="h-4 w-4 text-gray-400" />
            </div>
            <DatePicker
               className="pl-10 pr-4 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full"
               placeholderText="Select date range"
               selected={startDate}
               onChange={handleDateChange}
               startDate={startDate}
               endDate={endDate}
               selectsRange
               isClearable
               dateFormat="MMM dd, yyyy"
            />
         </div>
      </div>
   )
}

export default Filters