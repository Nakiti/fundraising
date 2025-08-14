/*
   Component: Box
   Description: The box which the summary statistics are displayed in
   Props:
      - title: the title of the statistic
      - value: the main value to display
      - subtitle: additional context text
*/
const Box = ({title, value, subtitle}) => {
   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
         <div className="text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-xs text-gray-400">{subtitle}</p>
         </div>
      </div>
   )
}

export default Box;