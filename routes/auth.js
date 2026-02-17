const express = require("express");

module.exports = (db) => {

    const router = express.Router();

    // ======================================
    // 🔹 SIGNUP
    // ======================================
    router.post("/signup", (req, res) => {

        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

        const sql = `
            INSERT INTO users (name, username, email, password, role)
            VALUES (?, ?, ?, ?, 'student')
        `;

        db.query(sql, [name, username, email, password], (err) => {

            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ error: "Username or email already exists" });
                }

                console.error("SIGNUP ERROR:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json({ message: "Signup successful" });
        });
    });



    // ======================================
    // 🔹 LOGIN (WITH SESSION)
    // ======================================
    router.post("/login", (req, res) => {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        const sql = `
            SELECT id, username, role
            FROM users
            WHERE username = ? AND password = ?
        `;

        db.query(sql, [username, password], (err, results) => {

            if (err) {
                console.error("LOGIN ERROR:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const user = results[0];

            // 🔥 Store session
            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };

            res.json({
                message: "Login successful",
                role: user.role
            });
        });
    });



    // ======================================
    // 🔹 LOGOUT
    // ======================================
    router.post("/logout", (req, res) => {

        if (!req.session.user) {
            return res.status(400).json({ error: "Not logged in" });
        }

        req.session.destroy(() => {
            res.json({ message: "Logged out successfully" });
        });
    });


    return router;
};
