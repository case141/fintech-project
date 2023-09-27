const express = require("express");
const user = require("./apis/user");
const accounts = require("./apis/accounts");

const service = express();

service.use(express.json());

//service.use("/user", user.router);
service.use("/accounts", accounts.router);

service.listen(3000, (error) => {
  if (error) {
    console.error("Error occurred while starting the service");
  } else {
    console.log("Server started on port 3000");
  }
});

// File 1 - Mock Data Layer
// File 2 - Logic for all the APIs
// File 3 - Logic to start the service
