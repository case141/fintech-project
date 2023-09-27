const express = require("express");
const database = require("../database/database");

const router = express.Router();

// Middleware for handling internal server errors (HTTP 500)
function internalError(response, error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
}

// Define routes

// Get the data of all users
router.get("/get-all", (request, response) => {
    try {
        const users = database.get_all_users();
        response.status(200).send(users);
    } catch (error) {
        internalError(response, error);
    }
});

// Get the data of a particular user by specifying user id
router.get("/get-user-by-id", (request, response) => {
    const id = request.query.id;

    if (!id) {
        response.status(400).send("User ID is required");
        return;
    }

    try {
        const user = database.get_user_by_user_id(id);

        if (!user) {
            response.status(404).send("User not found");
            return;
        }

        response.status(200).send(user);
    } catch (error) {
        internalError(response, error);
    }
});

// Add a new user
router.post("/add-user", (request, response) => {
    try {
        const { first_name, last_name, email, phone } = request.body;

        if (!first_name || !last_name || !email || !phone) {
            response.status(400).send("All fields are required");
            return;
        }

        database.add_user({
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone": phone,
        });

        response.status(201).send("User added successfully!");
    } catch (error) {
        internalError(response, error);
    }
});

module.exports = { router };
