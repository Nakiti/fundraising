"use client"

import FilePreview from "./filePreview"
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
               <iframe key={index} src={url} className="overflow-x-hidden w-full h-36 border rounded-lg" title="PDF Preview" />
               <p className="mt-2 text-sm text-center">{file.name}</p>
            </div>
            
            );
      } else {
         return <p className="text-gray-500 mt-4">Unsupported file type</p>;
      }
   };

   return (
      <div className="w-full p-8 mb-8">
         <div className="flex flex-row space-x-4">

            <div className="w-2/3 bg-white rounded-lg shadow-sm mb-8">
               <div className="flex flex-row w-full justify-between items-center px-6 py-4 border-b border-gray-300">
                  <p className="text-2xl text-gray-800 font-semibold">Campaign Fliers:</p>
               </div>

               <div className="w-full p-6">
                  <label className="relative inline-block w-1/3 text-center bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600">
                  Upload a New Flyer
                  <input
                     type="file"
                     onChange={handleFileChange}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  </label>
               </div>

               <div className="grid grid-cols-4 gap-4 px-6 pb-4">
                  {files.map((item, index) => renderPreview(item.file, item.fileURL, index))}
               </div>
               

            </div>

            <div className="w-1/3 bg-white rounded-lg shadow-sm mb-8">
               <div className="flex flex-row w-full justify-between items-center px-6 py-4 border-b border-gray-300">
                  <p className="text-2xl text-gray-800 font-semibold">Quick Info:</p>
               </div>

               <div className="px-6 pb-6 py-4 flex flex-col space-y-6">

                  <div className="flex flex-col">
                     <p className="flex items-center text-gray-800 font-semibold text-md mb-2">
                        Campaign URL: 
                     </p>

                     <p className="text-lg text-gray-700">https://loclahostl:sdfsdfsdf/sd</p>
                  </div>

                  <div className="flex flex-col">
                     <p className="flex items-center text-gray-800 font-semibold text-md mb-2">
                        QR Code: 
                     </p>

                     <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example"
                        className="h-36 w-36 object-contain"
                     />
                  </div>

               </div>
            </div>
         </div>
      </div>
   )
}

export default Share