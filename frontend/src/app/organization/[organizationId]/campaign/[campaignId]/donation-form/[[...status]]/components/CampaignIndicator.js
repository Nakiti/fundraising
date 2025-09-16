"use client"

export default function CampaignIndicator({ campaignDetails, display }) {
  if (!campaignDetails) return null
  return (
    <div className="mb-4 pb-3 border-b border-slate-100">
      <div className="flex items-center justify-center space-x-2">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: display.b1_color || '#475569' }}
        ></div>
        <span 
          className="text-xs font-medium"
          style={{ color: display.s_color || '#64748b' }}
        >
          Donating to: {campaignDetails.external_name || 'Campaign'}
        </span>
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: display.b1_color || '#475569' }}
        ></div>
      </div>
    </div>
  )
}





