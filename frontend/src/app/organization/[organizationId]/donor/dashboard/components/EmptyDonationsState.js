import { FaHeart } from "react-icons/fa";

const EmptyDonationsState = ({ onMakeDonation }) => {
    return (
        <div className="py-16 px-8 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaHeart className="w-5 h-5 text-slate-300" />
            </div>
            <h3 className="text-sm font-medium text-slate-700 mb-1">No donations yet</h3>
            <p className="text-xs text-slate-400 mb-6">Start making a difference today</p>
            <button 
                onClick={onMakeDonation}
                className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-emerald-200 transition-colors"
            >
                Make Your First Donation
            </button>
        </div>
    );
};

export default EmptyDonationsState;
