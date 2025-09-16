"use client"

export default function FundSelection({ display, selectedFund, designations, organizationDesignations, defaultDesignation, onChange }) {
  return (
    <div className="mb-6">
      <h2 
        className="font-semibold mb-3"
        style={{ 
          color: display.p_color || '#1e293b',
          fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
        }}
      >
        Select Fund
      </h2>
      <select 
        className="w-full p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 bg-white text-base"
        value={selectedFund !== null ? selectedFund : "select"}
        onChange={onChange}
        style={{ 
          borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
          fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
        }}
      >
        <option value="select" disabled>Choose a fund</option>
        {designations && designations.length > 0 ?
          designations.map((item, index) => (
            <option key={item.id} value={index}>{item.title}</option>
          )) :
          organizationDesignations && organizationDesignations.length > 0 ?
          organizationDesignations.map((item, index) => (
            <option key={item.id} value={index}>{item.title}</option>
          )) :
          (defaultDesignation && <option value={defaultDesignation.id}>{defaultDesignation.title}</option>)
        }
      </select>
    </div>
  )
}





