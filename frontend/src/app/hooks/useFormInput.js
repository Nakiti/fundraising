//imports
import { useState } from 'react';

/*
   Custom Hook: useFormInput
   Description: Manages the state and behavior for form inputs
*/
const useFormInput = (initialState = {}) => {
   const [inputs, setInputs] = useState(initialState);

   /*
      Function: handleInputChange
      Description: updates input state with new value for field that changed
   */
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setInputs((prevInputs) => ({
         ...prevInputs,
         [name]: value,
      }));
   };

   return [inputs, handleInputChange, setInputs];
};

export default useFormInput;
