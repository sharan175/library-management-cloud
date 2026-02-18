require("dotenv").config();

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");
const app = express();
app.use(cors({
  origin: "http://localhost:4000",
  credentials: true
}));
app.use(express.json());
app.use(express.static("public"));
// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});
app.use(session({
    secret: "library_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
// Import auth routes
const authRoutes = require("./routes/auth")(db);
app.use("/auth", authRoutes);
const booksRoutes = require("./routes/books")(db);
app.use("/books", booksRoutes);
// 🔹 Import issue routes
const issueRoutes = require("./routes/issue")(db);
app.use("/issue", issueRoutes);
//issued books
const issuedRoute = require("./routes/issued")(db);
app.use("/issued", issuedRoute);
//returned book
const returnRoute = require("./routes/return")(db);
app.use("/return", returnRoute);
const studentRoutes = require("./routes/student")(db);
app.use("/student", studentRoutes);
app.listen(process.env.PORT || 4000, () => {
  console.log("Server running");
});
