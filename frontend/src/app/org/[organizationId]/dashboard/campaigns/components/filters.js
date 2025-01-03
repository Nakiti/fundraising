import { FaRegCheckCircle } from "react-icons/fa";
import { IoMegaphoneOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { getCampaignsFiltered, getCampaignsDateRange } from "@/app/services/fetchService";

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

      if (start && end) {
         const response = await getCampaignsDateRange(start, end, organizationId);
         setData(response);
      } else {
         const response = await getCampaignsFiltered(organizationId, "all")
         setData(response)
      }
   }

   useEffect(() => {
      const fetchData = async() => {
         const response = await getCampaignsFiltered(organizationId, status, type)
         setData(response)
      }

      fetchData()
   }, [status, type])

   return (
      <div className="flex flex-row mt-2 space-x-2">
         
         {/* Status Dropdown */}
         <div className="relative inline-flex items-center bg-white border border-gray-300 rounded-md shadow-sm">
            <FaRegCheckCircle className="absolute left-3 text-gray-500" />
            <select
               className="pl-10 pr-4 py-2 text-sm text-gray-700 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
               defaultValue="temp"
               onChange={handleFilter}
               name="status"
            >
               <option value="temp" disabled>Status</option>
               <option value="all">All</option>
               <option value="active">Active</option>
               <option value="inactive">Inactive</option>
            </select>
         </div>

         {/* Type Dropdown */}
         <div className="relative inline-flex items-center bg-white border border-gray-300 rounded-md shadow-sm">
            <IoMegaphoneOutline className="absolute left-3 text-gray-500" />
            <select
               className="pl-10 pr-4 py-2 text-sm text-gray-700 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
               defaultValue="temp"
               onChange={handleFilter}
               name="type"
            >
               <option value="temp" disabled>Campaign Type</option>
               <option value="all">All</option>
               <option value="donation">Donation</option>
               <option value="ticketed-event">Ticketed Event</option>
            </select>
         </div>

         {/* Date Dropdown */}
         <div className="relative inline-flex items-center bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-4 py-2">
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