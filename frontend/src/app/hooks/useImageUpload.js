//imports
import { useState } from "react";

/*
   Custom Hook: useImageUpload
   Description: handles image upload for set of inputs
*/
const useImageUpload = () => {
   const [imagePreview, setImagePreview] = useState(null);

   /**
    * 
    * @param {*} e event 
    * @param {*} handleInputsChange function to handle change of inputs
    */
   const handleImageUpload = (e, handleInputsChange) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            const base64Image = reader.result;
            setImagePreview(base64Image);
            handleInputsChange({ target: { name: e.target.name, value: base64Image } });
         };

         reader.readAsDataURL(file);
      }
   }

   return { imagePreview, handleImageUpload };
}

export default useImageUpload;

