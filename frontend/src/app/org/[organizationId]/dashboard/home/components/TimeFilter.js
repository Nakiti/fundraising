"use client"

const TimeFilter = ({ active, onFilterClick }) => {
   const periods = ["week", "month", "year"]

   return (
      <div className="flex justify-end">
         <div className="flex bg-white rounded-lg p-1 shadow-sm">
            {periods.map((period) => (
               <button
                  key={period}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                     active === period 
                        ? "bg-blue-600 text-white shadow-sm" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => onFilterClick(period)}
               >
                  {`This ${period.charAt(0).toUpperCase() + period.slice(1)}`}
               </button>
            ))}
         </div>
      </div>
   )
}

export default TimeFilter
