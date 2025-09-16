"use client"
import { useCart } from '@/app/context/cartContext';
import { FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';

const CartIcon = ({ organizationId, className = "", showLabel = false }) => {
  const { getItemCount, totalAmount, items } = useCart();
  
  const itemCount = getItemCount();
  const hasItems = itemCount > 0;
  
  console.log('CartIcon render:', { itemCount, totalAmount, hasItems, items });

  return (
    <Link 
      href={`/organization/${organizationId}/cart`}
      className={`
        relative inline-flex items-center space-x-2 p-2 rounded-lg
        transition-all duration-200 ease-in-out
        hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <div className="relative">
        <FaShoppingCart 
          className={`w-6 h-6 transition-colors duration-200 ${
            hasItems ? 'text-blue-600' : 'text-gray-500'
          }`} 
        />
        
        {/* Item count badge */}
        {hasItems && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>
      
      {/* Optional label and total */}
      {showLabel && (
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-medium text-gray-700">
            Cart {hasItems && `(${itemCount})`}
          </span>
          {hasItems && totalAmount > 0 && (
            <span className="text-xs text-gray-500">
              ${totalAmount.toFixed(2)}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default CartIcon;

