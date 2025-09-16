"use client"
import { FaLock } from "react-icons/fa"

export default function SecurityNote({ display }) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-4">
      <FaLock className="text-emerald-600 w-3 h-3" />
      <span 
        className="text-xs"
        style={{ color: display.s_color || '#64748b' }}
      >
        Your payment information is secure and encrypted
      </span>
    </div>
  )
}





