import { FaDollarSign, FaCalendarAlt, FaHeart } from "react-icons/fa";

const SummaryCards = ({ summary, formatCurrency, formatDate }) => {
    const cards = [
        {
            title: "Total Donations",
            value: summary?.totalDonations || 0,
            subtitle: "Lifetime contributions",
            icon: FaHeart,
            iconBg: "bg-rose-50",
            iconColor: "text-rose-400"
        },
        {
            title: "Total Amount",
            value: formatCurrency(summary?.totalDonated),
            subtitle: "Impact generated",
            icon: FaDollarSign,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-400"
        },
        {
            title: "Last Donation",
            value: summary?.lastDonationDate ? formatDate(summary.lastDonationDate) : 'Never',
            subtitle: "Most recent activity",
            icon: FaCalendarAlt,
            iconBg: "bg-violet-50",
            iconColor: "text-violet-400"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-200 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-xs font-medium text-slate-500 mb-2">{card.title}</p>
                            <p className="text-2xl font-medium text-slate-800 mb-1">{card.value}</p>
                            <p className="text-xs text-slate-400">{card.subtitle}</p>
                        </div>
                        <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center ml-4 flex-shrink-0`}>
                            <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
