import mysql from "mysql2"

let config = {
   host: "127.0.0.1",
   user: "root",
   password: "password",
   database: "fundraising",
   port: 3306
}

export const db = new mysql.createPool(config)