
/*
   Component: TextAreaInputEdit
   Description: A customized text area input
   Props:
      - title: the header for the input
      - rows: the number of rows for the textarea
      - placeholder: the placeholder text
      - name: the name property of the input
      - value: the value property of the input
      - changeFunc: the onChange function
*/
const TextAreaInputEdit = ({title, rows, placeholder, name, value, changeFunc}) => {

   return (
      <div className="my-4">
         <p className="text-sm font-bold text-gray-600 mb-2">
            {title} <span className="text-red-500">*</span>
         </p>
         <textarea 
            className="text-black text-xl w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
            rows={rows}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={changeFunc}
         />
      </div>
   )
}

export default TextAreaInputEdit