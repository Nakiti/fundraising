import { db } from "../db.js"
import multer from "multer"
const upload = multer({
   dest: 'uploads/',
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});


export const createPreview = (req, res) => {
   upload.single('image')(req, res, (err) => {
      if (err) {
         if (err.code === 'LIMIT_FILE_SIZE') {
           return res.status(400).json({ error: "File is too large. Max size is 5MB" });
         }
         console.log(err);
         return res.status(500).json({ error: "Image upload failed" });
      } 

      const query = "INSERT INTO previews (`campaign_id`, `title`, `message`, `image`, `heading`, `bg_color`, `p_color`, `s_color`, `h_color`, `ht_color`, `b1_color`, `b2_color`, `b3_color`, `m_color`) VALUES (?)"

      const values = [
         req.body.campaign_id,
         req.body.title,
         req.body.message,
         req.body.image, 
         req.body.heading, 
         req.body.bg_color,
         req.body.p_color,
         req.body.s_color,
         req.body.h_color,
         req.body.ht_color,
         req.body.b1_color,
         req.body.b2_color,
         req.body.b3_color,
         req.body.m_color,
      ]

      // console.log(values)

      db.query(query, [values], (err, data) => {
         if (err) return console.log(err)
         return res.status(200).json(data)
      })
   })
}

export const getPreview = (req, res) => {
   const query = "SELECT * FROM previews WHERE `campaign_id` = ?"

   const value = req.params.id 

   console.log(value)

   db.query(query, [value], (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })

}

export const updatePreview = (req, res) => {

   upload.single('image')(req, res, (err) => {
      if (err) {
         if (err.code === 'LIMIT_FILE_SIZE') {
           return res.status(400).json({ error: "File is too large. Max size is 5MB" });
         }
         console.log(err);
         return res.status(500).json({ error: "Image upload failed" });
      } 

      const query = "UPDATE previews SET `title` = ?, `message` = ?, `image` = ?, `heading` = ?, `bg_color` = ?, `p_color` = ?, `s_color` = ?, `h_color` = ? WHERE `campaign_id` = ?"

      const values = [
         req.body.title,
         req.body.message,
         req.body.image,
         req.body.heading,
         req.body.bg_color,
         req.body.p_color,
         req.body.s_color,
         req.body.h_color,
         req.params.id
      ]

      // console.log(values)

      db.query(query, values, (err, data) => {
         if (err) return console.log(err)
         return res.status(200).json(data)
      })
   })
}

export const deletePreview = (req, res) => {
   
}