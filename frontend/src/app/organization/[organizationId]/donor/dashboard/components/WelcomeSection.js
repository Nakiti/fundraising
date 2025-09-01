import { FaHeart } from "react-icons/fa";

const WelcomeSection = ({ donor, hasLinkedDonations = false }) => {
    return (
        <div className="mb-8">
            <h1 className="text-xl font-medium text-slate-800">
                Welcome back, {donor.firstName}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Your donation overview and recent activity</p>
            
            {/* Account linking success message */}
            {hasLinkedDonations && (
                <div className="mt-5 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="flex items-start space-x-3">
                        <FaHeart className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-emerald-800">
                                All Your Donations in One Place
                            </h3>
                            <p className="text-xs text-emerald-600 mt-1 leading-relaxed">
                                Your account now includes all your previous donations, making it easy to track your giving history and impact.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WelcomeSection;
