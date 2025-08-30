"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/app/context/cartContext';
import { FaShoppingCart, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import CartItem from '@/app/components/cart/CartItem';
import StripeCheckout from '@/app/components/StripeCheckout';

const CartPage = () => {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.organizationId;
  
  const { items, totalAmount, validateCart, clearCart, loading } = useCart();
  const [donorData, setDonorData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const isEmpty = items.length === 0;
  const hasValidAmounts = items.every(item => item.amount > 0);

  const handleDonorDataChange = (field, value) => {
    setDonorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    // Validate cart items
    const cartValidation = validateCart();
    if (!cartValidation.isValid) {
      errors.push(...cartValidation.errors);
    }
    
    // Validate donor information (if not anonymous)
    if (!isAnonymous) {
      if (!donorData.firstName.trim()) {
        errors.push('First name is required');
      }
      if (!donorData.lastName.trim()) {
        errors.push('Last name is required');
      }
      if (!donorData.email.trim()) {
        errors.push('Email is required');
      } else if (!/\S+@\S+\.\S+/.test(donorData.email)) {
        errors.push('Please enter a valid email address');
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleProceedToCheckout = () => {
    if (validateForm()) {
      setShowCheckout(true);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    // Clear the cart after successful payment
    clearCart();
    
    // Redirect to thank you page
    router.push(`/organization/${organizationId}/thank-you?from=cart&amount=${totalAmount}`);
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setShowCheckout(false);
    setValidationErrors(['Payment failed. Please try again.']);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto h-8 w-8 text-blue-600 mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/organization/${organizationId}`}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back to Campaigns</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <FaShoppingCart className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Your Donation Cart
            </h1>
          </div>
          
          {!isEmpty && (
            <p className="text-gray-600 mt-2">
              {items.length} campaign{items.length !== 1 ? 's' : ''} • Total: ${totalAmount.toFixed(2)}
            </p>
          )}
        </div>

        {/* Empty Cart State */}
        {isEmpty && (
          <div className="text-center py-16">
            <FaShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some campaigns to your cart to make a donation
            </p>
            <Link
              href={`/organization/${organizationId}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Browse Campaigns
            </Link>
          </div>
        )}

        {/* Cart Content */}
        {!isEmpty && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Campaigns in Your Cart
              </h2>
              
              {items.map((item) => (
                <CartItem key={item.campaignId} item={item} />
              ))}
            </div>

            {/* Checkout Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Donation Summary
                </h2>

                {/* Summary */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  {items.map((item) => (
                    <div key={item.campaignId} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">
                        {item.campaignName}
                      </span>
                      <span className="font-medium">
                        ${item.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-sm font-medium text-red-800 mb-2">
                      Please fix the following issues:
                    </h3>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Checkout Form */}
                {!showCheckout && (
                  <div className="space-y-4">
                    {/* Donor Information */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Donor Information
                      </h3>
                      
                      {/* Anonymous Option */}
                      <div className="mb-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            Make this donation anonymous
                          </span>
                        </label>
                      </div>

                      {/* Donor Form Fields */}
                      {!isAnonymous && (
                        <div className="grid grid-cols-2 gap-3 space-y-0">
                          <input
                            type="text"
                            placeholder="First Name"
                            value={donorData.firstName}
                            onChange={(e) => handleDonorDataChange('firstName', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={donorData.lastName}
                            onChange={(e) => handleDonorDataChange('lastName', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={donorData.email}
                            onChange={(e) => handleDonorDataChange('email', e.target.value)}
                            className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <input
                            type="tel"
                            placeholder="Phone (Optional)"
                            value={donorData.phone}
                            onChange={(e) => handleDonorDataChange('phone', e.target.value)}
                            className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleProceedToCheckout}
                      disabled={!hasValidAmounts || totalAmount <= 0}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                )}

                {/* Stripe Checkout */}
                {showCheckout && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Payment Information
                      </h3>
                      <button
                        onClick={() => setShowCheckout(false)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Edit Details
                      </button>
                    </div>
                    
                    <StripeCheckout
                      amount={totalAmount}
                      campaignId={items[0]?.campaignId} // We'll modify this for multi-campaign
                      organizationId={organizationId}
                      donorData={donorData}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isAnonymous={isAnonymous}
                      loading={checkoutLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

