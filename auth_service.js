const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const userDatabase = {};

const logActivity = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${message}`);
};

const verifyAuthenticationToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        logActivity('Attempt to access protected route without a token');
        return res.status(401).send({ message: 'No token provided' });
    }

    const authToken = authHeader.split(' ')[1];
    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decodedUser) => {
        if (err) {
            logActivity(`Failed token authentication attempt by ${decodedUser ? decodedUser.username : 'unknown'}`);
            return res.status(403).send({ message: 'Failed to authenticate token.' });
        }
        req.user = decodedUser;
        next();
    });
};

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        logActivity('Failed registration attempt due to missing username or password');
        return res.status(400).send({ message: 'Username and password are required' });
    }

    if (userDatabase[username]) {
        logActivity(`Failed registration attempt for existing user: ${username}`);
        return res.status(400).send({ message: 'User already exists' });
    }

    try {
        userDatabase[username] = { password: await bcrypt.hash(password, 10) };
        logActivity(`User registered successfully: ${username}`);
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        logActivity(`Failed to register user: ${username}, Error: ${error.message}`);
        res.status(500).send({ message: 'Failed to register user', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userInDb = userDatabase[username];

    if (!username || !password || userInDb == null) {
        logActivity('Failed login attempt due to invalid username or password');
        return res.status(400).send({ message: 'Invalid username or password' });
    }

    try {
        if (await bcrypt.compare(password, userInDb.password)) {
            const accessToken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            logActivity(`User logged in successfully: ${username}`);
            res.json({ accessToken: accessToken });
        } else {
            logActivity(`Failed login attempt for user: ${username} due to incorrect password`);
            res.status(403).send({ message: 'Login failed, incorrect password' });
        }
    } catch (error) {
        logActivity(`Login error for user: ${username}, Error: ${error.message}`);
        res.status(500).send({ message: 'Failed to log in', error: error.message });
    }
});

app.get('/protected', verifyAuthenticationToken, (req, res) => {
    logActivity(`Access to protected route by user: ${req.user.username}`);
    res.send(`Welcome to the protected route, ${req.user.username}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});