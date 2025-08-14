import { useState } from "react"
import debounce from "lodash/debounce"
import { TransactionService } from "@/app/services/fetchService"
import { errorHandler } from "@/app/services/apiClient"
import { IoIosSearch } from "react-icons/io";

const Searchbar = ({setData, organizationId}) => {
   const [query, setQuery] = useState("")

   const handleInputsChange = async (e) => {
      setQuery(e.target.value)
      debouncedSearch(e.target.value)
   }

   const debouncedSearch = debounce(async (query) => {
      try {
         const response = await TransactionService.searchTransactions(query, organizationId);
         setData(response)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Transaction search error:', handledError.message);
      }
   }, 300);

   const handleSearch = async() => {
      try {
         const response = await TransactionService.searchTransactions(query, organizationId)
         setData(response)
         console.log(response)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Transaction search error:', handledError.message)
      }
   }

   return (
      <div className="relative w-3/4 mb-2">
         <input 
            type="text"
            placeholder="Search for a Transaction"
            className="px-5 py-3 pr-12 w-full text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 transition-colors"
            value={query}
            onChange={handleInputsChange}
            onKeyDown={(e) => {
               if (e.key == "Enter") {
                  handleSearch()
               }
            }}
         />
         <IoIosSearch 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={handleSearch}
         />
      </div>
   )
}

export default Searchbar