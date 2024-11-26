import { db } from "../db.js";
import multer from "multer"
const upload = multer({
   dest: 'uploads/',
   limits: { 
      fileSize: 5 * 1024 * 1024,
      fieldSize: 25 * 1024 * 1024
   }, // 5MB limit
});

export const createTicketPage = (req, res) => {
   const query = "INSERT INTO ticket_pages (`campaign_id`) VALUES ?"

   const value = [[req.body.campaignId]]

   db.query(query, [value], (err, data) => {
      if (err) return res.json(err)
      console.log("insertedId", data.insertId)
      return res.status(200).json(data.insertId)
   })
}

export const getTicketPage = (req, res) => {
   const query = "SELECT * FROM ticket_pages WHERE `campaign_id` = ?"

   const value = req.params.id

   db.query(query, [value], (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const updateTicketPage = (req, res) => {
   upload.single('image')(req, res, (err) => {
      if (err) {
         if (err.code === 'LIMIT_FILE_SIZE') {
           return res.status(400).json({ error: "File is too large. Max size is 5MB" });
         }
         console.log(err);
         return res.status(500).json({ error: "Image upload failed" });
      } 

      const query = "UPDATE ticket_pages SET `title` = ?, `date` = ?, `address` = ?, `bgImage` = ?, `aboutDescription` = ?, `venueName` = ?, `instructions` = ?, `bg_color` = ?, `bg2_color` = ?, `p_color` = ?, `s_color` = ?, `b1_color` = ? WHERE `campaign_id` = ?"

      const values = [
         req.body.title,
         req.body.date,
         req.body.address,
         req.body.bgImage,
         req.body.aboutDescription,
         req.body.venueName,
         req.body.instructions,
         req.body.bg_color,
         req.body.bg_color2,
         req.body.p_color,
         req.body.s_color,
         req.body.b1_color,
         req.params.id
      ]

      db.query(query, values, (err, data) => {
         if (err) return console.log(err)
         return res.status(200).json(data)
      })
   })
}