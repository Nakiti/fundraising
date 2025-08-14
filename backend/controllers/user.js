import { db } from "../db.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { serialize } from "cookie"
import { config } from "../config.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendDeleted,
  sendUnauthorized,
  sendNotFound,
  sendConflict,
  sendDatabaseError
} from "../utils/response.js"
import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
  ConflictError,
  DatabaseError
} from "../utils/errors.js"

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const query = "SELECT * FROM users WHERE email = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [email], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to authenticate user', err));
      }
      
      if (data.length === 0) {
        reject(new AuthenticationError('Invalid email or password'));
      }
   
      const isPasswordCorrect = bcrypt.compareSync(password, data[0].password)
   
      if (!isPasswordCorrect) {
        reject(new AuthenticationError('Invalid email or password'));
      }
      
      const token = jwt.sign(
        {
          id: data[0].id, 
          organization_id: data[0].organization_id,
          email: data[0].email,
          role: data[0].role || 'user'
        }, 
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      const cookie = serialize("session", token, {
        httpOnly: config.cookie.httpOnly,
        secure: config.cookie.secure,
        sameSite: config.cookie.sameSite,
        maxAge: config.cookie.maxAge,
        path: config.cookie.path,
        domain: config.cookie.domain
      });

      res.setHeader("Set-Cookie", cookie);
      const {password: userPassword, ...userData} = data[0];
      resolve(sendSuccess(res, { user: userData }, 'Login successful'));
    })
  })
})

export const getCurrentUser = asyncHandler(async (req, res) => {
   const token = req.cookies.session;

   if (!token) {
      throw new AuthenticationError('Not authenticated');
   }

   return new Promise((resolve, reject) => {
      jwt.verify(token, config.jwt.secret, (err, decoded) => {
         if (err) {
            reject(new AuthenticationError('Token is not valid'));
         }
         
         // Get full user data from database
         const query = "SELECT id, first_name, last_name, email, created_at FROM users WHERE id = ?";
         
         db.query(query, [decoded.id], (err, data) => {
            if (err) {
               reject(new DatabaseError('Failed to fetch user data', err));
            }
            
            // Check if data exists and has results
            if (!data || data.length === 0) {
               reject(new NotFoundError('User'));
            }
            
            resolve(sendSuccess(res, { user: data[0] }, 'User data retrieved successfully'));
         });
      })
   })
})

export const updatePassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const q = "UPDATE users SET `password` = ? WHERE `email` = ?"

  return new Promise((resolve, reject) => {
    db.query(q, [hash, email], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to update password', err));
      }
      
      if (data.affectedRows === 0) {
        reject(new NotFoundError('User'));
      }
      
      resolve(sendUpdated(res, null, 'Password updated successfully'));
    })
  })
})

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("session", {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    path: config.cookie.path,
    domain: config.cookie.domain
  });
  
  return sendSuccess(res, null, 'User has been logged out');
})

export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  if (!firstName || !lastName || !email || !password) {
    throw new ValidationError('Missing required fields: firstName, lastName, email, password');
  }

  const q = "SELECT * FROM users WHERE email = ?"

  return new Promise((resolve, reject) => {
    db.query(q, [email], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to check existing user', err));
      }
      
      if (data.length > 0) {
        reject(new ConflictError('Email already in use'));
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
    
      const query = "INSERT INTO users (`first_name`, `last_name`, `email`, `password`, `created_at`, `updated_at`) VALUES (?)"
      const values = [
        firstName,
        lastName,
        email,
        hash,
        (new Date()).toISOString().slice(0, 19).replace('T', ' '),
        (new Date()).toISOString().slice(0, 19).replace('T', ' ')
      ]
  
      db.query(query, [values], (err, data) => {
        if (err) {
          reject(new DatabaseError('Failed to create user', err));
        }
        
        resolve(sendCreated(res, { userId: data.insertId }, 'User created successfully'));
      })
    })
  })
})

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('User ID is required');
  }

  const query = "SELECT id, first_name, last_name, email, created_at FROM users WHERE `id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch user', err));
      }
      
      if (data.length === 0) {
        reject(new NotFoundError('User'));
      }
      
      resolve(sendSuccess(res, { user: data[0] }, 'User retrieved successfully'));
    })
  })
})

export const getUsersbyOrg = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = `
    SELECT users.id, users.first_name, users.last_name, users.email, 
           users.organization_id, users.role, users.created_at,
           user_organizations.status as org_status
    FROM user_organizations
    JOIN users ON users.id = user_organizations.user_id
    WHERE organization_id = ?
  `

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch organization users', err));
      }
      
      resolve(sendSuccess(res, { users: data }, 'Organization users retrieved successfully'));
    })
  })
})

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  if (!id) {
    throw new ValidationError('User ID is required');
  }
  
  if (!role) {
    throw new ValidationError('Role is required');
  }

  const query = "UPDATE users SET `role` = ? WHERE `id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [role, id], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to update user', err));
      }
      
      if (data.affectedRows === 0) {
        reject(new NotFoundError('User'));
      }
      
      resolve(sendUpdated(res, null, 'User updated successfully'));
    })
  })
})

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('User ID is required');
  }

  const query = "DELETE FROM users WHERE `id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to delete user', err));
      }
      
      if (data.affectedRows === 0) {
        reject(new NotFoundError('User'));
      }
      
      resolve(sendDeleted(res, 'User deleted successfully'));
    })
  })
})