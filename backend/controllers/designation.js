import { db } from "../db.js"

export const createDesignation = (req, res) => {
   const q = "SELECT * FROM designations WHERE title = ?"

   db.query(q, [req.body.title], (err, data) => {
      if (err) return res.json(err)
      if (data.length > 0) return res.status(409).json("Designation already exists")

      const query = "INSERT INTO designations (`organization_id`, `title`, `raised`, `goal`, `donations`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (?)"

      const values = [
         req.body.organization_id,
         req.body.title,
         0,
         req.body.goal,
         0,
         "active",
         (new Date()).toISOString().slice(0, 19).replace('T', ' '),
         (new Date()).toISOString().slice(0, 19).replace('T', ' '),
         req.body.created_by,
         req.body.updated_by
      ]
   
      console.log(values)
   
      db.query(query, [values], (err, data) => {
         if (err) return console.log(err)
         return res.status(200).json(data)
      })
   })
}

export const updateDesignation = (req, res) => {
   if (req.body.status === "inactive") {
      const query = "SELECT * FROM campaign_designations WHERE designation_id = ?";

      db.query(query, [req.params.id], (err, data) => {
         if (err) return res.status(500).json(err);         
         if (data.length > 0) return res.status(409).json({ error: "Designation currently in use" });
         
         updateDesignationDetails(req, res);
      });
   } else {
      updateDesignationDetails(req, res);
   }
};

const updateDesignationDetails = (req, res) => {
   const query = "UPDATE designations SET `title` = ?, `goal` = ?, `status` = ? WHERE id = ?";

   const values = [
      req.body.title,
      req.body.goal,
      req.body.status,
      req.params.id
   ];

   db.query(query, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
   });
};


export const getDesignations = (req, res) => {
   const query = "SELECT * FROM designations WHERE organization_id = ?"

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getActiveDesignations = (req, res) => {
   const query = "SELECT * FROM designations WHERE status = 'active' AND organization_id = ?"

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const deleteDesignation = (req, res) => {

}