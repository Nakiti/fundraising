"use client"

export default function ImpactSection({ organization, customStyles, showStatistics }) {
  return (
    <div 
      className="flex flex-col lg:flex-row items-center space-y-16 lg:space-y-0 lg:space-x-20 w-full px-8"
      style={{paddingTop: customStyles.sectionPadding, paddingBottom: customStyles.sectionPadding}}
    >
      <div className="lg:w-1/2">
        <div className="relative">
          <img
            className="w-full h-96 object-cover rounded-xl shadow-2xl"
            src={organization?.inputs?.textImage || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
            alt="Our Impact"
            style={{borderRadius: customStyles.cardRadius}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
        </div>
      </div>
      <div className="lg:w-1/2 space-y-8">
        <h2 
          className="font-bold leading-tight" 
          style={{
            color: organization?.inputs?.p_color || '#1f2937',
            fontSize: customStyles.sectionTitleSize
          }}
        >
          Our Impact
        </h2>
        <p 
          className="leading-relaxed text-gray-700" 
          style={{
            color: organization?.inputs?.s_color || '#6b7280',
            fontSize: customStyles.bodyTextSize
          }}
        >
          {organization?.inputs?.impactText || "Through our programs and initiatives, we've helped thousands of individuals and families. Our impact is measured not just in numbers, but in the positive changes we see in our community every day."}                
        </p>
        {showStatistics && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { metric: "95%", label: "Success Rate" },
              { metric: "24/7", label: "Support Available" },
              { metric: "100%", label: "Transparency" },
              { metric: "A+", label: "Rating" }
            ].map((item, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 border border-gray-100" style={{borderRadius: customStyles.cardRadius}}>
                <div className="text-lg font-semibold text-gray-900 mb-1">{item.metric}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            ))}   
          </div> 
        )}
      </div>
    </div>
  );
}





