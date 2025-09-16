"use client"

export default function FormHeader({ display }) {
  return (
    <div className="text-center mb-6">
      <h1 
        className="font-bold mb-3 leading-tight"
        style={{ 
          color: display.p_color || '#1e293b',
          fontSize: Math.min(parseInt(display.heroTitleSize) || 24, 28) + 'px'
        }}
      >
        {display.headline || "Make a Donation"}
      </h1>
      <p 
        className="leading-relaxed max-w-md mx-auto"
        style={{ 
          color: display.s_color || '#64748b',
          fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
        }}
      >
        {display.description || "Your generous contribution helps us continue our mission and make a positive impact in our community."}
      </p>
    </div>
  )
}





