

const TextInput = ({title, name, value, changeFunc, placeholder, type, min, max}) => {
    return (
        <div className="flex flex-col col-span-1 sm:col-span-2">
        <label className="text-gray-600 text-sm font-semibold mb-2">
           {title} <span className="text-red-500">*</span>
        </label>               
        <input
           name={name}
           type={type}
           placeholder={placeholder}
           className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
           value={value || ""}
           onChange={changeFunc}
           min={min}
           max={max}
        />
     </div>
    )
}

export default TextInput;