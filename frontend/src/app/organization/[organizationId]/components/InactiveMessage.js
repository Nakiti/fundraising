"use client"
import { FaExclamationTriangle, FaEnvelope, FaInfoCircle } from "react-icons/fa"

const InactiveMessage = ({ organizationName }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 rounded-full p-4">
              <FaExclamationTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Organization Temporarily Unavailable
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {organizationName ? (
              <>
                <span className="font-semibold">{organizationName}</span> is currently inactive and their pages are temporarily unavailable.
              </>
            ) : (
              "This organization is currently inactive and their pages are temporarily unavailable."
            )}
          </p>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 mb-2">What does this mean?</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• The organization is temporarily not accepting donations</li>
                  <li>• Their campaigns and pages are not accessible to the public</li>
                  <li>• This is usually temporary while they update their information</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <p className="text-gray-600">
              If you need to contact this organization or have questions about a previous donation, please reach out to them directly.
            </p>
            
            <div className="flex justify-center">
              <a 
                href="mailto:support@example.com"
                className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200"
              >
                <FaEnvelope className="w-4 h-4" />
                <span>Contact Support</span>
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Organizations can reactivate their pages at any time through their dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InactiveMessage
