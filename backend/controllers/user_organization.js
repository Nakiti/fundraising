import { db } from "../db.js"

export const createUserOrganizationRelation = (req, res) => {

   const query = "INSERT INTO user_organizations (`user_id`, `organization_id`) VALUES ?"

   const values = [
      req.body.userId,
      req.body.organizationId
   ]

   db.query(query, values, (err, data) => {
      if (err) return res.status(400).json(err)
      return res.json(data)
   })
}

export const getUserOrganizations = (req, res) => {
   const query = `
      SELECT organizations.*, user_organizations.role
      FROM user_organizations
      JOIN organizations ON user_organizations.organization_id = organizations.id
      WHERE user_organizations.user_id = ?
   `

   const value = [req.params.id]

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}