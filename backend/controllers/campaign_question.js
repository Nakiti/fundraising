import { db } from "../db";

export const createCustomQuestion = (req, res) => {

   const query = "INSERT INTO campaign_questions (`campaign_id`, `question`, `type`) VALUES (?)"
   const values = [
      req.body.campaign_id,
      req.body.question,
      req.body.type
   ]

   db.query(query, values, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const deleteCustomQuestion = (req, res) => {

   const query = "DELETE FROM campaign_questions WHERE `question_id` = ?"
   const value = req.params.campaign_id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}