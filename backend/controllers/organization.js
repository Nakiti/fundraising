import { db } from "../db.js";

export const register = (req, res) => {
   const q = "SELECT * FROM organizations WHERE email = ?"

   console.log(req.body)

   db.query(q, [req.body.email], (err, data) => {
      if (err) return res.status(500).json(err)
      if (data.length > 0) {return res.status(409).json("Organization already exists")}
      
      const query = "INSERT INTO organizations(`name`, `email`, `address`, `city`, `state`, `country`, `zip`, `created_at`, `updated_at`, `updated_by`) VALUES (?)";
      const values = [
         req.body.name, 
         req.body.email, 
         req.body.address,
         req.body.city,
         req.body.state,
         req.body.country,
         req.body.zip,
         (new Date()).toISOString().slice(0, 19).replace('T', ' '),
         (new Date()).toISOString().slice(0, 19).replace('T', ' '),
         0
      ]
  
      db.query(query, [values], (err, data) => {
         if (err) return console.log(err)
         return res.status(200).json(data.insertId)
      })
   })
}

export const get = (req, res) => {
   const query = "SELECT * FROM organizations WHERE id = ?"

   const id = req.params.id;

   console.log(id)

   db.query(query, [id], (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })
}

export const update = (req, res) => {
   const query = "UPDATE organizations SET `name` = ?, `address` = ?, `city` = ?, `state` = ?, `country` = ?, `zip` = ?, `updated_at` = ?, `updated_by` = ? WHERE id = ?"

   const values = [
      req.body.name, 
      req.body.address,
      req.body.city,
      req.body.state,
      req.body.country,
      req.body.zip,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      req.body.updated_by,
      req.params.id
   ]

   db.query(query, [values], (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })
}



