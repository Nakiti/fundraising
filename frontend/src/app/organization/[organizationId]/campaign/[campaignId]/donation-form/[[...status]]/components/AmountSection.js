"use client"

export default function AmountSection({ display, selectedAmount, customAmount, onAmountClick, onCustomAmountChange }) {
  return (
    <div className="mb-6">
      <h2 
        className="font-semibold mb-3"
        style={{ 
          color: display.p_color || '#1e293b',
          fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
        }}
      >
        Choose Your Amount
      </h2>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[display.button1, display.button2, display.button3, display.button4, display.button5, display.button6].map((buttonAmount, index) => {
          const isSelected = selectedAmount === buttonAmount
          return (
            <button
              key={index}
              className={`p-4 border transition-all duration-200 text-center ${
                isSelected ? 'border-2' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
              style={{ 
                borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                borderColor: isSelected ? (display.b1_color || '#475569') : undefined,
                backgroundColor: isSelected ? `${display.b1_color || '#475569'}15` : undefined
              }}
              onClick={() => onAmountClick(buttonAmount)}
            >
              <div 
                className="font-semibold text-lg"
                style={{ 
                  color: isSelected ? (display.b1_color || '#475569') : (display.p_color || '#1e293b'),
                  fontSize: Math.min(parseInt(display.bodyTextSize) || 16, 18) + 'px'
                }}
              >
                ${buttonAmount || '25'}
              </div>
            </button>
          )
        })}
        <input 
          className={`p-4 border focus:outline-none transition-all duration-200 text-center text-lg ${
            customAmount ? 'border-2' : 'border-slate-200 focus:border-slate-300'
          }`}
          placeholder="Custom Amount"
          type="number"
          min="1"
          step="0.01"
          value={customAmount}
          onChange={onCustomAmountChange}
          style={{ 
            gridColumn: 'span 3',
            borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
            fontSize: Math.min(parseInt(display.bodyTextSize) || 16, 18) + 'px',
            borderColor: customAmount ? (display.b1_color || '#475569') : undefined,
            backgroundColor: customAmount ? `${display.b1_color || '#475569'}15` : undefined,
            color: customAmount ? (display.b1_color || '#475569') : undefined
          }}
        />
      </div>
    </div>
  )
}





