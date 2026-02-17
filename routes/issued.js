const express = require("express");

module.exports = (db) => {

    const router = express.Router();

    // 🔹 Get all currently issued books (not returned)
    router.get("/", (req, res) => {

        const sql = `
            SELECT 
                u.username,
                b.book_code,
                br.return_date
            FROM borrow br
            INNER JOIN users u ON br.user_id = u.id
            INNER JOIN books b ON br.book_id = b.id
            WHERE br.returned = 'no'
        `;

        db.query(sql, (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json(results);
        });
    });

    return router;
};
