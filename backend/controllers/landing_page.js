import { db } from "../db.js";
import multer from "multer"
const upload = multer({
   dest: 'uploads/',
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});


export const createLandingPage = (req, res) => {
   upload.fields(["bgImage", "aboutImage"])(req, res, (err) => {
      if (err) {
         if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File is too large. Max size is 5MB" });
         }
         console.log(err);
         return res.status(500).json({ error: "Image upload failed" });
      }

      const query = "INSERT INTO landing_pages (`organization_id`, `title`, `description`, `bgImage`, `aboutImage`, `about`, `bg_color`, `p_color`,  `s_color`, `c_color`, `ct_color`, `b_color`, `bt_color`) VALUES (?)"

      const values = [
         req.body.organization_id,
         req.body.title,
         req.body.description,
         req.files["bgImage"][0].path,
         req.files["aboutImage"][0].path,
         req.body.about,
         req.body.p_color,
         req.body.s_color,
         req.body.c_color,
         req.body.ct_color,
         req.body.b_color,
         req.body.bt_color
      ]

      db.query(query, values, (err, data) => {
         if (err) return res.json(err)
         return res.status(200).json(data)
      })
   })
}

export const updateLandingPage = (req, res) => {
   upload.fields(["bgImage", "aboutImage"])(req, res, (err) => {
      if (err) {
         if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File is too large. Max size is 5MB" });
         }
         console.log(err);
         return res.status(500).json({ error: "Image upload failed" });
      }

      const query = "UPDATE landing_pages SET `title` = ?, `description` = ?, `bgImage` = ?, `aboutImage` = ?, `about` = ?, `bg_color` = ?, `p_color` = ?,  `s_color` = ?, `c_color` = ?, `ct_color` = ?, `b_color` = ?, `bt_color` = ? WHERE `id` = ?"

      const values = [
         req.body.title,
         req.body.description,
         req.files["bgImage"][0].path,
         req.files["aboutImage"][0].path,
         req.body.about,
         req.body.p_color,
         req.body.s_color,
         req.body.c_color,
         req.body.ct_color,
         req.body.b_color,
         req.body.bt_color,
         req.params.id
      ]

      db.query(query, values, (err, data) => {
         if (err) return res.json(err)
         return res.status(200).json(data)
      })
   })
}