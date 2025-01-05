import { db } from "../db.js";

export const createTicketPurchasePage = (req, res) => {
   const query = "INSERT INTO ticket_purchase_pages (`campaign_id`, `updated_at`, `updated_by`) VALUES (?)"

   const values = [
      req.body.campaign_id,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      req.body.user_id
   ]  
   
   db.query(query, [values], (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data.insertId)
   })
}

export const updateTicketPurchasePage = (req, res) => {
   const query = "UPDATE ticket_purchase_pages SET `headline` = ?, `description` = ?, `bg_color` = ?, `p_color` = ?, `s_color` = ?, `t_color` = ? WHERE `campaign_id` = ?"
   const values = [
      req.body.headline,
      req.body.description,
      req.body.bg_color,
      req.body.p_color,
      req.body.s_color,
      req.body.t_color,
      req.params.id
   ]

   db.query(query, values, (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })
}

export const getTicketPurchasePage = (req, res) => {
   const query = "SELECT * FROM ticket_purchase_pages WHERE `campaign_id` = ?"
   const value = [req.params.id]

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.json(data)
   })
}