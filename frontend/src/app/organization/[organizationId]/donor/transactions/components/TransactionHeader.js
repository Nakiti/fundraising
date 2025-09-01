import { FaDownload } from "react-icons/fa";

const TransactionHeader = ({ onExport }) => {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
                    <p className="text-gray-600 mt-1">View and manage your donation history</p>
                </div>
                <button 
                    onClick={onExport}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <FaDownload className="w-4 h-4" />
                    <span>Export</span>
                </button>
            </div>
        </div>
    );
};

export default TransactionHeader;
