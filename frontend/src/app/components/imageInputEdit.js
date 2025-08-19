//imports
import useImageUpload from "../hooks/useImageUpload"


/*
   Component: ImageInputEdit
   Description: A reusrable component for uploading images with a styled input field
   Props: 
      - title: header of the input
      - name: name property of the input
      - changeFunc: a function to handle the onChange property of the input
*/
const ImageInputEdit = ({title, name, changeFunc}) => {
   // Destructure the handleImageUpload function from the custom hook
   const {handleImageUpload} = useImageUpload()

   return (
      <div className="mb-6">
         <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            {title} <span className="text-red-500 ml-1">*</span>
         </p>
         <label className="group relative w-full h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all duration-200 cursor-pointer overflow-hidden">
            <div className="flex flex-col items-center justify-center text-center p-4">
               <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
               </svg>
               <span className="text-sm text-gray-600 group-hover:text-gray-700 font-medium">Click to upload an image</span>
               <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</span>
            </div>
            <input 
               type="file"
               className="hidden" 
               name={name}
               accept="image/*"
               onChange={(e) => handleImageUpload(e, changeFunc)}
            />
         </label>                  
      </div>
   )
}

export default ImageInputEdit