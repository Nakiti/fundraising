"use client"
import { FaPaypal, FaCreditCard } from "react-icons/fa"

export default function PaymentMethods({ display, onCreditCardClick }) {
  return (
    <div className="mb-6">
      <h2 
        className="font-semibold mb-3"
        style={{ 
          color: display.p_color || '#1e293b',
          fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
        }}
      >
        Payment Method
      </h2>
      <div className="space-y-3">
        <button 
          className="w-full p-4 border border-slate-200 hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed"
          style={{ borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px' }}
          disabled
        >
          <FaPaypal className="text-blue-600 w-4 h-4" />
          <span 
            className="font-semibold text-sm"
            style={{ 
              color: display.p_color || '#1e293b',
              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
            }}
          >
            PayPal (Coming Soon)
          </span>
        </button>
        <button 
          onClick={onCreditCardClick}
          className="w-full p-4 border border-slate-200 hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-2"
          style={{ 
            borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
            borderColor: display.b1_color || '#475569'
          }}
        >
          <FaCreditCard className="w-4 h-4" style={{ color: display.b1_color || '#475569' }} />
          <span 
            className="font-semibold text-sm"
            style={{ 
              color: display.p_color || '#1e293b',
              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
            }}
          >
            Credit Card
          </span>
        </button>
      </div>
    </div>
  )
}





