"use client"
import Link from "next/link"
import { FaHeart, FaShoppingCart } from "react-icons/fa"

export default function DonationSidebar({ display, donationForm, selectedAmount, handleAmountSelect, donateUrl, handleAddToCart }) {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-xl sticky top-6">
      <h3 
        className="font-bold text-xl mb-6"
        style={{
          color: display.p_color || '#1e293b',
          fontSize: Math.min(parseInt(display.cardTitleSize) || 20, 24) + 'px'
        }}
      >
        Choose Your Amount
      </h3>
      {display.show_amount_grid !== false && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {donationForm && [donationForm.button1, donationForm.button2, donationForm.button3, donationForm.button4, donationForm.button5, donationForm.button6].map((amount, index) => {
            const buttonAmount = parseInt(amount || '25')
            const isSelected = selectedAmount === buttonAmount
            return (
              <button
                key={index}
                onClick={() => handleAmountSelect(amount || '25')}
                className={`p-4 border transition-all duration-200 text-center rounded-lg ${
                  isSelected 
                    ? 'border-2' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                style={{
                  borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '8px',
                  borderColor: isSelected ? (display.b1_color || '#475569') : undefined,
                  backgroundColor: isSelected ? `${display.b1_color || '#475569'}15` : undefined
                }}
              >
                <div 
                  className="font-bold text-lg"
                  style={{ 
                    color: isSelected ? (display.b1_color || '#475569') : (display.p_color || '#1e293b'),
                    fontSize: Math.min(parseInt(display.bodyTextSize) || 16, 18) + 'px'
                  }}
                >
                  ${amount || '25'}
                </div>
                <div 
                  className="text-xs mt-1"
                  style={{ 
                    color: isSelected ? (display.b1_color || '#475569') : (display.s_color || '#64748b')
                  }}
                >
                  Donation
                </div>
              </button>
            )
          })}
        </div>
      )}
      <Link 
        href={donateUrl}
        className="w-full py-4 px-6 font-bold text-white transition-all duration-300 flex items-center justify-center space-x-3 hover:opacity-90 text-lg"
        style={{
          backgroundColor: display.b1_color || '#475569',
          borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '12px',
          fontSize: Math.min(parseInt(display.buttonTextSize) || 16, 18) + 'px'
        }}
      >
        <FaHeart className="w-4 h-4" />
        <span>{display.donate_button_text || "Donate Now"}</span>
      </Link>
      <button 
        onClick={handleAddToCart}
        className="w-full py-4 px-6 font-bold mt-4 text-white transition-all duration-300 flex items-center justify-center space-x-3 hover:opacity-90 text-lg"
        style={{
          backgroundColor: '#64748b',
          borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '12px',
          fontSize: Math.min(parseInt(display.buttonTextSize) || 16, 18) + 'px'
        }}
      >
        <FaShoppingCart className="w-4 h-4" />
        <span>Add to Cart</span>
      </button>
    </div>
  )
}





