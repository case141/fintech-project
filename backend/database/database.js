const mysql = require("mysql");
require("dotenv").config();//{ path: ".env" });

parameters = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
  };

  mysqlConnection = mysql.createConnection(parameters);

  mysqlConnection.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      // if successful, write a message to the console
      console.log("Connected to MySQL");
    }
  });
  
  mysqlConnection.query(`SELECT * from accounts`, (err, results) => {
    if (err) {
        console.log(err);
    } else {
        console.log(results);
    }
  })
  
  module.exports = { mysqlConnection };