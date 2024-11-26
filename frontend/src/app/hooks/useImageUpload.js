import { useState } from "react";


const useImageUpload = () => {
   const [imagePreview, setImagePreview] = useState(null);

   const handleImageUpload = (e, handlePreviewInputsChange) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            const base64Image = reader.result;
            setImagePreview(base64Image);
            handlePreviewInputsChange({ target: { name: e.target.name, value: base64Image } });
         };
         reader.readAsDataURL(file);
      }
   }

   return { imagePreview, handleImageUpload };
}

export default useImageUpload;

