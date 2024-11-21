import { db } from "../db.js"

export const createCampaign = (req, res) => {
   const q = "SELECT * FROM campaigns WHERE url = ?"
   // if (data.length > 0) return res.status(409).json("Short URL already in use")

   const query = "INSERT INTO campaigns (`organization_id`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (?)"

   const values = [
      req.body.organization_id,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      req.body.created_by,
      req.body.created_by,
   ]
      
   db.query(query, [values], (err, data) => {
      if (err) return res.json(err)
      console.log(data)
      return res.status(200).json(data.insertId)
   })
}

export const getCampaign = (req, res) => {
   // const query = "SELECT * FROM campaigns WHERE `id` = ?"

   const query = `
      SELECT campaigns.*, campaign_details.*, users.first_name, users.last_name 
      FROM campaigns 
      INNER JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
      INNER JOIN users on campaigns.updated_by = users.id 
      WHERE campaigns.id = ?`

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })
}

export const searchCampaigns = (req, res) => {
   const query = "SELECT * FROM campaigns WHERE campaign_name LIKE ? AND organization_id = ?"

   const values = [
      `%${req.query.q}%`,
      req.params.id
   ]

   db.query(query, values, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getCampaignsByOrg = (req, res) => {
   const query = `
      SELECT campaigns.id, campaigns.created_at, campaign_details.*
      FROM campaigns
      INNER JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
      WHERE campaigns.organization_id = ?
   `
   const value = [req.params.id]

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getActive = (req, res) => {
   const query = "SELECT * FROM campaigns WHERE status = `active`"

   db.query(query, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)  
   })
}

export const getFiltered = (req, res) => {
   let query = "SELECT * FROM campaigns WHERE `organization_id` = ? AND `status` = ?"
   const status = req.query.status
   const id = req.params.id

   console.log(id)

   if (status == "all") {
      query = "SELECT * FROM campaigns WHERE `organization_id` = ?"
   }

   db.query(query, [id, status], (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getDateRange = (req, res) => {
   const query = "SELECT * FROM campaigns WHERE `created_at` BETWEEN ? AND ? AND `organization_id` = ?" 

   const values = [
      req.query.start,
      req.query.end,
      req.params.id
   ]

   console.log(values)

   db.query(query, values, (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })

}

export const updateCampaign = (req, res) => {
   const q = "SELECT * FROM campaigns WHERE url = ?"

   db.query(q, [req.body.url], (err, data) => {
      if (err) return res.status(500).json(err)
      if (data.length > 0 && data[0].id != req.params.id) return res.status(409).json("Short URL already in use")

      const query = "UPDATE campaigns SET `default_designation` = ?, `campaign_name` = ?, `internal_name` = ?, `goal` = ?, `status` = ?, `updated_at` = ?, `updated_by` = ?, `url` = ? WHERE `id` = ?"

      console.log(req.body.status)

      const values = [
         req.body.defaultDesignation,
         req.body.campaignName,
         req.body.internalName,
         req.body.goal,
         req.body.status,
         (new Date()).toISOString().slice(0, 19).replace('T', ' '),
         req.body.updated_by,
         req.body.url,
         req.params.id 
      ]

      db.query(query, values, (err, data) => {
         if (err) return console.log(err)
         return res.status(200).json(data)
      })
   })
}

export const deactivateCampaign = (req, res) => {
   const query = "UPDATE campaigns SET `status` = 'inactive', `updated_by` = ?, `updated_at` = ? WHERE id = ?"

   const values = [
      req.body.updatedBy,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      req.params.id
   ]

   db.query(query, values, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })

}

export const sumDonations = (req, res) => {
   const query = "SELECT SUM(donations) FROM campaigns WHERE campaign_id = ? AND "

}

export const sumRaised = () => {


}