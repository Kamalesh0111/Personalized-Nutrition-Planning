require('dotenv').config(); // Reads .env file variables

const express = require('express');
const path = require('path'); // <-- The 'path' module is essential for fixing file paths
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());
app.use(cors());

// --- CONFIGURATION & VALIDATION ---

// Load database configuration from .env file
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// Load JWT secret from .env file
const JWT_SECRET = process.env.JWT_SECRET;

// Immediately exit if the JWT_SECRET is not configured.
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in the .env file.");
    process.exit(1);
}

// --- DATABASE INITIALIZATION ---
let db;
async function initializeDatabase() {
    try {
        const tempConnection = await mysql.createConnection({ host: dbConfig.host, user: dbConfig.user, password: dbConfig.password });
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await tempConnection.end();

        db = await mysql.createPool(dbConfig);
        await db.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)`);
        await db.query(`CREATE TABLE IF NOT EXISTS user_inputs (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, age INT, weight DECIMAL(5,2), height DECIMAL(5,2), goal VARCHAR(50), diet_preference VARCHAR(50), activity_level VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id))`);
        await db.query(`CREATE TABLE IF NOT EXISTS recommendations (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, plan_details TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id))`);
        console.log('Database connected and tables verified.');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- API ROUTES ---

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send({ message: 'Username and password are required.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).send({ message: 'User registered successfully!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ message: 'Username already exists.' });
        }
        res.status(500).send({ message: 'Server error during registration.' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).send({ message: 'Invalid credentials.' });
        }

        const user = rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).send({ message: 'Invalid credentials.' });
        }

        const accessToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken });
    } catch (error) {
        res.status(500).send({ message: 'Server error during login.' });
    }
});

// Recommendation Route (ML Integration)
app.post('/api/recommendation', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const userInput = req.body;

    // --- FIX IS HERE ---
    // Construct an absolute path to the python script to make it robust.
    // This goes up one level from /backend, then into /ml_model.
    const scriptPath = path.join(__dirname, '..', 'ml_model', 'predict.py');

    // Use the absolute path in the spawn command.
    const pythonProcess = spawn('python', [scriptPath]);
    // --- END OF FIX ---

    pythonProcess.stdin.write(JSON.stringify(userInput));
    pythonProcess.stdin.end();

    let pythonOutput = '';
    pythonProcess.stdout.on('data', (data) => { pythonOutput += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { console.error(`Python stderr: ${data}`); });

    pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            return res.status(500).send({ message: 'The ML script encountered an error.' });
        }
        try {
            const result = JSON.parse(pythonOutput);
            const recommendationText = result.plan;
            await db.query('INSERT INTO user_inputs (user_id, age, weight, height, goal, diet_preference, activity_level) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, userInput.age, userInput.weight, userInput.height, userInput.goal, userInput.diet_preference, userInput.activity_level]);
            await db.query('INSERT INTO recommendations (user_id, plan_details) VALUES (?, ?)', [userId, recommendationText]);
            res.json({ message: 'Recommendation generated!', plan: recommendationText });
        } catch (err) {
            console.error('Error parsing python output or saving to DB:', err);
            res.status(500).send({ message: 'Failed to process the recommendation from the ML script.' });
        }
    });
});

// History Route
app.get('/api/history', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const [recommendations] = await db.query('SELECT plan_details, created_at FROM recommendations WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(recommendations);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch history.' });
    }
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    initializeDatabase();
    console.log(`Backend server running on http://localhost:${PORT}`);
});