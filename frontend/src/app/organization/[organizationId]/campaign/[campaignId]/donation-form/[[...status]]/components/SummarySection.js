"use client"

export default function SummarySection({ display, campaignDetails, amount, selectedFund, designations, organizationDesignations, defaultDesignation }) {
  return (
    <div 
      className="bg-slate-50 p-4 mb-6"
      style={{ borderRadius: display.cardRadius ? `${display.cardRadius}px` : '8px' }}
    >
      <h3 
        className="font-semibold mb-3 text-sm"
        style={{ 
          color: display.p_color || '#1e293b',
          fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
        }}
      >
        Donation Summary
      </h3>
      <div className="space-y-2">
        {campaignDetails && (
          <div className="flex justify-between items-center">
            <span 
              className="text-sm"
              style={{ color: display.s_color || '#64748b' }}
            >
              Campaign:
            </span>
            <span 
              className="font-semibold text-sm text-right"
              style={{ 
                color: display.p_color || '#1e293b',
                fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
              }}
            >
              {campaignDetails.external_name || 'Campaign'}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span 
            className="text-sm"
            style={{ color: display.s_color || '#64748b' }}
          >
            Amount:
          </span>
          <span 
            className="font-semibold text-sm"
            style={{ 
              color: display.p_color || '#1e293b',
              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
            }}
          >
            ${amount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span 
            className="text-sm"
            style={{ color: display.s_color || '#64748b' }}
          >
            Fund:
          </span>
          <span 
            className="font-semibold text-sm"
            style={{ 
              color: display.p_color || '#1e293b',
              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
            }}
          >
            {designations && designations.length > 0  ? 
              (selectedFund !== null ? designations[selectedFund]?.title : 'Please select a fund') :
              organizationDesignations && organizationDesignations.length > 0 ?
              (selectedFund !== null ? organizationDesignations[selectedFund]?.title : 'Please select a fund') :
              (defaultDesignation ? defaultDesignation.title : 'General Fund')
            }
          </span>
        </div>
        <div className="border-t border-slate-200 pt-2 mt-3">
          <div className="flex justify-between items-center">
            <span 
              className="font-semibold text-sm"
              style={{ 
                color: display.p_color || '#1e293b',
                fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
              }}
            >
              Total:
            </span>
            <span 
              className="font-bold text-base"
              style={{ 
                color: display.b1_color || '#475569',
                fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
              }}
            >
              ${amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}





