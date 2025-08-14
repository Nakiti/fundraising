import React, { useState } from 'react';

const FilePreview = () => {
   const [file, setFile] = useState(null);
   const [fileURL, setFileURL] = useState(null);

   const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      if (selectedFile) {
         setFileURL(URL.createObjectURL(selectedFile));
      } else {
         setFileURL(null);
      }
   };

   const renderPreview = () => {
      if (!file) return null;

      if (file.type === 'application/pdf') {
         return (
            <div className="space-y-3">
               <iframe 
                  src={fileURL} 
                  className="w-full h-64 border border-gray-200 rounded-lg shadow-sm" 
                  title="PDF Preview"
               />
               <p className="text-sm text-gray-600 text-center font-medium">{file.name}</p>
            </div>
         );
      } else {
         return (
            <div className="text-center py-8">
               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <p className="mt-2 text-sm text-gray-500">Unsupported file type</p>
            </div>
         );
      }
   };

   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
         <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload a File</h3>
            
            <label className="relative inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
               </svg>
               Choose File
               <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               />
            </label>
            
            <div className="mt-6">
               {renderPreview()}
            </div>
         </div>
      </div>
   );
};

export default FilePreview;
