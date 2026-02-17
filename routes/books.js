const express = require("express");

module.exports = (db) => {

    const router = express.Router();

    // ==============================
    // 🔹 GET ALL BOOKS
    // ==============================
    router.get("/", (req, res) => {

        const sql = `
            SELECT id, book_code, title, author, total_copies, available_copies
            FROM books
            ORDER BY created_at DESC
        `;

        db.query(sql, (err, results) => {
            if (err) {
                console.error("GET BOOKS ERROR:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json(results);
        });
    });



    // ==============================
    // 🔹 UPDATE OR CREATE BOOK
    // ==============================
    router.put("/update-copies", (req, res) => {

        const { book_code, change, title, author } = req.body;

        if (!book_code || change === undefined) {
            return res.status(400).json({
                error: "Book code and change value required"
            });
        }

        const getSql = `
            SELECT total_copies, available_copies
            FROM books
            WHERE book_code = ?
        `;

        db.query(getSql, [book_code], (err, results) => {

            if (err) {
                console.error("SELECT ERROR:", err);
                return res.status(500).json({ error: "Database error" });
            }

            // ==================================
            // 🔹 IF BOOK EXISTS → UPDATE
            // ==================================
            if (results.length > 0) {

                const book = results[0];

                const newTotal = book.total_copies + change;
                const newAvailable = book.available_copies + change;

                if (newTotal < 0 || newAvailable < 0) {
                    return res.status(400).json({
                        error: "Invalid copy reduction"
                    });
                }

                const updateSql = `
                    UPDATE books
                    SET total_copies = ?, available_copies = ?
                    WHERE book_code = ?
                `;

                db.query(updateSql,
                    [newTotal, newAvailable, book_code],
                    (err2) => {

                        if (err2) {
                            console.error("UPDATE ERROR:", err2);
                            return res.status(500).json({ error: "Update failed" });
                        }

                        return res.json({
                            message: "Copies updated successfully",
                            total_copies: newTotal,
                            available_copies: newAvailable
                        });
                    }
                );

            }

            // ==================================
            // 🔹 IF BOOK DOES NOT EXIST → CREATE
            // ==================================
            else {

                if (!title || !author) {
                    return res.status(400).json({
                        error: "Title and author required to create new book"
                    });
                }

                if (change < 0) {
                    return res.status(400).json({
                        error: "Cannot create book with negative copies"
                    });
                }

                const insertSql = `
                    INSERT INTO books
                    (book_code, title, author, total_copies, available_copies)
                    VALUES (?, ?, ?, ?, ?)
                `;

                db.query(insertSql,
                    [book_code, title, author, change, change],
                    (err3) => {

                        if (err3) {
                            console.error("INSERT ERROR:", err3);
                            return res.status(500).json({ error: "Insert failed" });
                        }

                        return res.json({
                            message: "New book created successfully",
                            total_copies: change,
                            available_copies: change
                        });
                    }
                );
            }

        });

    });

    return router;
};
