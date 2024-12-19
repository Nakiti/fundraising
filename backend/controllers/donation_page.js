import { db } from "../db.js"
import multer from "multer"
const upload = multer({
   dest: 'uploads/',
   limits: { 
      fileSize: 5 * 1024 * 1024,
      fieldSize: 25 * 1024 * 1024
   }, // 5MB limit
});

export const createDonationPage = (req, res) => {
   const query = "INSERT INTO donation_pages (`campaign_id`) VALUES ?"

   const values = [
      [req.body.campaign_id],
   ]

   db.query(query, [values], (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data.insertId)
   })
}

export const getDonationPage = (req, res) => {
   const query = "SELECT * FROM donation_pages WHERE `campaign_id` = ?"
   const value = req.params.id 

   console.log(value)

   db.query(query, [value], (err, data) => {
      if (err) return console.log(err)
      console.log("id", data)
      return res.status(200).json(data)
   })
}

export const updateDonationPage = (req, res) => {
   console.log("yoooooo")
   console.log(upload)
   upload.fields([
      { name: 'banner_image', maxCount: 1 },
      { name: 'small_image', maxCount: 1 },
   ])(req, res, (err) => {
      if (err) {
         if (err.code === 'LIMIT_FILE_SIZE') {
           return res.status(400).json({ error: "File is too large. Max size is 5MB" });
         }
         console.log(err);
         return res.status(500).json({ error: "Image upload failed" });
      } 

      const bannerImagePath = req.files?.banner_image?.[0]?.path || req.body.banner_image;
      const smallImagePath = req.files?.small_image?.[0]?.path || req.body.small_image;


      const query = "UPDATE donation_pages SET `headline` = ?, `description` = ?, `banner_image` = ?, `small_image` = ?, `bg_color` = ?, `p_color` = ?, `s_color` = ?, `b1_color` = ?, `b2_color` = ?, `b3_color` = ?, `button1` = ?, `button2` = ?, `button3` = ?, `button4` = ?, `button5` = ?, `button6` = ?  WHERE `campaign_id` = ?"

      const values = [
         req.body.headline,
         req.body.description,
         bannerImagePath,
         smallImagePath,
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

