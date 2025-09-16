"use client"

export default function FormFooter({ display }) {
  return (
    <div className="text-center mt-4">
      <p 
        className="text-xs"
        style={{ color: display.s_color || '#64748b' }}
      >
        By making a donation, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}





