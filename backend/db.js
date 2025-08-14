import mysql from "mysql2"
import { config } from "./config.js"

let dbConfig = {
   host: config.database.host,
   user: config.database.user,
   password: config.database.password,
   database: config.database.database,
   port: config.database.port,
   // Connection pool settings
   connectionLimit: 10,
   acquireTimeout: 60000,
   timeout: 60000,
   reconnect: true,
   // SSL configuration
   ssl: config.server.nodeEnv === "production" ? {
      rejectUnauthorized: true,
   } : {
      rejectUnauthorized: false,
   }
}

export const db = new mysql.createPool(dbConfig)

// Test database connection
db.getConnection((err, connection) => {
   if (err) {
      console.error('Database connection failed:', err);
      return;
   }
   console.log('Database connected successfully');
   connection.release();
});

// Handle connection errors
db.on('error', (err) => {
   console.error('Database error:', err);
   if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Database connection was closed. Reconnecting...');
   } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.log('Database has too many connections.');
   } else if (err.code === 'ECONNREFUSED') {
      console.log('Database connection was refused.');
   }
});
