import { db } from "../db.js";

export const createCustomQuestion = (req, res) => {

   const query = "INSERT INTO campaign_questions (`campaign_id`, `question`, `type`, `created_at`) VALUES ?"
   
   console.log(req.body)

   const values = req.body.map(question => [
      Number(req.params.id),
      question.question,
      question.type,
      (new Date()).toISOString().slice(0, 19).replace('T', ' ')
   ])

   console.log(values)
   
   db.query(query, [values], (err, data) => {
      if (err) return console.log(err)
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

export const getCustomQuestions = (req, res) => {
   const query = "SELECT * FROM campaign_questions WHERE `campaign_id` = ?"

   const value = req.params.id
   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
         return res.status(200).json(data)
   })
}