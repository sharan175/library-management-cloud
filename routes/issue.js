const express = require("express");

module.exports = (db) => {

    const router = express.Router();

    // 🔹 Issue Book API
    router.post("/", (req, res) => {

        const { username, book_code, borrow_date, return_date } = req.body;

        if (!username || !book_code || !borrow_date || !return_date) {
            return res.status(400).json({ error: "All fields required" });
        }

        // 1️⃣ Get user_id
        const userSql = "SELECT id FROM users WHERE username = ?";
        db.query(userSql, [username], (err, userResult) => {

            if (err) return res.status(500).json({ error: "User lookup failed" });

            if (userResult.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const user_id = userResult[0].id;

            // 2️⃣ Get book_id and check availability
            const bookSql = "SELECT id, available_copies FROM books WHERE book_code = ?";
            db.query(bookSql, [book_code], (err2, bookResult) => {

                if (err2) return res.status(500).json({ error: "Book lookup failed" });

                if (bookResult.length === 0) {
                    return res.status(404).json({ error: "Book not found" });
                }

                const book = bookResult[0];

                if (book.available_copies <= 0) {
                    return res.status(400).json({ error: "No copies available" });
                }

                const book_id = book.id;

                // 3️⃣ Insert into borrow table
                const insertSql = `
                    INSERT INTO borrow (user_id, book_id, borrow_date, return_date, returned)
                    VALUES (?, ?, ?, ?, 'no')
                `;

                db.query(insertSql, [user_id, book_id, borrow_date, return_date], (err3) => {

                    if (err3) return res.status(500).json({ error: "Issue failed" });

                    // 4️⃣ Reduce available copies
                    const updateSql = `
                        UPDATE books 
                        SET available_copies = available_copies - 1
                        WHERE id = ?
                    `;

                    db.query(updateSql, [book_id], (err4) => {
                        if (err4) return res.status(500).json({ error: "Stock update failed" });

                        res.json({ message: "Book issued successfully" });
                    });

                });

            });

        });

    });

    return router;
};
