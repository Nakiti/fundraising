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
      <div className="my-4">
         <p className="text-sm font-bold text-gray-600 mb-2">
            {title} <span className="text-red-500">*</span>
         </p>
         <label className="w-full h-20 flex items-center justify-center border border-dashed border-gray-400 rounded-sm bg-white cursor-pointer">
            <span className="text-gray-500 p-4">Click to upload an image</span>
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