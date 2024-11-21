import { db } from "../db.js";

export const createSection = (req, res) => {
   const query = "INSERT INTO sections (`page_id`, `name`, `active`, `updated_at`, `updated_by`) VALUES (?)"

   const values = [
      req.body.page_id,
      req.body.name, 
      req.body.active,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      req.body.user_id
   ]

   db.query(query, [values], (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })
}

export const updateSection = (req, res) => {
   const query = "UPDATE sections SET `active` = ? WHERE `id` = ?"

   const values = [
      req.body.active,
      req.params.id
   ]

   db.query(query, values, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getSection = (req, res) => {
   const query = "SELECT * FROM sections WHERE id = ?"

   const value = [req.params.id]

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getSectionByPage = (req, res) => {
   const query = "SELECT * FROM sections WHERE page_id = ?"

   const value = [req.params.id]

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}