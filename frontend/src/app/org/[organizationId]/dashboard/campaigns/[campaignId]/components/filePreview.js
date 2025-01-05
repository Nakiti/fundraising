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
         return <iframe src={fileURL} className="w-full h-64 border rounded-lg" title="PDF Preview"></iframe>;
      } else {
         return <p className="text-gray-500 mt-4">Unsupported file type</p>;
      }
   };

   return (
      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto">
         <label className="mb-4 text-lg font-semibold text-gray-700">
         Upload a File
         <input
            type="file"
            onChange={handleFileChange}
            className="block w-full mt-2 text-sm text-gray-500 border border-gray-300 rounded cursor-pointer
                        focus:outline-none focus:ring focus:border-blue-500"
         />
         </label>
         <div className="mt-4">{renderPreview()}</div>
      </div>
   );
};

export default FilePreview;
