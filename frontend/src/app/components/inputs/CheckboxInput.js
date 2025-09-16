const CheckboxInput = ({title, name, value, changeFunc, description}) => {

    return (
        <div className="mt-8 ">
            <div className="flex items-center space-x-3">
                <input
                    name={name}
                    type="checkbox"
                    checked={value || false}
                    onChange={(e) => changeFunc(e)}
                    className="w-4 h-4 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label 
                    htmlFor={name}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                    {title}
                </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-7">
                {description}
            </p>
        </div>
    )
}

export default CheckboxInput;