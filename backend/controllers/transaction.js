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
   const query = "SELECT * FROM transactions WHERE `campaign_id` = ?"

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getAllTransactions = (req, res) => {
   const query = "SELECT * FROM transactions WHERE `organization_id` = ?"

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const updateTransaction = (req, res) => {
   
}