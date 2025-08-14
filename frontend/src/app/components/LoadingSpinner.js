"use client";
import React from 'react';

const LoadingSpinner = ({ 
   size = 'md', 
   color = 'blue', 
   text = '', 
   fullScreen = false,
   className = '' 
}) => {
   const sizeClasses = {
      xs: 'h-4 w-4',
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16'
   };

   const colorClasses = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      gray: 'text-gray-600',
      white: 'text-white'
   };

   const spinner = (
      <div className={`flex items-center justify-center ${className}`}>
         <div className="flex flex-col items-center space-y-2">
            <svg 
               className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
               xmlns="http://www.w3.org/2000/svg" 
               fill="none" 
               viewBox="0 0 24 24"
            >
               <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
               />
               <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
               />
            </svg>
            {text && (
               <p className="text-sm text-gray-600 animate-pulse">{text}</p>
            )}
         </div>
      </div>
   );

   if (fullScreen) {
      return (
         <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            {spinner}
         </div>
      );
   }

   return spinner;
};

// Loading overlay component
export const LoadingOverlay = ({ 
   loading, 
   children, 
   text = 'Loading...',
   className = '' 
}) => {
   if (!loading) return children;

   return (
      <div className={`relative ${className}`}>
         {children}
         <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <LoadingSpinner text={text} />
         </div>
      </div>
   );
};

// Skeleton loading component
export const Skeleton = ({ 
   className = '', 
   lines = 1, 
   height = 'h-4',
   width = 'w-full' 
}) => {
   return (
      <div className={`animate-pulse ${className}`}>
         {Array.from({ length: lines }).map((_, index) => (
            <div 
               key={index}
               className={`bg-gray-200 rounded ${height} ${width} mb-2`}
            />
         ))}
      </div>
   );
};

// Card skeleton
export const CardSkeleton = ({ className = '' }) => {
   return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
         <Skeleton height="h-6" width="w-3/4" className="mb-4" />
         <Skeleton lines={3} className="mb-4" />
         <Skeleton height="h-8" width="w-1/3" />
      </div>
   );
};

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => {
   return (
      <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
         <div className="px-6 py-4 border-b border-gray-200">
            <Skeleton height="h-6" width="w-1/4" />
         </div>
         <div className="divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
               <div key={rowIndex} className="px-6 py-4">
                  <div className="flex space-x-4">
                     {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton 
                           key={colIndex} 
                           height="h-4" 
                           width={colIndex === 0 ? "w-1/4" : "w-1/6"} 
                        />
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default LoadingSpinner;
