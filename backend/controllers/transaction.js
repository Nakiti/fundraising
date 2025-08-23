import { db } from "../db.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound,
  sendDatabaseError
} from "../utils/response.js"
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from "../utils/errors.js"

export const createTransaction = asyncHandler(async (req, res) => {
  const { 
    campaign_id, 
    organization_id, 
    donor_id, 
    amount, 
    status, 
    method,
    // Stripe-specific fields
    stripe_payment_intent_id,
    stripe_charge_id,
    stripe_customer_id,
    processing_fee,
    net_amount,
    application_fee,
    payment_method_type,
    designation_id
  } = req.body;
  
  if (!campaign_id || !organization_id || !amount || !status || !method) {
    throw new ValidationError('Missing required fields: campaign_id, organization_id, amount, status, method');
  }

  const query = `
    INSERT INTO transactions (
      \`campaign_id\`, 
      \`organization_id\`, 
      \`donor_id\`, 
      \`amount\`, 
      \`status\`, 
      \`method\`, 
      \`date\`,
      \`stripe_payment_intent_id\`,
      \`stripe_charge_id\`,
      \`stripe_customer_id\`,
      \`processing_fee\`,
      \`net_amount\`,
      \`application_fee\`,
      \`payment_method_type\`,
      \`designation_id\`
    ) VALUES (?)
  `;

  const values = [
    campaign_id,
    organization_id,
    donor_id,
    amount,
    status,
    method, 
    new Date(),
    stripe_payment_intent_id || null,
    stripe_charge_id || null,
    stripe_customer_id || null,
    processing_fee || 0,
    net_amount || amount, // Default to full amount if no processing fee
    application_fee || 0,
    payment_method_type || 'card',
    designation_id || null
  ]

  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to create transaction', err));
      sendCreated(res, { 
        transactionId: data.insertId,
        stripePaymentIntentId: stripe_payment_intent_id 
      }, 'Transaction created successfully');
      resolve();
    })
  })
})

export const getTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Transaction ID is required');
  }

  const query = "SELECT * FROM transactions WHERE `id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch transaction', err));
      if (!data || data.length === 0) reject(new NotFoundError('Transaction'));
      sendSuccess(res, data[0], 'Transaction retrieved successfully');
      resolve();
    })
  })
})

export const getTransactionsbyCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = `
    SELECT transactions.*, campaign_details.external_name 
    FROM transactions 
    INNER JOIN campaign_details ON transactions.campaign_id = campaign_details.campaign_id 
    WHERE transactions.campaign_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch campaign transactions', err));
      sendSuccess(res, data, 'Campaign transactions retrieved successfully');
      resolve();
    })
  })
})

export const getAllTransactions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = `
    SELECT transactions.*, campaign_details.external_name, 
           CASE 
             WHEN donors.is_guest = TRUE THEN CONCAT(donors.first_name, ' (Guest)')
             ELSE donors.first_name
           END as first_name, 
           donors.last_name, donors.email, donors.is_guest
    FROM transactions 
    INNER JOIN campaigns ON transactions.campaign_id = campaigns.id
    INNER JOIN campaign_details ON campaign_details.campaign_id = campaigns.id
    LEFT JOIN donors ON transactions.donor_id = donors.id 
    WHERE transactions.organization_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch organization transactions', err));
      sendSuccess(res, data, 'Organization transactions retrieved successfully');
      resolve();
    })
  })
})

export const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, amount, method } = req.body;
  
  if (!id) {
    throw new ValidationError('Transaction ID is required');
  }
  
  if (!status && !amount && !method) {
    throw new ValidationError('At least one field to update is required: status, amount, method');
  }

  let query = "UPDATE transactions SET ";
  const updates = [];
  const values = [];

  if (status) {
    updates.push("`status` = ?");
    values.push(status);
  }
  if (amount) {
    updates.push("`amount` = ?");
    values.push(amount);
  }
  if (method) {
    updates.push("`method` = ?");
    values.push(method);
  }

  query += updates.join(", ") + " WHERE `id` = ?";
  values.push(id);

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to update transaction', err));
      if (data.affectedRows === 0) reject(new NotFoundError('Transaction'));
      sendUpdated(res, data, 'Transaction updated successfully');
      resolve();
    })
  })
})

export const getTransactionsOverTime = asyncHandler(async (req, res) => {
  const { start, end } = req.query;
  const { id } = req.params;
  
  if (!start || !end) {
    throw new ValidationError('Start and end dates are required');
  }
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = `
    SELECT 
      COUNT(*) as transactionsCount,
      SUM(amount) as totalRaised
    FROM transactions 
    WHERE date between ? and ? and organization_id = ?
  `

  const values = [start, end, id]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch transactions over time', err));
      sendSuccess(res, data[0], 'Transactions over time retrieved successfully');
      resolve();
    })
  })
})

export const searchTransactions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const { id } = req.params;
  
  if (!q) {
    throw new ValidationError('Search query is required');
  }
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = `
    SELECT * FROM transactions 
    WHERE CONCAT(first_name, ' ', last_name, ' ', id, ' ') LIKE ? 
    AND organization_id = ?
  `;

  const values = [`%${q}%`, id]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to search transactions', err));
      sendSuccess(res, data, 'Transaction search completed');
      resolve();
    })
  })
})

export const getFiltered = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  let query = `
    SELECT transactions.*, campaigns.campaign_name 
    FROM transactions 
    INNER JOIN campaigns ON transactions.campaign_id = campaigns.id 
    WHERE transactions.organization_id = ?
  `;
  
  const params = [id];

  if (status && status !== "all") {
    query += " AND transactions.status = ?";
    params.push(status);
  }

  return new Promise((resolve, reject) => {
    db.query(query, params, (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch filtered transactions', err));
      sendSuccess(res, data, 'Filtered transactions retrieved successfully');
      resolve();
    })
  })
})