import { useState } from "react"
import debounce from "lodash/debounce"
import { getTransactionSearch } from "@/app/services/fetchService"
import { IoIosSearch } from "react-icons/io";

const Searchbar = ({setData, organizationId}) => {
   const [query, setQuery] = useState("")

   const handleInputsChange = async (e) => {
      setQuery(e.target.value)
      debouncedSearch(e.target.value)
   }

   const debouncedSearch = debounce(async (query) => {
      try {
         const response = await getTransactionSearch(query, organizationId);
         setData(response)
      } catch (err) {
         console.error(err);
      }
   }, 300);

   const handleSearch = async() => {
      try {
         const response = await getTransactionSearch(query, organizationId)
         setData(response)
         console.log(response)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="relative w-3/4">
         <input 
            type="text"
            placeholder="Search for a Transaction"
            className="px-4 py-2 pr-10 border-b border-gray-600 rounded-sm w-full focus:outline-none focus:border-blue-500"
            value={query}
            onChange={handleInputsChange}
            onKeyDown={(e) => {
               if (e.key == "Enter") {
                  handleSearch()
               }
            }}
         />
         <IoIosSearch 
            className="absolute right-3 w-5 h-5 top-1/2 transform -translate-y-1/2 text-gray-600" 
            onClick={handleSearch}
         />
      </div>
   )
}

export default Searchbar