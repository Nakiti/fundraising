import { useState } from 'react';

const useFormInput = (initialState = {}) => {
   const [inputs, setInputs] = useState(initialState);

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setInputs((prevInputs) => ({
         ...prevInputs,
         [name]: value,
      }));

      console.log(value)
   };

   return [inputs, handleInputChange, setInputs];
};

export default useFormInput;
