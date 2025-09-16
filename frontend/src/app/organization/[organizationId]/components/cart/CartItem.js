"use client"
import { useState } from 'react';
import { useCart } from '@/app/context/cartContext';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import AmountSelector from './AmountSelector';
import DesignationSelector from './DesignationSelector';
import CustomQuestions from './CustomQuestions';

const CartItem = ({ item }) => {
  const { removeFromCart, updateAmount, updateDesignation, updateCustomResponse } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      removeFromCart(item.campaignId);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setIsRemoving(false);
    }
  };

  const handleAmountChange = (newAmount) => {
    updateAmount(item.campaignId, newAmount);
  };

  const handleDesignationChange = (designationId) => {
    updateDesignation(item.campaignId, designationId);
  };

  const handleCustomResponse = (questionId, response) => {
    updateCustomResponse(item.campaignId, questionId, response);
  };

  const hasDesignations = (item.availableDesignations?.length > 0) || (item.organizationDesignations?.length > 0);
  const hasCustomQuestions = item.customQuestions?.length > 0;
  const needsExpansion = hasDesignations || hasCustomQuestions;

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden transition-all duration-200">
      {/* Main Cart Item Header */}
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Campaign Image */}
          <div className="flex-shrink-0">
            <img
              src={item.campaignImage || "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
              alt={item.campaignName}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>

          {/* Campaign Info and Controls */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {item.campaignName}
                </h3>
                
                {/* Selected designation display */}
                {item.selectedDesignation && (
                  <p className="text-sm text-gray-600 mt-1">
                    Fund: {
                      [...(item.availableDesignations || []), ...(item.organizationDesignations || [])]
                        .find(d => d.id === item.selectedDesignation)?.name || 'Selected Fund'
                    }
                  </p>
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50"
                aria-label={`Remove ${item.campaignName} from cart`}
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>

            {/* Amount Selector */}
            <div className="mt-4">
              <AmountSelector
                value={item.amount}
                onChange={handleAmountChange}
                campaignName={item.campaignName}
              />
            </div>

            {/* Expand/Collapse Button */}
            {needsExpansion && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                <span>{isExpanded ? 'Hide Options' : 'Show Options'}</span>
                {isExpanded ? (
                  <FaChevronUp className="w-3 h-3" />
                ) : (
                  <FaChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Options */}
      {isExpanded && needsExpansion && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="space-y-6">
            {/* Designation Selector */}
            {hasDesignations && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Choose Fund (Optional)
                </h4>
                <DesignationSelector
                  campaignDesignations={item.availableDesignations || []}
                  organizationDesignations={item.organizationDesignations || []}
                  selectedDesignation={item.selectedDesignation}
                  onDesignationChange={handleDesignationChange}
                />
              </div>
            )}

            {/* Custom Questions */}
            {hasCustomQuestions && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Additional Information
                </h4>
                <CustomQuestions
                  questions={item.customQuestions}
                  responses={item.customResponses}
                  onResponseChange={handleCustomResponse}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;

