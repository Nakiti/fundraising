import mysql from "mysql2"

let config = {
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB,
   port: process.env.DB_PORT,
   ssl: {
      rejectUnauthorized: true, 
   },
}

export const db = new mysql.createPool(config)
