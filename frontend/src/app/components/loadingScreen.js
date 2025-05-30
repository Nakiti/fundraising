import React from "react";


/*
   Component: LoadingScreen
   Description: A description that displays a loading state
*/
const LoadingScreen = () => {
   return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
         <div className="flex flex-col items-center space-y-4">
            <svg
               className="animate-spin h-12 w-12 text-blue-600"
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
            >
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"strokeWidth="4"/>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <p className="text-lg font-medium text-gray-600">Loading...</p>
         </div>
      </div>
   );
};

export default LoadingScreen;
