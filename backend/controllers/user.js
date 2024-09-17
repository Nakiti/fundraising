import { db } from "../db.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const login = (req, res) => {
   const query = "SELECT * FROM users WHERE email = ?"

   console.log(req.body)

   db.query(query, [req.body.email], (err, data) => {
      if (err) return res.status(500).json(err)
      if (data.length === 0) return res.status(404).json("User not found")
   
      const isPasswordCorrect = bcrypt.compareSync(
         req.body.password,
         data[0].password
      )
   
      if (!isPasswordCorrect) {
         return res.status(400).json("Password is incorrect")
      }

      const token = jwt.sign({id: data[0].id}, "jwtkey")
      const {password, ...other} = data[0]
   
      res.cookie("access_token", token, {
         httpOnly: true
      }).status(200).json(other)
   })
}

export const updatePassword = (req, res) => {
   const salt = bcrypt.genSaltSync(10);
   const hash = bcrypt.hashSync(req.body.password, salt);

   const q = "UPDATE users SET `password` = ? WHERE `email` = ?"

   db.query(q, [hash, req.body.email], (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const logout = (req, res) => {
   res.clearCookie("access_token", {
      sameSite: "none",
      secure: true
   }).status(200).json("User has been logged out")
   console.log("cookie cleared")
}

export const createUser = (req, res) => {
   const q = "SELECT * FROM users WHERE email = ?"

   console.log(req.body)

   db.query(q, req.body.email, (err, data) => {
      if (err) return res.status(500).json(err)
      if (data.length > 0) {return res.status(409).json("Email already in use")}
  
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
    
      const query = "INSERT INTO users (`organization_id`, `first_name`, `last_name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES (?)"
      const values = [
         req.body.organization_id,
         req.body.firstName,
         req.body.lastName,
         req.body.email,
         hash,
         req.body.role,
         (new Date()).toISOString().slice(0, 19).replace('T', ' '),
         (new Date()).toISOString().slice(0, 19).replace('T', ' ')
      ]
  
      db.query(query, [values], (err, data) => {
         if (err) return console.log(err)
         return res.status(200).json(data)
      })
   })
}

export const getUser = (req, res) => {
   const query = "SELECT * FROM users WHERE `id` = ?"

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getUsersbyOrg = (req, res) => {
   const query = "SELECT * FROM users WHERE `organization_id` = ?"

   const value = req.params.id

   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const updateUser = (req, res) => {
   const query = "UPDATE users SET `role` = ? WHERE `id` = ?"

   const values = [req.body.role, req.params.id]

   db.query(query, values, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })

}

export const deleteUser = (req, res) => {
   const query = "DELETE FROM users WHERE `id` = ?"

   db.query(query, [req.params.id], (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}