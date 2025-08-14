import { useState } from "react"
import debounce from "lodash/debounce"
import { CampaignService } from "@/app/services/fetchService"
import { errorHandler } from "@/app/services/apiClient"
import { IoIosSearch } from "react-icons/io";

/*
   Component: Searchbar
   Description: Searchbar to find campaigns by title
   Props:
      setData: change the campaign data displayed
      organizationId: id of the organization
*/
const Searchbar = ({setData, organizationId}) => {
   const [query, setQuery] = useState("")

   /*
      Description: handle change of the query input
   */
   const handleInputsChange = async (e) => {
      setQuery(e.target.value)
      debouncedSearch(e.target.value)
   }

   /*
      Description: debounced search to search campaigns after every user key press (300ms delay)
   */
   const debouncedSearch = debounce(async (query) => {
      try {
         const response = await CampaignService.searchCampaigns(query, organizationId);
         setData(response)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Search error:', handledError.message);
      }
   }, 300);

   /*
      Description: retrieves campaigns that matched query
   */
   const handleSearch = async() => {
      try {
         const response = await CampaignService.searchCampaigns(query, organizationId)
         setData(response)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Search error:', handledError.message)
      }
   }

   return (
      <div className="relative flex-1">
         <div className="relative">
            <input
               type="text"
               placeholder="Search campaigns by name..."
               className="w-full pl-4 pr-12 py-3 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
               value={query}
               onChange={handleInputsChange}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     handleSearch();
                  }
               }}
            />
            <button
               className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
               onClick={handleSearch}
            >
               <IoIosSearch className="w-5 h-5" />
            </button>
         </div>
      </div>
   )
}

export default Searchbar