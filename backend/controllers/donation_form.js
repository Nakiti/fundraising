import { db } from "../db.js"
import multer from "multer"
const upload = multer({
   dest: 'uploads/',
   limits: { 
      fileSize: 5 * 1024 * 1024,
      fieldSize: 25 * 1024 * 1024
   }, // 5MB limit
});

export const createDonationForm = (req, res) => {
   const query = "INSERT INTO donation_forms (`campaign_id`, `updated_at`, `updated_by`) VALUES (?)"

   const values = [
      req.body.campaign_id,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      req.body.user_id
   ]

   db.query(query, [values], (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data.insertId)
   })
}

export const getDonationForm = (req, res) => {
   const query = "SELECT * FROM donation_forms WHERE `campaign_id` = ?"
   const value = req.params.id 

   console.log(value)

   db.query(query, [value], (err, data) => {
      if (err) return console.log(err)
      console.log("id", data[0].id)
      return res.status(200).json(data)
   })
}

export const updateDonationForm = (req, res) => {
   upload.single('image')(req, res, (err) => {
      if (err) {
         if (err.code === 'LIMIT_FILE_SIZE') {
           return res.status(400).json({ error: "File is too large. Max size is 5MB" });
         }
         console.log(err);
         return res.status(500).json({ error: "Image upload failed" });
      } 

      const query = "UPDATE donation_forms SET `bg_image` = ?, `headline` = ?, `description` = ?, `button1` = ?, `button2` = ?, `button3` = ?, `button4` = ?, `button5` = ?, `button6` = ?, `p_color` = ?, `s_color` = ?, `bg_color` = ?, `t_color` = ?, `updated_at` = ?, `updated_by` = ? WHERE `campaign_id` = ?"

      const values = [
         req.body.bg_image,
         req.body.headline,
         req.body.description,
         req.body.button1,
         req.body.button2,
         req.body.button3,
         req.body.button4, 
         req.body.button5,
         req.body.button6,
         req.body.p_color,
         req.body.s_color,
         req.body.bg_color,
         req.body.t_color,
         (new Date()).toISOString().slice(0, 19).replace('T', ' '),
         req.body.user_id,
         req.params.id
      ]

      console.log(values)

      db.query(query, values, (err, data) => {
         if (err) return console.log(err)
         console.log(data)
         return res.status(200).json(data)
      })
   })
}

