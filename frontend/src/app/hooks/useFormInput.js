import { useState, useEffect } from 'react';

/**
 * A unified hook to manage form state for both text and file inputs.
 * @param {Object} initialState - The initial state for the entire form.
 * @returns {Array} - [inputs, handleChange, setInputs, filesToUpload]
 */
const useFormInput = (initialState = {}) => {
   const [inputs, setInputs] = useState(initialState);
   const [filesToUpload, setFilesToUpload] = useState({});

   const handleChange = (e) => {
      const { name, type } = e.target;

      if (type === 'file') {
         const { files } = e.target;
         if (files && files[0]) {
         const file = files[0];
         setFilesToUpload(prev => ({ ...prev, [name]: file }));
         setInputs(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
         }
      } else {
         const { value } = e.target;
         setInputs(prev => ({ ...prev, [name]: value }));
      }

      console.log("inputs", inputs)
   };

   useEffect(() => {
      const objectUrls = Object.values(inputs).filter(
         value => typeof value === 'string' && value.startsWith('blob:')
      );
      return () => {
         objectUrls.forEach(url => URL.revokeObjectURL(url));
      };
   }, [inputs]);

   // Return an array instead of an object
   // 1. inputs: State for UI (text values and preview URLs)
   // 2. handleChange: The smart handler for all inputs
   // 3. setInputs: The setter for populating the form
   // 4. filesToUpload: State for the actual File objects
   return [inputs, handleChange, setInputs, filesToUpload];
};

export default useFormInput;