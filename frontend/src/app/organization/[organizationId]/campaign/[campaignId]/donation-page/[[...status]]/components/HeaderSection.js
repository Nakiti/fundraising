"use client"
import { FaShare } from "react-icons/fa"

export default function HeaderSection({ display }) {
  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p 
            className="text-sm font-medium mb-2"
            style={{ 
              color: display.s_color || '#64748b',
              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
            }}
          >
            {display.subtitle || "Fundraiser"}
          </p>
          <h2 
            className="text-3xl font-bold leading-tight"
            style={{ 
              color: display.p_color || '#1e293b',
              fontSize: Math.min(parseInt(display.sectionTitleSize) || 28, 32) + 'px'
            }}
          >
            {display.mainHeadline || "Making a Difference Together"}
          </h2>
        </div>
        <button 
          className="text-sm hover:opacity-80 transition-opacity flex items-center space-x-2 px-3 py-2 rounded-md"
          style={{ 
            color: display.b1_color || '#475569',
            backgroundColor: display.b1_color ? `${display.b1_color}15` : '#f1f5f9',
            fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
          }}
        >
          <FaShare className="w-3 h-3" />
          <span>{display.share_button_text || "Share"}</span>
        </button>
      </div>

      <p 
        className="leading-relaxed text-lg"
        style={{
          color: display.s_color || '#64748b',
          fontSize: Math.min(parseInt(display.bodyTextSize) || 16, 18) + 'px'
        }}
      >
        {display.mainText || "Our organization works tirelessly to create positive change in the community. Through innovative programs and dedicated volunteers, we're building a better future for everyone."}
      </p>
    </div>
  )
}





