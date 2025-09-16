"use client"
import { useState, useEffect } from 'react';

const AmountSelector = ({ value, onChange, campaignName }) => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // Preset amount options
  const presetAmounts = [25, 50, 100, 250, 500];

  // Initialize state based on current value
  useEffect(() => {
    if (value > 0) {
      if (presetAmounts.includes(value)) {
        setSelectedPreset(value);
        setShowCustom(false);
        setCustomAmount('');
      } else {
        setSelectedPreset(null);
        setShowCustom(true);
        setCustomAmount(value.toString());
      }
    }
  }, [value]);

  const handlePresetClick = (amount) => {
    setSelectedPreset(amount);
    setShowCustom(false);
    setCustomAmount('');
    onChange(amount);
  };

  const handleCustomClick = () => {
    setSelectedPreset(null);
    setShowCustom(true);
    if (customAmount) {
      onChange(parseFloat(customAmount) || 0);
    }
  };

  const handleCustomAmountChange = (e) => {
    const inputValue = e.target.value;
    setCustomAmount(inputValue);
    
    // Only update if it's a valid number
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue);
    } else if (inputValue === '') {
      onChange(0);
    }
  };

  const formatAmount = (amount) => {
    return amount >= 1000 ? `$${(amount / 1000).toFixed(0)}k` : `$${amount}`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Donation Amount for {campaignName}
      </label>
      
      {/* Preset Amount Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handlePresetClick(amount)}
            className={`
              px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200
              ${selectedPreset === amount
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
          >
            {formatAmount(amount)}
          </button>
        ))}
      </div>

      {/* Custom Amount Section */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleCustomClick}
          className={`
            w-full px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 text-left
            ${showCustom
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
            }
          `}
        >
          Other Amount
        </button>

        {/* Custom Amount Input */}
        {showCustom && (
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="0.00"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Custom donation amount"
            />
          </div>
        )}
      </div>

      {/* Current Amount Display */}
      {value > 0 && (
        <div className="text-right">
          <span className="text-lg font-semibold text-green-600">
            ${value.toFixed(2)}
          </span>
        </div>
      )}

      {/* Validation Message */}
      {value <= 0 && (
        <p className="text-sm text-amber-600">
          Please select a donation amount
        </p>
      )}
    </div>
  );
};

export default AmountSelector;

