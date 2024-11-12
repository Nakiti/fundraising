import { db } from "../db.js"

export const createTransaction = (req, res) => {
   const query = "INSERT INTO transactions (`campaign_id`, `organization_id`, `donor_id`, `amount`, `status`, `method`, `date`) VALUES ?"

   const values = [
      req.body.campaign_id,
      req.body.organization_id,
      req.body.donor_id,
      req.body.amount,
      req.body.status,
      req.body.method, 
      new Date()
   ]

   db.query(query, values, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getTransaction = (req, res) => {
   const query = "SELECT * FROM transactions WHERE `id` = ?"

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getTransactionsbyCampaign = (req, res) => {
   // const query = "SELECT * FROM transactions WHERE `campaign_id` = ?"

   const query = `
      SELECT transactions.*, campaigns.campaign_name 
      FROM transactions 
      INNER JOIN campaigns ON transactions.campaign_id = campaigns.id 
      WHERE transactions.campaign_id = ?
   `;

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getAllTransactions = (req, res) => {
   const query = `
      SELECT transactions.*, campaigns.campaign_name 
      FROM transactions 
      INNER JOIN campaigns ON transactions.campaign_id = campaigns.id 
      WHERE transactions.organization_id = ?
   `;

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const updateTransaction = (req, res) => {
   
}

export const getTransactionsOverTime = (req, res) => {
   const query = `
      SELECT 
         COUNT(*) as transactionsCount,
         SUM(amount) as totalRaised
      FROM transactions 
      WHERE date between ? and ? and organization_id = ?
   `

   const values = [
      req.query.start,
      req.query.end,
      req.params.id
   ]

   db.query(query, values, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data[0])
   })
}

export const searchTransactions = (req, res) => {
   const query = `
      SELECT * FROM transactions 
      WHERE CONCAT(first_name, ' ', last_name, ' ', id, ' ') LIKE ? 
      AND organization_id = ?
   `;

   const values = [
      `%${req.query.q}%`,
      req.params.id
   ]

   db.query(query, values, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getFiltered = (req, res) => {
   let query = `
      SELECT transactions.*, campaigns.campaign_name 
      FROM transactions 
      INNER JOIN campaigns ON transactions.campaign_id = campaigns.id 
      WHERE transactions.organization_id = ? AND transactions.status = ?
   `
   const status = req.query.status
   const id = req.params.id

   console.log(id)

   if (status == "all") {
      query = `
         SELECT transactions.*, campaigns.campaign_name 
         FROM transactions 
         INNER JOIN campaigns ON transactions.campaign_id = campaigns.id 
         WHERE transactions.organization_id = ?
      `   
   }

   db.query(query, [id, status], (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}