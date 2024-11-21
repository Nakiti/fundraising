import { db } from "../db.js";

export const createRelationBatch = (req, res) => {
   const query = "INSERT INTO campaign_designations (`campaign_id`, `designation_id`, `created_at`) VALUES ?"

   console.log("body", req.body)

   const values = req.body.map(relation => [
      Number(req.params.campaign_id),
      relation.id,
      (new Date()).toISOString().slice(0, 19).replace('T', ' ')
   ]);

   console.log(values)

   db.query(query, [values], (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })
}

export const getRelations = (req, res) => {
   const query = `
      SELECT designations.*
      FROM campaign_designations
      JOIN designations ON campaign_designations.designation_id = designations.id
      WHERE campaign_designations.campaign_id = ?
   `

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const deleteRelation = (req, res) => {
   const query = "DELETE FROM campaign_designations WHERE `campaign_id` = ?"

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })
}