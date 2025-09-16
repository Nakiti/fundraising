"use client"

export default function CustomQuestions({ display, questions, responses, responseErrors = {}, responseValidation = {}, onResponse }) {
  // if (!questions || questions.length === 0) return null
  return (
    <div className="mb-6">
      <h2 
        className="font-semibold mb-3"
        style={{ 
          color: display.pColor || '#1e293b',
          fontSize: '18px'
        }}
      >
        Additional Questions
      </h2>
      <div className="space-y-3">
        {questions.map((item, index) => {
          const hasError = responseErrors[item.id] && responseErrors[item.id].length > 0
          const validation = responseValidation[item.id]
          const isValid = validation ? validation.isValid : true
          
          return (
            <div key={index} className="mb-4">
              <label 
                className="block text-sm font-medium mb-1"
                style={{ 
                  color: display.pColor || '#1e293b',
                  fontSize: '16px'
                }}
              >
                {item.question}
                {item.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {item.type === "checkbox" ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className={`w-4 h-4 rounded focus:ring-2 focus:ring-slate-500 ${hasError ? 'border-red-500' : ''}`}
                    checked={responses[item.id] || false}
                    onChange={(e) => onResponse(item.id, e.target.checked)}
                    style={{ 
                      accentColor: display.b1Color || '#475569'
                    }}
                  />
                  <span className="text-sm text-gray-600">Yes</span>
                </div>
              ) : item.type === "input" || item.type === "text" ? (
                <input
                  type={item.type === "email" ? "email" : "text"}
                  placeholder={item.placeholder || "Enter your response"}
                  className={`w-full p-3 border focus:outline-none transition-all duration-200 text-sm ${
                    hasError 
                      ? 'border-red-500 focus:border-red-500' 
                      : isValid 
                        ? 'border-green-500 focus:border-green-500' 
                        : 'border-slate-200 focus:border-slate-300'
                  }`}
                  value={responses[item.id] || ""}
                  onChange={(e) => onResponse(item.id, e.target.value)}
                  style={{ 
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              ) : item.type === "textarea" ? (
                <textarea
                  rows={3}
                  placeholder={item.placeholder || "Enter your response"}
                  className={`w-full p-3 border focus:outline-none transition-all duration-200 resize-none text-sm ${
                    hasError 
                      ? 'border-red-500 focus:border-red-500' 
                      : isValid 
                        ? 'border-green-500 focus:border-green-500' 
                        : 'border-slate-200 focus:border-slate-300'
                  }`}
                  value={responses[item.id] || ""}
                  onChange={(e) => onResponse(item.id, e.target.value)}
                  style={{ 
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              ) : (
                <input
                  type="text"
                  placeholder={item.placeholder || "Enter your response"}
                  className={`w-full p-3 border focus:outline-none transition-all duration-200 text-sm ${
                    hasError 
                      ? 'border-red-500 focus:border-red-500' 
                      : isValid 
                        ? 'border-green-500 focus:border-green-500' 
                        : 'border-slate-200 focus:border-slate-300'
                  }`}
                  value={responses[item.id] || ""}
                  onChange={(e) => onResponse(item.id, e.target.value)}
                  style={{ 
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              )}
              
              {/* Error Messages */}
              {hasError && (
                <div className="mt-1">
                  {responseErrors[item.id].map((error, errorIndex) => (
                    <p key={errorIndex} className="text-sm text-red-600">
                      {error}
                    </p>
                  ))}
                </div>
              )}
              
              {/* Character count for text fields */}
              {(item.type === "text" || item.type === "textarea") && responses[item.id] && (
                <div className="mt-1 text-xs text-gray-500">
                  {responses[item.id].length} / {item.max_length || (item.type === "text" ? 255 : 1000)} characters
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}





