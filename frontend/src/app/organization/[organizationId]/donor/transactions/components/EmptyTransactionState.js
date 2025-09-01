import { FaCalendarAlt } from "react-icons/fa";

const EmptyTransactionState = ({ hasTransactions, isFiltered }) => {
    return (
        <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                {!hasTransactions ? 'No transactions yet' : 'No transactions found'}
            </h3>
            <p className="text-gray-500">
                {!hasTransactions 
                    ? 'Start making donations to see your transaction history here.' 
                    : 'Try adjusting your search or filter criteria.'
                }
            </p>
        </div>
    );
};

export default EmptyTransactionState;
