"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDonor } from "@/app/context/donorContext";
import Link from "next/link";

const DonorProfile = ({ params }) => {
    const { organizationId } = params;
    const router = useRouter();
    const { donor, updateProfile, loading, error, clearError } = useDonor();
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: ""
    });

    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (!donor) {
            router.push(`/organization/${organizationId}/donor/login`);
            return;
        }

        // Load donor profile data
        loadProfileData();
    }, [donor]);

    const loadProfileData = async () => {
        // For now, we'll use the donor data from context
        // In a real app, you might want to fetch the full profile
        setFormData({
            firstName: donor?.firstName || "",
            lastName: donor?.lastName || "",
            email: donor?.email || "",
            phone: donor?.phone || "",
            address: donor?.address || "",
            city: donor?.city || "",
            state: donor?.state || "",
            zipCode: donor?.zipCode || ""
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSaveLoading(true);
            const result = await updateProfile(formData);
            
            if (result.success) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Profile update error:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadProfileData(); // Reset to original data
        clearError();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!donor) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                            <p className="text-gray-600">Manage your account information</p>
                        </div>
                        <Link
                            href={`/organization/${organizationId}/donor/dashboard`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="px-6 py-6 space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First name
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        disabled={!isEditing}
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                            !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Last name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        disabled={!isEditing}
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                            !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                        }`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    disabled={true} // Email cannot be changed
                                    value={formData.email}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                                />
                                <p className="mt-1 text-sm text-gray-500">Email address cannot be changed</p>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone number
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    disabled={!isEditing}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                    }`}
                                />
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                    }`}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                            !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                        State
                                    </label>
                                    <input
                                        id="state"
                                        name="state"
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                            !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                                        ZIP code
                                    </label>
                                    <input
                                        id="zipCode"
                                        name="zipCode"
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                            !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                        }`}
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saveLoading}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saveLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Account Information */}
                <div className="mt-8 bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                    </div>
                    <div className="px-6 py-6 space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Account created</span>
                            <span className="text-sm text-gray-900">
                                {donor.createdAt ? new Date(donor.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Last login</span>
                            <span className="text-sm text-gray-900">
                                {donor.lastLogin ? new Date(donor.lastLogin).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorProfile;
