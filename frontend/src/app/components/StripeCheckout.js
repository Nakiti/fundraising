"use client"
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { StripeService, StripeUtils } from '@/app/services/stripeService';
import { GuestDonorService } from '@/app/services/guestDonorService';
import { FaCreditCard, FaLock, FaSpinner } from 'react-icons/fa';

// Initialize Stripe (this will be set once we get the publishable key)
let stripePromise = null;

const getStripe = async () => {
  if (!stripePromise) {
    try {
      const publishableKey = await StripeService.getPublishableKey();
      stripePromise = loadStripe(publishableKey);
    } catch (error) {
      console.error('Failed to load Stripe:', error);
      throw error;
    }
  }
  return stripePromise;
};

/**
 * Stripe Payment Form Component
 */
const StripePaymentForm = ({ 
  amount, 
  campaignId, 
  organizationId, 
  donorData, 
  onSuccess, 
  onError,
  designationId = null,
  loading: externalLoading = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      setError('Card element not found');
      return;
    }

    try {
      setProcessing(true);
      setError('');

      // Validate amount
      const validatedAmount = StripeUtils.validateDonationAmount(amount);

      // Create or find guest donor before payment
      const guestDonorData = {
        organization_id: organizationId,
        email: donorData.email,
        first_name: donorData.firstName,
        last_name: donorData.lastName,
        phone: donorData.phone || null,
        address: donorData.address || null,
        city: donorData.city || null,
        zip_code: donorData.zipCode || null
      };

      let guestDonor;
      try {
        guestDonor = await GuestDonorService.createOrFindGuestDonor(guestDonorData);
      } catch (error) {
        console.error('Failed to create guest donor:', error);
        setError('Failed to process donor information. Please try again.');
        return;
      }

      // Create payment intent
      const paymentIntentData = {
        amount: validatedAmount,
        currency: 'usd',
        campaignId,
        organizationId,
        donorEmail: donorData.email,
        metadata: {
          donor_name: `${donorData.firstName} ${donorData.lastName}`,
          campaign_id: campaignId,
          organization_id: organizationId,
          designation_id: designationId || ''
        }
      };

      const { clientSecret, paymentIntentId } = await StripeService.createPaymentIntent(paymentIntentData);

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: `${donorData.firstName} ${donorData.lastName}`,
            email: donorData.email,
            address: {
              line1: donorData.address || '',
              city: donorData.city || '',
              postal_code: donorData.zipCode || '',
            },
          },
        },
      });

      if (stripeError) {
        setError(StripeUtils.formatStripeError(stripeError));
        onError && onError(stripeError);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Create transaction record in our database
        const transactionData = {
          campaign_id: campaignId,
          organization_id: organizationId,
          donor_id: guestDonor.id, // Use the guest donor ID
          amount: validatedAmount,
          status: 'completed',
          method: 'stripe',
          stripe_payment_intent_id: paymentIntent.id,
          stripe_charge_id: paymentIntent.latest_charge,
          processing_fee: StripeUtils.calculateProcessingFee(validatedAmount),
          net_amount: StripeUtils.calculateNetAmount(validatedAmount),
          payment_method_type: 'card',
          designation_id: designationId
        };

        await StripeService.createTransaction(transactionData);

        // Call success callback
        onSuccess && onSuccess({
          paymentIntent,
          transactionData,
          guestDonor,
          amount: validatedAmount
        });
      }

    } catch (err) {
      console.error('Payment failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onError && onError(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError('');
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  const isLoading = processing || externalLoading || !stripe;
  const canSubmit = stripe && cardComplete && amount > 0 && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Donation Amount:</span>
          <span className="text-2xl font-bold text-green-600">
            ${parseFloat(amount).toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Processing fee: ${StripeUtils.calculateProcessingFee(amount).toFixed(2)} • 
          Net amount: ${StripeUtils.calculateNetAmount(amount).toFixed(2)}
        </div>
      </div>

      {/* Card Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <FaCreditCard className="inline mr-2" />
          Card Information
        </label>
        <div className="p-4 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <CardElement 
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Security Notice */}
      <div className="flex items-center text-sm text-gray-600">
        <FaLock className="mr-2" />
        Your payment information is secure and encrypted
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            {processing ? 'Processing Payment...' : 'Loading...'}
          </>
        ) : (
          `Donate $${parseFloat(amount).toFixed(2)}`
        )}
      </button>
    </form>
  );
};

/**
 * Main Stripe Checkout Component
 */
const StripeCheckout = (props) => {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripeError, setStripeError] = useState('');

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        await getStripe();
        setStripeLoaded(true);
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        setStripeError('Failed to load payment system. Please refresh the page and try again.');
      }
    };

    initializeStripe();
  }, []);

  if (stripeError) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <h3 className="font-semibold mb-2">Payment System Error</h3>
        <p>{stripeError}</p>
      </div>
    );
  }

  if (!stripeLoaded) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-center">
          <FaSpinner className="animate-spin mr-2" />
          Loading secure payment system...
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm {...props} />
    </Elements>
  );
};

export default StripeCheckout;
