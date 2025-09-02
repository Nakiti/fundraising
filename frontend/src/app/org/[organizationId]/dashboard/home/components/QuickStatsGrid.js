"use client"
import { BsArrowUpRight, BsArrowDownRight } from "react-icons/bs"
import { FaHandHoldingHeart, FaUserPlus, FaDollarSign } from "react-icons/fa"
import { IoIosStats } from "react-icons/io"

const QuickStatsGrid = ({ quickStats, loading }) => {
   if (loading) {
      return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
               <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="animate-pulse">
                     <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                     </div>
                     <div className="mt-4">
                        <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      )
   }

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
               <div className="flex items-center justify-between">
                  <div className="p-2 bg-gray-50 rounded-lg">
                     {stat.icon}
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                     stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                     {stat.trend === 'up' ? <BsArrowUpRight className="w-4 h-4 mr-1" /> : <BsArrowDownRight className="w-4 h-4 mr-1" />}
                     {stat.change}
                  </div>
               </div>
               <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{stat.label}</p>
                  {stat.subtitle && (
                     <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  )}
               </div>
            </div>
         ))}
      </div>
   )
}

export default QuickStatsGrid
