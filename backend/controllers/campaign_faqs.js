import { db } from "../db.js";

export const createFaqs = (req, res) => {
   const query = "INSERT INTO campaign_faqs (`campaign_id`, `question`, `answer`, `created-at`) VALUES ?"

   const values = req.body.map(faq => [
      Number(req.params.id),
      faq.question,
      faq.answer,
      (new Date()).toISOString().slice(0, 19).replace('T', ' ')
   ])

   db.query(query, [values], (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getFaqs = (req, res) => {
   const query = "SELECT * FROM campaign_faqs WHERE `campaign_id` = ?"

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const deleteFaq = (req, res) => {
   const query = "DELETE FROM campaign_faqs WHERE `id` = ?"

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}