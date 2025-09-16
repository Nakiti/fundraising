"use client"
import StripeCheckout from "@/app/organization/[organizationId]/campaign/[campaignId]/donation-form/[[...status]]/components/StripeCheckout"

export default function StripeSection({ display, amount, campaignId, organizationId, formData, selectedFund, designations, organizationDesignations, defaultDesignation, isAnonymous, questionResponses, questions, onSuccess, onError, onBack }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 
          className="font-semibold"
          style={{ 
            color: display.p_color || '#1e293b',
            fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
          }}
        >
          Payment Information
        </h2>
        <button
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back to payment methods
        </button>
      </div>
      <StripeCheckout
        amount={amount}
        campaignId={campaignId}
        organizationId={organizationId}
        donorData={formData}
        designationId={selectedFund !== null ? 
          (designations && designations.length > 0 ? designations[selectedFund]?.id : 
           organizationDesignations && organizationDesignations.length > 0 ? organizationDesignations[selectedFund]?.id : null) : 
          defaultDesignation?.id}
        isAnonymous={isAnonymous}
        questionResponses={questionResponses}
        questions={questions}
        onSuccess={onSuccess}
        onError={onError}
      />
    </div>
  )
}





