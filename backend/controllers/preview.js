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

      const query = "INSERT INTO previews (`campaign_id`, `headline`, `description`, `image`, `bg_color`, `p_color`, `s_color`, `b1_color`, `b2_color`, `b3_color`, `button1`, `button2`, `button3`, `button4`, `button5`, `button6`) VALUES (?)"

      console.log(req.body.campaign_id)

      const values = [
         req.body.campaign_id,
         req.body.headline,
         req.body.description,
         req.body.image, 
         req.body.bg_color,
         req.body.p_color,
         req.body.s_color,
         req.body.b1_color,
         req.body.b2_color,
         req.body.b3_color,
         req.body.button1,
         req.body.button2,
         req.body.button3,
         req.body.button4,
         req.body.button5,
         req.body.button6,
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

      const query = "UPDATE previews SET `headline` = ?, `description` = ?, `image` = ?, `bg_color` = ?, `p_color` = ?, `s_color` = ?, `b1_color` = ?, `b2_color` = ?, `b3_color` = ?, `button1` = ?, `button2` = ?, `button3` = ?, `button4` = ?, `button5` = ?, `button6` = ?  WHERE `campaign_id` = ?"

      const values = [
         req.body.headline,
         req.body.description,
         req.body.image,
         // req.body.heading,
         req.body.bg_color,
         req.body.p_color,
         req.body.s_color,
         // req.body.h_color,
         req.body.b1_color,
         req.body.b2_color,
         req.body.b3_color,
         req.body.button1,
         req.body.button2,
         req.body.button3,
         req.body.button4,
         req.body.button5,
         req.body.button6,
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