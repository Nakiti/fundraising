import { db } from "../db.js";
import multer from "multer"
const upload = multer({
   dest: 'uploads/',
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const createThankYouPage = (req, res) => {
   const query = "INSERT INTO thankyou_pages (`campaign_id`, `updated_at`, `updated_by`) VALUES (?)"

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

export const updateThankYouPage = (req, res) => {
   upload.single('image')(req, res, (err) => {
      if (err) {
         if (err.code === 'LIMIT_FILE_SIZE') {
           return res.status(400).json({ error: "File is too large. Max size is 5MB" });
         }
         console.log(err);
         return res.status(500).json({ error: "Image upload failed" });
      } 

      const query = "UPDATE thankyou_pages SET `headline` = ?, `description` = ?, `bg_image` = ?, `bg_color` = ?, `p_color` = ?, `s_color` = ? WHERE `campaign_id` = ?"

      const values = [
         req.body.headline,
         req.body.description,
         req.body.bg_image,
         req.body.bg_color,
         req.body.p_color,
         req.body.s_color,
         req.params.id
      ]

      console.log(values)

      db.query(query, values, (err, data) => {
         if (err) return console.log(err)
         return res.status(200).json(data)
      })
   })
}

export const getThankYouPage = (req, res) => {
   const query = "SELECT * FROM thankyou_pages WHERE `campaign_id` = ?"
   
   const value = [req.params.id]

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.json(data)
   })
}