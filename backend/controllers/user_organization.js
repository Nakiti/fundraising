import { db } from "../db.js"

export const createUserOrganizationRelation = (req, res) => {
   const query = "INSERT INTO user_organizations (`user_id`, `organization_id`, `status`, `role`, `created_at`) VALUES ?"

   const values = [
      req.body.userId,
      req.body.organizationId,
      req.body.status,
      req.body.role,
      (new Date()).toISOString().slice(0, 19).replace('T', ' ')
   ]

   db.query(query, values, (err, data) => {
      if (err) return res.status(400).json(err)
      return res.json(data)
   })
}

export const getUserOrganizations = (req, res) => {
   const query = `
      SELECT organizations.name, organizations.id AS organization_id, user_organizations.role, user_organizations.id
      FROM user_organizations
      JOIN organizations ON user_organizations.organization_id = organizations.id
      WHERE status = "active" AND user_organizations.user_id = ?
   ` 

   const value = [req.params.id]

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getPendingUserOrganizations = (req, res) => {
   const query = `
      SELECT organizations.name, organizations.id AS organization_id, user_organizations.role, user_organizations.id
      FROM user_organizations
      JOIN organizations ON user_organizations.organization_id = organizations.id
      WHERE status = "pending" AND user_organizations.user_id = ?
   `
   const value = [req.params.id]

   db.query(query, value, (err, data) => {
      if (err) return res.status(400).json(err)
      return res.status(200).json(data)
   })
}

export const updateUserOrganizationRelation = (req, res) => {
   const query = `
      UPDATE user_organizations 
      SET STATUS = "active" 
      WHERE id = ?
   `

   const value = [req.params.id]

   db.query(query, value, (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })
}