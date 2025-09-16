"use client"

export default function PersonalInfo({ display, isAnonymous, formData, onChange }) {
  return (
    <div className="mb-6">
      <h2 
        className="font-semibold mb-3"
        style={{ 
          color: display.p_color || '#1e293b',
          fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
        }}
      >
        {isAnonymous ? 'Contact Information (for receipt)' : 'Your Information'}
      </h2>
      {!isAnonymous && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input 
            className="p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
            placeholder="First Name *"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            style={{ 
              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
            }}
          />
          <input 
            className="p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
            placeholder="Last Name *"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            style={{ 
              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
            }}
          />
        </div>
      )}
      <input 
        className="w-full p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 mb-4 text-base"
        placeholder={isAnonymous ? "Email Address (for receipt) *" : "Email Address *"}
        type="email"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        style={{ 
          borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
          fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
        }}
      />
      <input 
        className="w-full p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 mb-4 text-base"
        placeholder="Street Address"
        value={formData.address}
        onChange={(e) => onChange('address', e.target.value)}
        style={{ 
          borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
          fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
        }}
      />
      <div className="grid grid-cols-3 gap-4 mb-4">
        <input 
          className="p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
          placeholder="City"
          value={formData.city}
          onChange={(e) => onChange('city', e.target.value)}
          style={{ 
            borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
            fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
          }}
        />
        <input 
          className="p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
          placeholder="State"
          style={{ 
            borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
            fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
          }}
        />
        <input 
          className="p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
          placeholder="ZIP Code"
          value={formData.zipCode}
          onChange={(e) => onChange('zipCode', e.target.value)}
          style={{ 
            borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
            fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
          }}
        />
      </div>
      <input 
        className="w-full p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
        placeholder="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        style={{ 
          borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
          fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
        }}
      />
    </div>
  )
}





