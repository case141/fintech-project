express = require("express");
database = require("../database/database");

router = express.Router();

// a GET API to fetch all the accounts
router.get("/get-all", (request, response) => {
  database.mysqlConnection.query("SELECT * FROM accounts", (error, results) => {
    if (error) {
      console.error(error);
      response.status(500).send("Internal Server Error");
    } else {
      response.status(200).send(results);
    }
  });
});

// Get Account by Account Number
router.get("/get-account-by-account-number", (request, response) => {
    database.mysqlConnection.query(`SELECT * FROM accounts WHERE account_number = ${request.query.account_number}`, (error, results) => {
        if (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
        } else {
        response.status(200).send(results);
        }
    });
});

// Create Account
router.post("/create-account", (request, response) => {
    database.mysqlConnection.query(`INSERT INTO accounts (account_number, type, balance, creation_date) VALUES ('${request.body.account_number}','${request.body.type}','${request.body.balance}', now())`, (error, results) => {
        if (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
        } else {
        response.status(200).send(results);
        }
    });
});

// Update Account Balance by Account Number
router.put("/update-balance-by-account-number", (request, response) => {
    database.mysqlConnection.query(`UPDATE accounts SET balance = ${request.body.balance} WHERE account_number = ${request.body.account_number}`, (error, results) => {
        if (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
        } else {
        response.status(200).send(results);
        }
    });
});

// Delete Account by Account Number
router.delete("/delete-account-by-account-number", (request, response) => {
    database.mysqlConnection.query(`delete from accounts where account_number= ${request.query.account_number}`, (error, results) => {
        if (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
        } else {
        response.status(200).send(results);
        }
    });
});

module.exports = { router };
