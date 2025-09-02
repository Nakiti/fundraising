"use client"

const LoadingSkeleton = () => {
   return (
      <div className="w-full bg-gray-50 min-h-screen">
         <div className="p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
               <div>
                  <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-96 h-4 bg-gray-200 rounded animate-pulse"></div>
               </div>
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
               </div>
            </div>

            {/* Time Filter Skeleton */}
            <div className="flex justify-end">
               <div className="w-80 h-12 bg-white rounded-lg shadow-sm animate-pulse"></div>
            </div>

            {/* Quick Stats Grid Skeleton */}
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
                           <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                           <div className="w-20 h-3 bg-gray-200 rounded"></div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Main Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Recent Activity Skeleton */}
               <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                     <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                     <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="p-6">
                     <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                           <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                 <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                                 <div>
                                    <div className="w-24 h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
                                    <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="w-16 h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
                                 <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Top Campaigns Skeleton */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                     <div className="w-28 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                     <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="p-6">
                     <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                           <div key={index} className="p-4 border border-gray-100 rounded-lg">
                              <div className="animate-pulse">
                                 <div className="flex items-center justify-between mb-2">
                                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                                    <div className="w-12 h-4 bg-gray-200 rounded"></div>
                                 </div>
                                 <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                       <div className="w-16 h-3 bg-gray-200 rounded"></div>
                                       <div className="w-20 h-3 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2"></div>
                                 </div>
                                 <div className="flex justify-between text-xs">
                                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                                    <div className="w-20 h-3 bg-gray-200 rounded"></div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Organization Status Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
               <div className="p-6 border-b border-gray-100">
                  <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
               </div>
               <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <div className="flex items-center justify-between mb-6">
                           <div className="w-36 h-5 bg-gray-200 rounded animate-pulse"></div>
                           <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                        <div className="space-y-4">
                           {Array.from({ length: 3 }).map((_, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                 <div className="flex items-center space-x-3">
                                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                 </div>
                                 <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div>
                        <div className="flex items-center justify-between mb-6">
                           <div className="w-28 h-5 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-3">
                           {Array.from({ length: 5 }).map((_, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                 <div className="flex items-center space-x-3">
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                                 </div>
                                 <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default LoadingSkeleton
