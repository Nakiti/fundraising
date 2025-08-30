"use client"
import { useState } from 'react';
import { useCart } from '@/app/context/cartContext';
import { FaShoppingCart, FaCheck, FaSpinner } from 'react-icons/fa';

const AddToCartButton = ({ 
  campaignId, 
  campaignName,
  className = "",
  size = "medium",
  variant = "primary",
  disabled = false,
  onSuccess,
  onError
}) => {
  const { addToCart, isInCart, removeFromCart, loading } = useCart();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const inCart = isInCart(campaignId);

  // Size variants
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  };

  // Color variants
  const variantClasses = {
    primary: inCart 
      ? "bg-green-600 text-white hover:bg-green-700" 
      : "bg-blue-600 text-white hover:bg-blue-700",
    secondary: inCart
      ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200",
    outline: inCart
      ? "border-2 border-green-600 text-green-600 hover:bg-green-50"
      : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
  };

  const handleClick = async () => {
    if (disabled || buttonLoading || loading) return;

    try {
      setButtonLoading(true);

      if (inCart) {
        // Remove from cart
        removeFromCart(campaignId);
        onSuccess && onSuccess({ action: 'removed', campaignId, campaignName });
      } else {
        // Add to cart
        await addToCart(campaignId, 0); // Start with $0, user can set amount in cart
        setShowSuccess(true);
        
        // Show success state briefly
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);

        onSuccess && onSuccess({ action: 'added', campaignId, campaignName });
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      onError && onError(error);
    } finally {
      setButtonLoading(false);
    }
  };

  const isLoading = buttonLoading || loading;
  const isDisabled = disabled || isLoading;

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <FaSpinner className="animate-spin w-4 h-4" />
          <span className="ml-2">
            {inCart ? 'Removing...' : 'Adding...'}
          </span>
        </>
      );
    }

    if (showSuccess && inCart) {
      return (
        <>
          <FaCheck className="w-4 h-4" />
          <span className="ml-2">Added to Cart!</span>
        </>
      );
    }

    if (inCart) {
      return (
        <>
          <FaCheck className="w-4 h-4" />
          <span className="ml-2">In Cart</span>
        </>
      );
    }

    return (
      <>
        <FaShoppingCart className="w-4 h-4" />
        <span className="ml-2">Add to Cart</span>
      </>
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-200 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      aria-label={inCart ? `Remove ${campaignName} from cart` : `Add ${campaignName} to cart`}
    >
      {getButtonContent()}
    </button>
  );
};

export default AddToCartButton;

