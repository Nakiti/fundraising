"use client";
import { useState } from "react";
import { FaTimes, FaHeart, FaDollarSign, FaCalendarAlt, FaCheck } from "react-icons/fa";

const GuestDonationLinkModal = ({ 
    isOpen, 
    onClose, 
    guestDonors, 
    onConfirmLink, 
    loading = false 
}) => {
    const [selectedDonors, setSelectedDonors] = useState(new Set(guestDonors.map(d => d.id)));

    if (!isOpen) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const toggleDonorSelection = (donorId) => {
        const newSelected = new Set(selectedDonors);
        if (newSelected.has(donorId)) {
            newSelected.delete(donorId);
        } else {
            newSelected.add(donorId);
        }
        setSelectedDonors(newSelected);
    };

    const getTotalStats = () => {
        const selectedDonorsData = guestDonors.filter(d => selectedDonors.has(d.id));
        return {
            totalDonations: selectedDonorsData.reduce((sum, d) => sum + (d.donation_count || 0), 0),
            totalAmount: selectedDonorsData.reduce((sum, d) => sum + (parseFloat(d.total_amount) || 0), 0)
        };
    };

    const stats = getTotalStats();

    const handleConfirm = () => {
        if (selectedDonors.size === 0) {
            return; // Don't proceed if no donations selected
        }
        onConfirmLink(Array.from(selectedDonors));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Link Previous Donations</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            We found donations from this email address. Would you like to link them to your new account?
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
                        <div className="text-center">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
                                <FaHeart className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
                            <p className="text-sm text-gray-600">Donations</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
                                <FaDollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
                            <p className="text-sm text-gray-600">Total Given</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-2">
                                <FaCalendarAlt className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{guestDonors.length}</p>
                            <p className="text-sm text-gray-600">Records</p>
                        </div>
                    </div>

                    {/* Donation Records */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Select donations to link:
                        </h3>
                        {guestDonors.map((donor) => (
                            <div
                                key={donor.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedDonors.has(donor.id)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => toggleDonorSelection(donor.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                    selectedDonors.has(donor.id)
                                                        ? 'bg-blue-500 border-blue-500'
                                                        : 'border-gray-300'
                                                }`}>
                                                    {selectedDonors.has(donor.id) && (
                                                        <FaCheck className="w-3 h-3 text-white" />
                                                    )}
                                                </div>
                                                <h4 className="font-medium text-gray-900">
                                                    {donor.first_name} {donor.last_name}
                                                </h4>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(donor.created_at)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Donations: </span>
                                                <span className="font-medium text-gray-900">
                                                    {donor.donation_count || 0}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Total: </span>
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(donor.total_amount)}
                                                </span>
                                            </div>
                                        </div>
                                        {donor.last_donation_date && (
                                            <div className="text-sm text-gray-500 mt-1">
                                                Last donation: {formatDate(donor.last_donation_date)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        {selectedDonors.size} of {guestDonors.length} donations selected
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Skip for now
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading || selectedDonors.size === 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                        >
                            {loading && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            <span>
                                {loading ? 'Linking...' : `Link ${selectedDonors.size} Donation${selectedDonors.size !== 1 ? 's' : ''}`}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestDonationLinkModal;
