"use client"

export default function AnonymousOption({ display, isAnonymous, onChange }) {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded focus:ring-2 focus:ring-blue-500"
          style={{ 
            accentColor: display.b1_color || '#475569'
          }}
        />
        <label 
          htmlFor="anonymous"
          className="text-sm font-medium cursor-pointer"
          style={{ 
            color: display.p_color || '#1e293b',
            fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
          }}
        >
          Make this donation anonymous
        </label>
      </div>
      {isAnonymous && (
        <p 
          className="text-xs mt-2"
          style={{ color: display.s_color || '#64748b' }}
        >
          Your donation will appear as "Anonymous Donor" on public pages, but your information will still be available to the organization for tax receipts and records.
        </p>
      )}
    </div>
  )
}





