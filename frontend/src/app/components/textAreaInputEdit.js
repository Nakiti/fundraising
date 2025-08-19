
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
      <div className="mb-6">
         <label className="block text-sm font-semibold text-gray-700 mb-3">
            {title} <span className="text-red-500 ml-1">*</span>
         </label>
         <textarea 
            className="w-full px-4 py-3 text-gray-900 text-base leading-relaxed border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none placeholder-gray-400 hover:border-gray-400"
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