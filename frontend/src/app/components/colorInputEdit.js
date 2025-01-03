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
         <p className="text-xs font-bold text-gray-600 mb-2">{title}</p>
         <div className="relative">
            <input 
               type="color" 
               className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
               name={name}
               value={value}
               onChange={changeFunc}
               style={{ backgroundColor: value}}  
            />
            <div 
               className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer" 
               style={{ backgroundColor: value}}  
            />
         </div>
      </div>
   )
}

export default ColorInputEdit