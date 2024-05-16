const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const router = express.Router();

// Define routes here

module.exports = router;

dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    insecureAuth: true // Add this option
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'hbs');

db.connect((error) => {
    if (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    } else {
        console.log("Connected to MySQL database");
    }
});

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    console.error('Promise:', promise);
});
