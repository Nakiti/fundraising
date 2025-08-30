"use client"

const CustomQuestions = ({ questions = [], responses = {}, onResponseChange }) => {
  if (!questions || questions.length === 0) {
    return null;
  }

  const handleResponseChange = (questionId, value) => {
    onResponseChange(questionId, value);
  };

  const renderQuestion = (question) => {
    const currentResponse = responses[question.id] || '';
    
    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={question.type}
            value={currentResponse}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder={question.placeholder || `Enter ${question.question.toLowerCase()}`}
            required={question.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={currentResponse}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder={question.placeholder || `Enter ${question.question.toLowerCase()}`}
            required={question.required}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        );
      
      case 'select':
        return (
          <select
            value={currentResponse}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            required={question.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Please select...</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={currentResponse === option}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  required={question.required}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => {
              const isChecked = currentResponse.includes && currentResponse.includes(option);
              return (
                <label key={index} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option}
                    checked={isChecked}
                    onChange={(e) => {
                      const currentArray = Array.isArray(currentResponse) ? currentResponse : [];
                      let newArray;
                      if (e.target.checked) {
                        newArray = [...currentArray, option];
                      } else {
                        newArray = currentArray.filter(item => item !== option);
                      }
                      handleResponseChange(question.id, newArray);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
        );
      
      case 'boolean':
        return (
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentResponse === true || currentResponse === 'true'}
                onChange={(e) => handleResponseChange(question.id, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                {question.label || 'Yes'}
              </span>
            </label>
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            value={currentResponse}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder={question.placeholder || `Enter ${question.question.toLowerCase()}`}
            required={question.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {question.question}
            {question.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          
          {question.description && (
            <p className="text-xs text-gray-600">{question.description}</p>
          )}
          
          {renderQuestion(question)}
        </div>
      ))}
    </div>
  );
};

export default CustomQuestions;

