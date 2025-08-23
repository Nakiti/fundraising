import Box from "../../campaigns/components/box"

const Summary = ({data}) => {
   // Calculate summary statistics from transaction data
   const summary = {
      totalAmount: data.reduce((acc, transaction) => acc + Number(transaction.amount || 0), 0),
      totalTransactions: data.length,
      averageAmount: data.length > 0 ? data.reduce((acc, transaction) => acc + Number(transaction.amount || 0), 0) / data.length : 0,
      successfulTransactions: data.filter(transaction => transaction.status === 'completed' || transaction.status === 'successful').length,
   }

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Box 
            title="Total Amount" 
            value={summary.totalAmount ? `$${summary.totalAmount.toLocaleString()}` : "$0"}
            subtitle="Total transaction value"
         />
         <Box 
            title="Total Transactions" 
            value={summary.totalTransactions ? summary.totalTransactions.toLocaleString() : "0"}
            subtitle="Number of transactions"
         />
         <Box 
            title="Average Amount" 
            value={summary.averageAmount ? `$${summary.averageAmount.toFixed(2)}` : "$0"}
            subtitle="Per transaction"
         />
         <Box 
            title="Successful" 
            value={summary.successfulTransactions ? summary.successfulTransactions.toLocaleString() : "0"}
            subtitle="Completed transactions"
         />
      </div>
   )
}

export default Summary