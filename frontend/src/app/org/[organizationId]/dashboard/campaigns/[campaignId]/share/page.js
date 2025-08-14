"use client"

import FilePreview from "../components/filePreview"
import { useState } from "react"

const Share = () => {
   const [files, setFiles] = useState([{file: "", fileURL: ""}])

   const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      setFiles([...files, {file: selectedFile, fileURL: URL.createObjectURL(selectedFile)}])
   };

   const renderPreview = (file, url, index) => {
      if (!file) return null;

      if (file.type === 'application/pdf') {
         return (
            <div className="flex flex-col">
               <iframe 
                  key={index} 
                  src={url} 
                  className="w-full h-48 border border-gray-200 rounded-lg shadow-sm" 
                  title="PDF Preview" 
               />
               <p className="mt-3 text-sm text-gray-600 text-center font-medium">{file.name}</p>
            </div>
         );
      } else {
         return <p className="text-gray-500 mt-4">Unsupported file type</p>;
      }
   };

   return (
      <div className="p-6 space-y-6">
         <div className="flex flex-col lg:flex-row gap-6">
            {/* Campaign Fliers Section */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">Campaign Materials</h2>
               </div>

               <div className="p-6">
                  <div className="mb-6">
                     <label className="relative inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload New Material
                        <input
                           type="file"
                           onChange={handleFileChange}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                     </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {files.map((item, index) => renderPreview(item.file, item.fileURL, index))}
                  </div>
               </div>
            </div>

            {/* Quick Info Section */}
            <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">Quick Info</h2>
               </div>

               <div className="p-6 space-y-6">
                  <div className="space-y-3">
                     <h3 className="text-sm font-semibold text-gray-900">Campaign URL</h3>
                     <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 break-all">
                           https://localhost:3000/campaign/example-url
                        </p>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <h3 className="text-sm font-semibold text-gray-900">QR Code</h3>
                     <div className="flex justify-center">
                        <img
                           src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example"
                           className="w-32 h-32 object-contain border border-gray-200 rounded-lg"
                           alt="QR Code"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Share