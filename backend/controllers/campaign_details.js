import { db } from "../db.js";


export const createCampaignDetails = (req, res) => {
   const query = "INSERT INTO campaign_details (`campaign_id`, `internal_name`, `raised`, `visits`, `status`, `type`, `updated_at`, `updated_by`) VALUES (?)"

   const values = [
      req.body.campaign_id,
      req.body.internalName,
      0,
      0,
      "inactive",
      req.body.type,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      req.body.user_id
   ]

   db.query(query, [values], (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })
}

export const updateCampaignDetails = (req, res) => {
   const query = "UPDATE campaign_details SET `internal_name` = ?, `external_name` = ?, `goal` = ?, `default_designation` = ?, `status` = ?, `url` = ?, `updated_at` = ?, `updated_by` = ? WHERE `campaign_id` = ?"

   const values = [
      req.body.internalName,
      req.body.externalName,
      req.body.goal,
      req.body.defaultDesignation,
      req.body.status,
      req.body.url,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      req.body.userId,
      req.params.id
   ]

   db.query(query, values, (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })
}

export const getCampaignDetails = (req, res) => {
   const query = "SELECT * FROM campaign_details WHERE campaign_id = ?"

   const value = [req.params.id]

   db.query(query, value, (err, data) => {
      if (err) return console.log(err)
      return res.json(data)
   })
}