const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

const usersDb = {};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        if (usersDb[username]) {
            return res.status(400).send('User already exists');
        }
        
        usersDb[username] = { password: hashedPassword };
        
        res.status(201).send('User registered');
    } catch {
        res.status(500).send();
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = usersDb[username];
    
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    
    try {
        if (await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken });
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
});

app.get('/protected', authenticateToken, (req, res) => {
    res.send('Welcome to the protected route, ' + req.user.username);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});