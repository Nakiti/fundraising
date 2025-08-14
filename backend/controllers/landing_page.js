import { db } from "../db.js";
import multer from "multer"
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound,
  sendDatabaseError
} from "../utils/response.js"
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from "../utils/errors.js"

const upload = multer({
  dest: 'uploads/',
  limits: { 
    fileSize: 5 * 1024 * 1024,
    fieldSize: 25 * 1024 * 1024
  }, // 5MB limit
});

export const createLandingPage = asyncHandler(async (req, res) => {
  const { organization_id, title, description, bgImage, aboutImage, about, bg_color, p_color, s_color, c_color, ct_color, b_color, bt_color } = req.body;
  
  if (!organization_id || !title) {
    throw new ValidationError('Missing required fields: organization_id, title');
  }

  return new Promise((resolve, reject) => {
    upload.fields([
      { name: "bgImage", maxCount: 1 },
      { name: "aboutImage", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          reject(new ValidationError('File is too large. Max size is 5MB'));
          return;
        }
        reject(new DatabaseError('Image upload failed', err));
        return;
      }

      const query = "INSERT INTO landing_pages (`organization_id`, `title`, `description`, `bgImage`, `aboutImage`, `about`, `bg_color`, `p_color`,  `s_color`, `c_color`, `ct_color`, `b_color`, `bt_color`) VALUES (?)"

      const values = [
        organization_id,
        title,
        description,
        bgImage,
        aboutImage, 
        about,
        p_color,
        s_color,
        c_color,
        ct_color,
        b_color,
        bt_color
      ]

      db.query(query, [values], (err, data) => {
        if (err) {
          reject(new DatabaseError('Failed to create landing page', err));
          return;
        }
        resolve(sendCreated(res, { pageId: data.insertId }, 'Landing page created successfully'));
      })
    })
  })
})

export const updateLandingPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    title, description, bgImage, aboutImage, about,
    bg_color, p_color, s_color, c_color, ct_color, b_color, bt_color
  } = req.body;
  
  if (!id) {
    throw new ValidationError('Landing page ID is required');
  }
  
  if (!title) {
    throw new ValidationError('Title is required');
  }

  return new Promise((resolve, reject) => {
    upload.fields([
      { name: "bgImage", maxCount: 1 },
      { name: "aboutImage", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          reject(new ValidationError('File is too large. Max size is 5MB'));
          return;
        }
        reject(new DatabaseError('Image upload failed', err));
        return;
      }

      const query = "UPDATE landing_pages SET `title` = ?, `description` = ?, `bgImage` = ?, `aboutImage` = ?, `about` = ?, `bg_color` = ?, `p_color` = ?,  `s_color` = ?, `c_color` = ?, `ct_color` = ?, `b_color` = ?, `bt_color` = ? WHERE `id` = ?"

      const values = [
        title,
        description,
        bgImage,
        aboutImage,
        about,
        p_color,
        s_color,
        c_color,
        ct_color,
        b_color,
        bt_color,
        id
      ]

      db.query(query, values, (err, data) => {
        if (err) {
          reject(new DatabaseError('Failed to update landing page', err));
          return;
        }
        if (data.affectedRows === 0) {
          reject(new NotFoundError('Landing page'));
          return;
        }
        resolve(sendUpdated(res, data, 'Landing page updated successfully'));
      })
    })
  })
})

export const getLandingPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = "SELECT * FROM landing_pages WHERE organization_id = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch landing page', err));
        return;
      }
      if (!data || data.length === 0) {
        reject(new NotFoundError('Landing page'));
        return;
      }
      resolve(sendSuccess(res, data[0], 'Landing page retrieved successfully'));
    })
  })
})