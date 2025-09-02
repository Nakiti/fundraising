"use client";
import { useState } from "react";
import { FaTimes, FaUserPlus, FaHeart, FaShieldAlt, FaChartLine } from "react-icons/fa";

const PostDonationAccountModal = ({ 
    isOpen, 
    onClose, 
    donorEmail, 
    donorName,
    donationAmount,
    organizationId,
    onCreateAccount, 
    loading = false 
}) => {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (name === "password" || name === "confirmPassword") {
            setPasswordError("");
        }
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return false;
        }
        
        if (formData.password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            return false;
        }
        
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        onCreateAccount(formData.password);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FaHeart className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Thank You!</h2>
                            <p className="text-sm text-gray-600">
                                Your {formatCurrency(donationAmount)} donation was successful
                            </p>
                        </div>
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
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUserPlus className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Create Your Donor Account
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Track your donations, access tax receipts, and see your impact over time.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                <FaChartLine className="w-3 h-3 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 text-sm">Track Your Impact</h4>
                                <p className="text-gray-600 text-xs">View your donation history and total contributions</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                <FaShieldAlt className="w-3 h-3 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 text-sm">Tax Documents</h4>
                                <p className="text-gray-600 text-xs">Easily access receipts and tax forms</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                                <FaHeart className="w-3 h-3 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 text-sm">Stay Connected</h4>
                                <p className="text-gray-600 text-xs">Get updates on how your donations make a difference</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={donorEmail}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Create Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Minimum 6 characters"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Confirm your password"
                            />
                            {passwordError && (
                                <p className="mt-1 text-xs text-red-600">{passwordError}</p>
                            )}
                        </div>

                        <div className="flex space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
                            >
                                Skip for now
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
                            >
                                {loading && (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                )}
                                <span>{loading ? 'Creating...' : 'Create Account'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostDonationAccountModal;

