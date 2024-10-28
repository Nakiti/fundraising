

const Transactions = () => {
   
   return (
      <div className="p-8 w-full min-h-full">
         <div className="bg-white rounded-lg shadow-md p-8 min-h-96 mb-4">
            <p className="text-2xl mb-6 text-gray-800">Transactions</p>
            <table className="min-w-full bg-white  border-gray-300 rounded-md">
               <thead className="border-b border-gray-300">
                  <tr>
                     <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">First Name</th>
                     <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">Last Name</th>
                     <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">Email</th>
                     <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">Amount</th>
                     <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">Method</th>
                  </tr>
               </thead>
               <tbody>
                  {/* {transactions && transactions.map((row, index) => (
                     <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="px-4 py-2 text-center text-sm">
                           <div className="flex items-center justify-center space-x-2">
                              <Link href={`/org/campaign/edit/${row.id}`}>
                                 <FaEdit className="text-lg mr-2" />
                              </Link>
                              <div className="border-r border-gray-400 h-6" />
                              <Link href={`/org/campaign/view/${row.id}`}>
                                 <IoMdOpen className="text-lg ml-2" />
                              </Link>
                           </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-center">{row.title}</td>
                        <td className="px-4 py-2 text-sm text-center">{new Date(row.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-sm text-center">{row.raised}</td>
                        <td className="px-4 py-2 text-sm text-center">{row.goal}</td>
                        <td className="px-4 py-2 text-sm text-center">{row.donations}</td>
                        <td className="px-4 py-2 text-sm text-center">{row.visits}</td>
                        <td className="px-4 py-2 text-sm text-center">{row.status}</td>
                     </tr>
                  ))} */}
               </tbody>
            </table>
         </div>

      </div>
   )
}

export default Transactions