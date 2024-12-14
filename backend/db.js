import mysql from "mysql2"

let config = {
   host: "mysql-ehundi.mysql.database.azure.com",
   user: "nakiti",
   password: "Nikhil05$",
   database: "fundraising",
   port: 3306,
   ssl: {
      rejectUnauthorized: true, 
   },
}

export const db = new mysql.createPool(config)
