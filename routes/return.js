const express = require("express");

module.exports = (db) => {

    const returnRoute = express.Router();

    returnRoute.post("/", (req, res) => {

        const { username, book_code } = req.body;

        if (!username || !book_code) {
            return res.status(400).json({ error: "Username and book code required" });
        }

        // 1️⃣ Get user_id
        const userQuery = "SELECT id FROM users WHERE username = ?";

        db.query(userQuery, [username], (err, userResult) => {

            if (err) return res.status(500).json({ error: "User lookup failed" });
            if (userResult.length === 0)
                return res.status(404).json({ error: "User not found" });

            const user_id = userResult[0].id;

            // 2️⃣ Get book_id
            const bookQuery = "SELECT id FROM books WHERE book_code = ?";

            db.query(bookQuery, [book_code], (err2, bookResult) => {

                if (err2) return res.status(500).json({ error: "Book lookup failed" });
                if (bookResult.length === 0)
                    return res.status(404).json({ error: "Book not found" });

                const book_id = bookResult[0].id;

                // 3️⃣ Find active borrow record
                const borrowQuery = `
                    SELECT id, return_date 
                    FROM borrow
                    WHERE user_id = ? AND book_id = ? AND returned = 'no'
                `;

                db.query(borrowQuery, [user_id, book_id], (err3, borrowResult) => {

                    if (err3) return res.status(500).json({ error: "Borrow lookup failed" });
                    if (borrowResult.length === 0)
                        return res.status(400).json({ error: "No active issued record found" });

                    const borrow_id = borrowResult[0].id;
                    const expectedReturnDate = new Date(borrowResult[0].return_date);
                    const today = new Date();

                    // Remove time part
                    today.setHours(0,0,0,0);
                    expectedReturnDate.setHours(0,0,0,0);

                    let fine = 0;

                    if (today > expectedReturnDate) {
                        const diffTime = today - expectedReturnDate;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        fine = diffDays * 1; // ₹1 per day
                    }

                    // 4️⃣ Update borrow record
                    const updateBorrow = `
                        UPDATE borrow
                        SET returned = 'yes',
                            return_date = CURDATE()
                        WHERE id = ?
                    `;

                    db.query(updateBorrow, [borrow_id], (err4) => {

                        if (err4) return res.status(500).json({ error: "Return update failed" });

                        // 5️⃣ Increase stock
                        const updateBook = `
                            UPDATE books
                            SET available_copies = available_copies + 1
                            WHERE id = ?
                        `;

                        db.query(updateBook, [book_id], (err5) => {

                            if (err5) return res.status(500).json({ error: "Stock update failed" });

                            res.json({
                                message: "Book returned successfully",
                                fine: fine
                            });
                        });
                    });
                });
            });
        });
    });

    return returnRoute;
};
