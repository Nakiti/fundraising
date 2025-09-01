import EmptyDonationsState from './EmptyDonationsState';

const RecentDonationsTable = ({ donations, formatCurrency, formatDate, onMakeDonation }) => {
    if (donations.length === 0) {
        return <EmptyDonationsState onMakeDonation={onMakeDonation} />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-slate-100">
                        <th className="px-5 py-4 text-left text-xs font-medium text-slate-500">
                            Date
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-medium text-slate-500">
                            Campaign
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-medium text-slate-500">
                            Designation
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-medium text-slate-500">
                            Amount
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-medium text-slate-500">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {donations.slice(0, 10).map((donation, index) => (
                        <tr key={donation.id} className={`hover:bg-slate-25 transition-colors ${index !== donations.slice(0, 10).length - 1 ? 'border-b border-slate-50' : ''}`}>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-700">
                                {formatDate(donation.date)}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-800">
                                {donation.campaign_name || 'General'}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500">
                                {donation.designation_name || 'General'}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                                {formatCurrency(donation.amount)}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-xl ${
                                    donation.status === 'completed' 
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : donation.status === 'pending'
                                        ? 'bg-amber-50 text-amber-600'
                                        : 'bg-rose-50 text-rose-600'
                                }`}>
                                    {donation.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentDonationsTable;
