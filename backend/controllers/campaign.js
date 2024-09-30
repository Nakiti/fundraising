import { db } from "../db.js"

export const createCampaign = (req, res) => {

   const q = "SELECT * FROM campaigns WHERE url = ?"

   db.query(q, [req.body.url], (err, data) => {
      if (err) return res.status(500).json(err)
      if (data.length > 0) return res.status(409).json("Short URL already in use")

      const query = "INSERT INTO campaigns (`organization_id`, `title`, `description`, `goal`, `raised`, `donations`, `visits`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`, `url`) VALUES (?)"

      const values = [
         req.body.organization_id,
         req.body.title,
         req.body.description,
         req.body.goal,
         0,
         0,
         0,
         req.body.status,
         (new Date()).toISOString().slice(0, 19).replace('T', ' '),
         (new Date()).toISOString().slice(0, 19).replace('T', ' '),
         req.body.created_by,
         req.body.created_by,
         req.body.url
      ]
   
      // console.log(values)
      
      db.query(query, [values], (err, data) => {
         if (err) return res.json(err)
         console.log(data)
         return res.status(200).json(data.insertId)
      })
   })
}

export const getCampaign = (req, res) => {
   const query = "SELECT * FROM campaigns WHERE `id` = ?"

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getCampaignsByOrg = (req, res) => {
   const query = "SELECT * FROM campaigns WHERE `organization_id` = ?"

   const value = req.params.id

   console.log("campaign", value)

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

   console.log(status)

   if (status == "all") {
      query = "SELECT * FROM campaigns WHERE `organization_id` = ?"
   }

   db.query(query, [id, status], (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const updateCampaign = (req, res) => {
   const query = "UPDATE campaigns SET `title` = ?, `description` = ?, `goal` = ?, `status` = ?, `updated_at` = ?, `updated_by` = ?, `url` = ? WHERE `id` = ?"

   const values = [
      req.body.title,
      req.body.description,
      req.body.goal,
      req.body.status,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      req.body.updated_by,
      req.body.url,
      req.params.id 
   ]


   db.query(query, values, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

