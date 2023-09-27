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

module.exports = { router };
