import { db } from "../db.js";
import multer from "multer";
const upload = multer({
   dest: 'uploads/',
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const createPeerFundraisingPage = (req, res) => {
   const query = "INSERT INTO peer_fundraising_pages (`campaign_id`, `updated_at`, `updated_by`) VALUES (?)"

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

export const updatePeerFundraisingPage = (req, res) => {
   upload.single('image')(req, res, (err) => {
      if (err) {
         if (err.code === 'LIMIT_FILE_SIZE') {
           return res.status(400).json({ error: "File is too large. Max size is 5MB" });
         }
         console.log(err);
         return res.status(500).json({ error: "Image upload failed" });
      } 

      const query = "UPDATE peer_fundraising_pages SET `banner_image` = ?, `person_image` = ?, `default_tagline` = ?, `default_heading` = ?, `default_description` = ?, `p_color` = ?, `s_color` = ?, `bg_color` = ?, `t_color` = ?, `updated_at` = ?, `updated_by` = ? `WHERE `campaign_id` = ?"

      const values = [
         req.body.banner_image,
         req.body.person_image,
         req.body.default_tagline,
         req.body.default_heading, 
         req.body.default_description,
         req.body.p_color,
         req.body.s_color,
         req.body.bg_color,
         req.body.t_color,
         (new Date()).toISOString().slice(0, 19).replace('T', ' '),
         req.body.user_id,
         req.params.id
      ]

      db.query(query, values, (err, data) => {
         if (err) return console.log(err)
         return res.status(200).json(data)
      })
   })
}

export const getPeerFundraisingPage = (req, res) => {
   const query = "SELECT * FROM peer_fundraising_pages WHERE `campaign_id` = ?"
   const value = [req.params.id]

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.json(data)
   })
}