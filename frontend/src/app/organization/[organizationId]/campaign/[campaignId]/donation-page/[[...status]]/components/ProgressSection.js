"use client"
import { FaUsers, FaHeart } from "react-icons/fa"

export default function ProgressSection({ display, campaignDetails, campaignInsights, progressPercentage }) {
  if (display.show_progress === false) return null
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <span 
          className="font-semibold text-lg"
          style={{ 
            color: display.p_color || '#1e293b',
            fontSize: Math.min(parseInt(display.bodyTextSize) || 16, 18) + 'px'
          }}
        >
          ${(campaignInsights?.total_raised || 0).toLocaleString()} raised
        </span>
        <span 
          className="font-medium text-sm"
          style={{ 
            color: display.s_color || '#64748b',
            fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
          }}
        >
          of ${(campaignDetails?.goal || 0).toLocaleString()} goal
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
        <div 
          className="h-3 rounded-full transition-all duration-500 ease-out"
          style={{ 
            backgroundColor: display.b1_color || '#475569',
            width: `${progressPercentage}%`
          }}
        ></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" style={{ color: display.s_color || '#64748b' }}>
        {display.show_donor_count !== false && (
          <div className="flex items-center space-x-2">
            <FaUsers className="text-slate-400 w-4 h-4" />
            <span>{campaignInsights?.total_donors || 0} donations</span>
          </div>
        )}
        {campaignInsights?.unique_donors > 0 && (
          <div className="flex items-center space-x-2">
            <FaUsers className="text-slate-400 w-4 h-4" />
            <span>{campaignInsights.unique_donors} unique donors</span>
          </div>
        )}
        {campaignInsights?.average_donation > 0 && (
          <div className="flex items-center space-x-2">
            <FaHeart className="text-rose-400 w-4 h-4" />
            <span>${campaignInsights.average_donation.toFixed(2)} avg</span>
          </div>
        )}
        {display.show_days_left !== false && (
          <div className="flex items-center space-x-2">
            <FaHeart className="text-rose-400 w-4 h-4" />
            <span>{display.days_left || 23} days left</span>
          </div>
        )}
      </div>
    </div>
  )
}





