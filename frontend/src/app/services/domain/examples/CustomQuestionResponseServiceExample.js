/**
 * Example usage of CustomQuestionResponseService
 * This file demonstrates how to use the CustomQuestionResponseService
 * for various operations related to custom question responses.
 */

import { getCustomQuestionResponseService, getTransactionService } from '../index.js';

/**
 * Example: Create a transaction with custom question responses
 */
export async function createDonationWithResponses() {
  try {
    const transactionService = getTransactionService();
    const customQuestionResponseService = getCustomQuestionResponseService();

    // Transaction data
    const transactionData = {
      campaign_id: 123,
      organization_id: 456,
      donor_id: 789,
      amount: 50.00,
      status: 'completed',
      method: 'stripe',
      stripe_payment_intent_id: 'pi_1234567890',
      stripe_charge_id: 'ch_1234567890',
      processing_fee: 1.75,
      net_amount: 48.25,
      payment_method_type: 'card',
      designation_id: 1,
      is_anonymous: false
    };

    // Question responses data
    const questionResponses = [
      {
        question_id: 1,
        response_value: 'Yes, I would like to receive updates',
        response_type: 'checkbox'
      },
      {
        question_id: 2,
        response_value: 'This is a great cause and I want to help make a difference.',
        response_type: 'textarea'
      },
      {
        question_id: 3,
        response_value: 'John Doe',
        response_type: 'text'
      }
    ];

    // Create transaction with responses
    const result = await transactionService.createTransactionWithResponses(
      transactionData, 
      questionResponses
    );

    console.log('Transaction created with responses:', result);
    return result;

  } catch (error) {
    console.error('Error creating donation with responses:', error);
    throw error;
  }
}

/**
 * Example: Get all responses for a specific campaign
 */
export async function getCampaignResponses(campaignId) {
  try {
    const customQuestionResponseService = getCustomQuestionResponseService();

    // Get responses with pagination
    const responses = await customQuestionResponseService.getResponsesByCampaign(
      campaignId, 
      { limit: 50, offset: 0 }
    );

    console.log(`Found ${responses.length} responses for campaign ${campaignId}`);
    return responses;

  } catch (error) {
    console.error('Error getting campaign responses:', error);
    throw error;
  }
}

/**
 * Example: Get response statistics for a campaign
 */
export async function getCampaignResponseStats(campaignId) {
  try {
    const customQuestionResponseService = getCustomQuestionResponseService();

    const stats = await customQuestionResponseService.getResponseStatistics(campaignId);

    console.log('Response statistics:', stats);
    return stats;

  } catch (error) {
    console.error('Error getting response statistics:', error);
    throw error;
  }
}

/**
 * Example: Get responses for a specific question
 */
export async function getQuestionResponses(questionId) {
  try {
    const customQuestionResponseService = getCustomQuestionResponseService();

    const responses = await customQuestionResponseService.getResponsesByQuestion(
      questionId, 
      { limit: 100, offset: 0 }
    );

    console.log(`Found ${responses.length} responses for question ${questionId}`);
    return responses;

  } catch (error) {
    console.error('Error getting question responses:', error);
    throw error;
  }
}

/**
 * Example: Get most common responses for a question
 */
export async function getMostCommonResponses(questionId) {
  try {
    const customQuestionResponseService = getCustomQuestionResponseService();

    const commonResponses = await customQuestionResponseService.getMostCommonResponses(
      questionId, 
      10 // Top 10 most common responses
    );

    console.log('Most common responses:', commonResponses);
    return commonResponses;

  } catch (error) {
    console.error('Error getting most common responses:', error);
    throw error;
  }
}

/**
 * Example: Export responses to CSV
 */
export async function exportResponsesToCSV(campaignId) {
  try {
    const customQuestionResponseService = getCustomQuestionResponseService();

    const csvData = await customQuestionResponseService.exportResponsesToCSV(campaignId);

    // Create and download CSV file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${campaignId}-responses.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log('CSV exported successfully');
    return csvData;

  } catch (error) {
    console.error('Error exporting responses to CSV:', error);
    throw error;
  }
}

/**
 * Example: Update a response
 */
export async function updateResponse(responseId, newValue) {
  try {
    const customQuestionResponseService = getCustomQuestionResponseService();

    const updatedResponse = await customQuestionResponseService.updateResponse(
      responseId, 
      { response_value: newValue }
    );

    console.log('Response updated:', updatedResponse);
    return updatedResponse;

  } catch (error) {
    console.error('Error updating response:', error);
    throw error;
  }
}

/**
 * Example: Delete all responses for a transaction
 */
export async function deleteTransactionResponses(transactionId) {
  try {
    const customQuestionResponseService = getCustomQuestionResponseService();

    const result = await customQuestionResponseService.deleteResponsesByTransaction(transactionId);

    console.log('Responses deleted:', result);
    return result;

  } catch (error) {
    console.error('Error deleting transaction responses:', error);
    throw error;
  }
}

/**
 * Example: Check if a donor has responded to a specific question
 */
export async function checkDonorResponse(donorId, questionId) {
  try {
    const customQuestionResponseService = getCustomQuestionResponseService();

    const hasResponded = await customQuestionResponseService.hasDonorResponded(
      donorId, 
      questionId
    );

    console.log(`Donor ${donorId} has responded to question ${questionId}:`, hasResponded);
    return hasResponded;

  } catch (error) {
    console.error('Error checking donor response:', error);
    throw error;
  }
}

/**
 * Example: Get responses with donor details for analytics
 */
export async function getResponsesWithDonors(campaignId) {
  try {
    const customQuestionResponseService = getCustomQuestionResponseService();

    const responses = await customQuestionResponseService.getResponsesWithDonors(
      campaignId, 
      { limit: 100, offset: 0 }
    );

    console.log('Responses with donor details:', responses);
    return responses;

  } catch (error) {
    console.error('Error getting responses with donors:', error);
    throw error;
  }
}

// Usage examples in React components:

/**
 * Example React component usage
 */
export const ExampleComponent = () => {
  const handleGetResponses = async () => {
    try {
      const responses = await getCampaignResponses(123);
      // Handle responses in your component
    } catch (error) {
      // Handle error
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportResponsesToCSV(123);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <button onClick={handleGetResponses}>Get Campaign Responses</button>
      <button onClick={handleExportCSV}>Export to CSV</button>
    </div>
  );
};



