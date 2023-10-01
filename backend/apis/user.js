const express = require("express");
const database = require("../database/database");

const router = express.Router();

// Middleware for handling internal server errors (HTTP 500)
function internalError(response, error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
}

// Function to check if the username exists in the database
function checkUsernameExists(username) {
    return new Promise((resolve, reject) => {
        // Execute the SQL query to check if the username exists
        database.mysqlConnection.query("SELECT COUNT(*) as count FROM users WHERE username = ?", [username], (error, results) => {
            if (error) {
                reject(error);
            } else {
                // Check if the count is greater than 0 (username exists)
                const exists = results[0].count > 0;
                resolve(exists);
            }
        });
    });
}

function getEmailForUsername(username) {
    return new Promise((resolve, reject) => {
        const query = "SELECT email FROM users WHERE username = ?";

        database.mysqlConnection.query(query, [username], (error, results) => {
            if (error) {
                // Reject the promise with the error
                reject(error);
            } else if (results.length === 0) {
                // Resolve the promise with null if username not found
                resolve(null);
            } else {
                // Resolve the promise with the email
                resolve(results[0].email);
            }
        });
    });
}

// Function to mask an email address (e.g., "john@hotmail.com" => "j***@hotmail.com")
function maskEmail(email) {
    const [unmaskedUser, domain] = email.split("@");
    const maskedUser = unmaskedUser.charAt(0) + "*".repeat(unmaskedUser.length - 1);
    const maskedEmail = `${maskedUser}@${domain}`;
    return maskedEmail;
}

// Get the data of all users
router.get("/get-all", (request, response) => {
    // Execute the SQL query to fetch all user data
    database.mysqlConnection.query("SELECT * FROM users", (error, results) => {
        if (error) {
            // Handle any database query errors
            internalError(response, error);
        } else {
            // Send the query results (user data) as the response
            response.status(200).send(results);
        }
    });
});

// Get the data of a particular user by specifying user id
router.get("/get-user-by-id", (request, response) => {
    const id = request.query.id;

    if (!id) {
        response.status(400).send("User ID is required");
        return;
    }

    // Execute the SQL query to fetch a user by id
    database.mysqlConnection.query("SELECT * FROM accounts WHERE user_id = ?", [id], (error, results) => {
        if (error) {
            // Handle any database query errors
            internalError(response, error);
        } else if (results.length === 0) {
            // If no user is found, send a 404 response
            response.status(404).send("User not found");
        } else {
            // Send the query results (user data) as the response
            response.status(200).json(results[0]);
        }
    });
});

// Register a new user with username, email, and password
router.post("/register", (request, response) => {
    try {
        const { username, email, password, city } = request.body;

        if (!username || !email || !password) {
            response.status(400).send("Username, email, and password are required fields.");
            return;
        }

        // Step 1: Fetch the last ID from the database
        database.mysqlConnection.query("SELECT MAX(id) as lastId FROM users", (error, results) => {
            if (error) {
                // Handle any database query errors
                internalError(response, error);
            } else {
                // Calculate the new unique ID
                const lastId = results[0].lastId || 0; // Use 0 if there are no existing records
                const newId = lastId + 1;

                // Step 2: Define the SQL query and parameters
                const query = "INSERT INTO users (id, username, email, password, city) VALUES (?, ?, ?, ?, ?)";
                const queryParams = [newId, username, email, password, city];

                // Execute the SQL query to insert a new user
                database.mysqlConnection.query(query, queryParams, (error, results) => {
                    if (error) {
                        // Handle any database query errors
                        internalError(response, error);
                    } else {
                        // Send a 201 (Created) response upon successful registration
                        response.status(201).send("User registered successfully!");
                        console.log("User created with ID:", newId);
                    }
                });
            }
        });
    } catch (error) {
        internalError(response, error);
    }
});

// Forgot password route
router.post("/forgot-password", async (request, response) => {
    try {
        const { username } = request.body;

        if (!username) {
            response.status(400).send("Username is required");
            return;
        }

        // Check if the username exists in your database
        const userExists = await checkUsernameExists(username);

        if (userExists) {
            // Retrieve the email associated with the username
            const email = await getEmailForUsername(username);

            // Mask the email as described (e.g., "j***@hotmail.com")
            const maskedEmail = maskEmail(email);

            // Implement sending a password reset link to the associated email address
            // You can add your email sending logic here

            response.status(200).send(`A link has been sent to the associated email address ${maskedEmail}!`);
        } else {
            response.status(404).send("User does not exist!");
        }
    } catch (error) {
        internalError(response, error);
    }
});

module.exports = { router };
