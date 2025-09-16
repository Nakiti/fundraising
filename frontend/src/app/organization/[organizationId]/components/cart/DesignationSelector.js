"use client"
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const DesignationSelector = ({
  campaignDesignations = [],
  organizationDesignations = [],
  selectedDesignation,
  onDesignationChange
}) => {
  const [expandedDescription, setExpandedDescription] = useState(null);

  const handleDesignationChange = (e) => {
    const value = e.target.value;
    const designationId = value === 'general' ? null : parseInt(value);
    onDesignationChange(designationId);
  };

  const toggleDescription = (designationId) => {
    setExpandedDescription(expandedDescription === designationId ? null : designationId);
  };

  const renderDesignationOption = (designation, isOrgDesignation = false) => (
    <div key={`${isOrgDesignation ? 'org' : 'campaign'}-${designation.id}`} className="space-y-2">
      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="radio"
          name="designation"
          value={designation.id}
          checked={selectedDesignation === designation.id}
          onChange={handleDesignationChange}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              {designation.name}
            </span>
            {designation.description && (
              <button
                type="button"
                onClick={() => toggleDescription(designation.id)}
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                aria-label={`${expandedDescription === designation.id ? 'Hide' : 'Show'} description for ${designation.name}`}
              >
                <FaInfoCircle className="w-3 h-3" />
              </button>
            )}
          </div>
          
          {/* Description */}
          {designation.description && expandedDescription === designation.id && (
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              {designation.description}
            </p>
          )}
        </div>
      </label>
    </div>
  );

  const hasAnyDesignations = campaignDesignations.length > 0 || organizationDesignations.length > 0;

  if (!hasAnyDesignations) {
    return (
      <div className="text-sm text-gray-500 italic">
        No specific funds available for this campaign
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* General Fund Option */}
      <div className="space-y-2">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="radio"
            name="designation"
            value="general"
            checked={selectedDesignation === null}
            onChange={handleDesignationChange}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">
              General Fund
            </span>
            <p className="text-sm text-gray-600">
              Use where needed most for this campaign
            </p>
          </div>
        </label>
      </div>

      {/* Campaign-Specific Designations */}
      {campaignDesignations.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Campaign Funds
          </h5>
          <div className="space-y-3">
            {campaignDesignations.map((designation) => 
              renderDesignationOption(designation, false)
            )}
          </div>
        </div>
      )}

      {/* Organization-Wide Designations */}
      {organizationDesignations.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Organization Funds
          </h5>
          <div className="space-y-3">
            {organizationDesignations.map((designation) => 
              renderDesignationOption(designation, true)
            )}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Choose a specific fund to direct your donation, or select "General Fund" to let the organization use it where needed most.
        </p>
      </div>
    </div>
  );
};

export default DesignationSelector;

