const express = require("express");

module.exports = (db) => {

    const router = express.Router();

    // 🔐 Middleware to check login
    function checkAuth(req, res, next) {
        if (!req.session.user) {
            return res.status(401).json({ error: "Not logged in" });
        }
        next();
    }

    // =========================================
    // 1️⃣ GET STUDENT PROFILE
    // =========================================
    router.get("/profile", checkAuth, (req, res) => {

        const userId = req.session.user.id;

        const sql = `
            SELECT name, username, email
            FROM users
            WHERE id = ?
        `;

        db.query(sql, [userId], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });

            res.json(results[0]);
        });
    });


    // =========================================
    // 2️⃣ GET FULL BORROW HISTORY
    // =========================================
    router.get("/history", checkAuth, (req, res) => {

        const userId = req.session.user.id;

        const sql = `
            SELECT 
                b.book_code,
                b.title,
                br.borrow_date,
                br.return_date,
                br.returned
            FROM borrow br
            JOIN books b ON br.book_id = b.id
            WHERE br.user_id = ?
            ORDER BY br.borrow_date DESC
        `;

        db.query(sql, [userId], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });

            res.json(results);
        });
    });


    // =========================================
    // 3️⃣ GET CURRENTLY BORROWED
    // =========================================
    router.get("/current", checkAuth, (req, res) => {

        const userId = req.session.user.id;

        const sql = `
            SELECT 
                b.book_code,
                b.title,
                br.borrow_date,
                br.return_date
            FROM borrow br
            JOIN books b ON br.book_id = b.id
            WHERE br.user_id = ?
            AND br.returned = 'no'
            ORDER BY br.borrow_date DESC
        `;

        db.query(sql, [userId], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });

            res.json(results);
        });
    });


    return router;
};
