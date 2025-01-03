
/*
   Component: Box
   Description: The box which the summary statistics are displayed in
   Props:
      - text: the content of the box
*/
const Box = ({text}) => {
   return (
      <div className="flex justify-center items-center p-4 text-center w-1/4 h-36 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 font-semibold text-md">
         {text}
      </div>
   )
}

export default Box