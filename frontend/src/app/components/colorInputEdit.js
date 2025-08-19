/*
   Component: ColorInputEdit
   Description: A component that allows the user to input color and change colors on the display
   Props:
      - title: used as the description for the input
      - name: name property of the input
      - value: value property of the input
      - changeFun: onChange function for the input
*/
const ColorInputEdit = ({title, name, value, changeFunc}) => {
   return (
      <div className="mb-6">
         <label className="block text-sm font-medium text-gray-700 mb-3">{title}</label>
         <div className="relative">
            <input 
               type="color" 
               className="opacity-0 absolute inset-0 w-8 h-8 cursor-pointer rounded-lg"
               name={name}
               value={value}
               onChange={changeFunc}
               style={{ backgroundColor: value}}  
            />
            <div 
               className="w-8 h-8 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm hover:border-gray-400 transition-colors duration-200" 
               style={{ backgroundColor: value}}  
            />
         </div>
      </div>
   )
}

export default ColorInputEdit